'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ROOMS, RoomId, getRoomById } from '@/lib/portfolio-data';

export type CameraMode = 'orbit' | 'fps' | 'tps';
export type VisualStyle3D = 'studio' | 'maquette' | 'cozy';

export interface VirtualOfficeCanvasProps {
  activeRoom: RoomId;
  reducedMotion: boolean;
  cameraMode: CameraMode;
  zenMode: boolean;
  showFloorPlan: boolean;
  isDrawerOpen?: boolean;
  isPlaceSelected?: boolean;
  onChangeCameraMode: (mode: CameraMode) => void;
  onToggleZenMode: () => void;
  onToggleFloorPlan: () => void;
  onSelectRoom: (roomId: RoomId) => void;
  onClickRoom?: (roomId: RoomId) => void;
  onDismissPlace?: () => void;
  onOpenRoomDetail: (roomId: RoomId) => void;
  onSceneReady: () => void;
  onSceneError: (reason: string) => void;
}

interface BoxCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

interface CircleCollider {
  x: number;
  z: number;
  radius: number;
}

const PLAYER_RADIUS = 0.38;

// Safe, unobstructed standing/spawn coordinates for each room (never overlapping furniture)
export function getRoomSpawnPoint(roomId: RoomId): [number, number, number] {
  switch (roomId) {
    case 'lobby':
      return [0, 0, 4.1];
    case 'projects':
      return [-8.0, 0, -5.2];
    case 'systems':
      return [8.0, 0, -5.2];
    case 'experience':
      return [-11.5, 0, 9.6];
    case 'cases':
      return [11.5, 0, 9.6];
    case 'contact':
      return [1.8, 0, 13.4];
    default:
      return [0, 0, 4.1];
  }
}

// Pre-allocated scratch math helpers at module scope (zero GC in loop)
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _projVec = new THREE.Vector3();
const _moveVec = new THREE.Vector3();
const _camOffset = new THREE.Vector3();
const _forwardDir = new THREE.Vector3();
const _rightDir = new THREE.Vector3();
const _orbitOffset = new THREE.Vector3();
const _spherical = new THREE.Spherical();

// Orbit boundary constraints so camera/target never drift far outside the office building
const ORBIT_TARGET_MIN_X = -15.5;
const ORBIT_TARGET_MAX_X = 15.5;
const ORBIT_TARGET_MIN_Y = 0.4;
const ORBIT_TARGET_MAX_Y = 2.8;
const ORBIT_TARGET_MIN_Z = -11.0;
const ORBIT_TARGET_MAX_Z = 14.2;
const ORBIT_MIN_DISTANCE = 4.5;
const ORBIT_MAX_DISTANCE = 28.5;

function createWoodParquetTexture(maxAnisotropy: number): THREE.CanvasTexture {
  // Smooth anti-aliased 512x512 Scandinavian oak parquet texture (zero pixel shimmer)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#d8b78e';
    ctx.fillRect(0, 0, 512, 512);

    const plankH = 64;
    const plankW = 256;
    const tones = ['#dec09a', '#d5b48b', '#e2c6a2', '#d1af84', '#dbb990'];

    for (let y = 0; y < 512; y += plankH) {
      const rowIndex = Math.floor(y / plankH);
      const offset = (rowIndex % 2) * (plankW / 2);
      for (let x = -plankW; x < 512; x += plankW) {
        const px = x + offset;
        const tone = tones[(rowIndex + Math.abs(Math.floor(x / plankW))) % tones.length];
        ctx.fillStyle = tone;
        ctx.fillRect(px, y, plankW, plankH);

        // Subtle soft wood grain lines
        ctx.fillStyle = 'rgba(160, 118, 74, 0.14)';
        ctx.fillRect(px + 18, y + 18, plankW - 36, 3);
        ctx.fillRect(px + 36, y + 42, plankW - 64, 2);

        // Soft plank seam
        ctx.strokeStyle = 'rgba(130, 92, 52, 0.28)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, y, plankW, plankH);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(9, 7);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createWhiteboardTexture(
  title: string,
  subtitle: string,
  accentHex: string,
  cards: { title: string; tag: string; status: string }[],
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 512);

    // Clean architectural header bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(28, 24, 968, 68);
    ctx.fillStyle = accentHex;
    ctx.fillRect(28, 86, 968, 6);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(title, 48, 66);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px monospace';
    ctx.fillText(subtitle, 760, 66);

    const cols = 3;
    cards.slice(0, 6).forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = 36 + col * 320;
      const cy = 118 + row * 184;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx, cy, 296, 156);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, 296, 156);

      ctx.fillStyle = accentHex;
      ctx.fillRect(cx, cy, 296, 10);

      ctx.fillStyle = '#0f172a';
      ctx.font = '600 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(card.title, cx + 20, cy + 52);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx + 20, cy + 78, 256, 12);
      ctx.fillStyle = accentHex;
      ctx.fillRect(cx + 20, cy + 78, 175 + (idx % 3) * 28, 12);

      ctx.fillStyle = '#475569';
      ctx.font = '500 17px monospace';
      ctx.fillText(`${card.tag} · ${card.status}`, cx + 20, cy + 128);
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadow(radius: number, opacity = 0.22): THREE.Mesh {
  const geo = new THREE.CircleGeometry(radius, 24);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.015;
  return mesh;
}

function createOfficeChair(seatColorHex: number): THREE.Group {
  const chair = new THREE.Group();
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.6,
  });
  const fabricMat = new THREE.MeshStandardMaterial({
    color: seatColorHex,
    roughness: 0.75,
    metalness: 0.05,
  });

  const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 16), darkMetal);
  baseRing.position.y = 0.05;
  chair.add(baseRing);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 10), darkMetal);
  stem.position.y = 0.26;
  chair.add(stem);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), fabricMat);
  seat.position.y = 0.48;
  seat.castShadow = true;
  chair.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.56, 0.07), fabricMat);
  backrest.position.set(0, 0.78, -0.23);
  backrest.rotation.x = -0.08;
  backrest.castShadow = true;
  chair.add(backrest);

  [-0.27, 0.27].forEach((x) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.34), darkMetal);
    arm.position.set(x, 0.6, -0.02);
    chair.add(arm);
  });

  chair.add(createContactShadow(0.36, 0.18));
  return chair;
}

function createWorkstationDesk(
  chairColorHex: number,
  screenColorHex: number,
  hasDualMonitors = true
): THREE.Group {
  const deskGroup = new THREE.Group();

  const oakMat = new THREE.MeshStandardMaterial({
    color: 0xe2c499,
    roughness: 0.55,
    metalness: 0.05,
  });
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.65,
  });
  const monitorBezelMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.3,
    metalness: 0.5,
  });
  const screenGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: new THREE.Color(screenColorHex),
    emissiveIntensity: 0.55,
    roughness: 0.2,
  });

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.85), oakMat);
  top.position.y = 0.75;
  top.castShadow = true;
  top.receiveShadow = true;
  deskGroup.add(top);

  [
    [-0.82, -0.36],
    [0.82, -0.36],
    [-0.82, 0.36],
    [0.82, 0.36],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.74, 0.05), legMat);
    leg.position.set(lx, 0.37, lz);
    leg.castShadow = true;
    deskGroup.add(leg);
  });

  const monitorPositions = hasDualMonitors ? [-0.36, 0.36] : [0];
  monitorPositions.forEach((mx, idx) => {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.18, 10), legMat);
    stand.position.set(mx, 0.86, -0.18);
    deskGroup.add(stand);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.04), monitorBezelMat);
    bezel.position.set(mx, 1.08, -0.18);
    if (hasDualMonitors) {
      bezel.rotation.y = idx === 0 ? 0.14 : -0.14;
    }
    bezel.castShadow = true;
    deskGroup.add(bezel);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.32), screenGlowMat);
    screen.position.set(mx, 1.08, -0.158);
    if (hasDualMonitors) {
      screen.rotation.y = idx === 0 ? 0.14 : -0.14;
    }
    deskGroup.add(screen);
  });

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.015, 0.13),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
  );
  keyboard.position.set(0, 0.79, 0.14);
  deskGroup.add(keyboard);

  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.04, 0.1, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
  );
  mug.position.set(0.68, 0.83, 0.16);
  deskGroup.add(mug);

  const chair = createOfficeChair(chairColorHex);
  chair.position.set(0, 0, 0.62);
  chair.rotation.y = Math.PI;
  deskGroup.add(chair);

  return deskGroup;
}

function createPottedPlant(scale = 1): THREE.Group {
  const plant = new THREE.Group();
  const potMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.6,
    metalness: 0.05,
  });
  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    roughness: 0.9,
  });
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.55,
    metalness: 0.05,
  });
  const lightLeafMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
    metalness: 0.05,
  });

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.58, 16), potMat);
  pot.position.y = 0.29;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plant.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 14), soilMat);
  soil.position.y = 0.57;
  plant.add(soil);

  const foliageOffsets: [number, number, number, number][] = [
    [0, 1.05, 0, 0.38],
    [-0.22, 0.92, 0.16, 0.28],
    [0.24, 0.96, -0.14, 0.3],
    [-0.16, 1.25, -0.18, 0.26],
    [0.18, 1.28, 0.18, 0.25],
  ];
  foliageOffsets.forEach(([fx, fy, fz, r], idx) => {
    const bush = new THREE.Mesh(
      new THREE.DodecahedronGeometry(r, 1),
      idx % 2 === 0 ? leafMat : lightLeafMat
    );
    bush.position.set(fx, fy, fz);
    bush.castShadow = true;
    plant.add(bush);
  });

  plant.add(createContactShadow(0.45, 0.22));
  plant.scale.setScalar(scale);
  return plant;
}

function createOfficeBookshelf(): THREE.Group {
  const shelf = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xc89d6c,
    roughness: 0.6,
    metalness: 0.05,
  });
  const backMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.8,
  });

  const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.3, 0.06), backMat);
  back.position.set(0, 1.15, -0.2);
  back.castShadow = true;
  shelf.add(back);

  [-1.06, 1.06].forEach((sx) => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.3, 0.46), woodMat);
    side.position.set(sx, 1.15, 0);
    side.castShadow = true;
    shelf.add(side);
  });

  const binderColors = [0x0ea5e9, 0x8b5cf6, 0x10b981, 0xf59e0b, 0xf43f5e, 0x3b82f6];
  [0.12, 0.72, 1.32, 1.92, 2.26].forEach((sy, sIdx) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.46), woodMat);
    board.position.set(0, sy, 0);
    board.castShadow = true;
    shelf.add(board);

    if (sIdx < 4) {
      for (let b = 0; b < 7; b++) {
        const binderMat = new THREE.MeshStandardMaterial({
          color: binderColors[(sIdx * 3 + b) % binderColors.length],
          roughness: 0.45,
        });
        const binder = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.32), binderMat);
        binder.position.set(-0.82 + b * 0.26, sy + 0.24, 0.02);
        binder.castShadow = true;
        shelf.add(binder);
      }
    }
  });

  return shelf;
}

function createGlassPartitionWall(width: number, height = 2.65): THREE.Group {
  const wall = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.7,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.32,
    roughness: 0.1,
    metalness: 0.1,
  });
  const frostedStripeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    roughness: 0.4,
  });

  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, 0.08), frameMat);
  bottomRail.position.y = 0.04;
  wall.add(bottomRail);

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, 0.08), frameMat);
  topRail.position.y = height - 0.04;
  wall.add(topRail);

  const pane = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, height - 0.16, 0.03), glassMat);
  pane.position.y = height / 2;
  wall.add(pane);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.45, 0.035), frostedStripeMat);
  stripe.position.y = 1.15;
  wall.add(stripe);

  const segments = Math.max(2, Math.round(width / 2.2));
  for (let i = 0; i <= segments; i++) {
    const x = -width / 2 + (i / segments) * width;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, height, 0.08), frameMat);
    post.position.set(x, height / 2, 0);
    wall.add(post);
  }

  return wall;
}

interface AvatarRig {
  group: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  headGroup: THREE.Group;
}

function createRizalAvatar(): AvatarRig {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const blazerMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const badgeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: new THREE.Color(0x0284c7),
    emissiveIntensity: 0.5,
  });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

  const ringGeo = new THREE.RingGeometry(0.42, 0.52, 28);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.025;
  group.add(ring);

  group.add(createContactShadow(0.45, 0.35));

  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.13, 0.78, 0);
  const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.2), pantsMat);
  leftThigh.position.y = -0.34;
  leftThigh.castShadow = true;
  leftLeg.add(leftThigh);
  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.1, 0.28), shoeMat);
  leftShoe.position.set(0, -0.72, 0.05);
  leftLeg.add(leftShoe);
  group.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.13, 0.78, 0);
  const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.2), pantsMat);
  rightThigh.position.y = -0.34;
  rightThigh.castShadow = true;
  rightLeg.add(rightThigh);
  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.1, 0.28), shoeMat);
  rightShoe.position.set(0, -0.72, 0.05);
  rightLeg.add(rightShoe);
  group.add(rightLeg);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.26), blazerMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  const shirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.56, 0.04), shirtMat);
  shirtFront.position.set(0, 1.11, 0.125);
  group.add(shirtFront);

  const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.03), badgeMat);
  idBadge.position.set(-0.12, 1.16, 0.135);
  group.add(idBadge);

  const leftArm = new THREE.Group();
  leftArm.position.set(0.32, 1.36, 0);
  const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.16), blazerMat);
  leftSleeve.position.y = -0.24;
  leftSleeve.castShadow = true;
  leftArm.add(leftSleeve);
  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), skinMat);
  leftHand.position.y = -0.54;
  leftArm.add(leftHand);
  group.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(-0.32, 1.36, 0);
  const rightSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.16), blazerMat);
  rightSleeve.position.y = -0.24;
  rightSleeve.castShadow = true;
  rightArm.add(rightSleeve);
  const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), skinMat);
  rightHand.position.y = -0.54;
  rightArm.add(rightHand);
  group.add(rightArm);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.46, 0);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), skinMat);
  head.position.y = 0.2;
  head.castShadow = true;
  headGroup.add(head);

  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.36), hairMat);
  hairTop.position.set(0, 0.36, 0);
  headGroup.add(hairTop);

  const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.08), hairMat);
  hairBack.position.set(0, 0.24, -0.15);
  headGroup.add(hairBack);

  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.04), hairMat);
  glasses.position.set(0, 0.22, 0.17);
  headGroup.add(glasses);

  group.add(headGroup);

  return { group, leftLeg, rightLeg, leftArm, rightArm, headGroup };
}

export default function VirtualOfficeCanvas({
  activeRoom,
  reducedMotion,
  cameraMode,
  zenMode,
  showFloorPlan,
  isDrawerOpen = false,
  isPlaceSelected = false,
  onChangeCameraMode,
  onToggleZenMode,
  onToggleFloorPlan,
  onSelectRoom,
  onClickRoom,
  onDismissPlace,
  onOpenRoomDetail,
  onSceneReady,
  onSceneError,
}: VirtualOfficeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hotspotContainerRef = useRef<HTMLDivElement>(null);
  const activeRoomRef = useRef<RoomId>(activeRoom);
  const reducedMotionRef = useRef<boolean>(reducedMotion);
  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const zenModeRef = useRef<boolean>(zenMode);
  const isDrawerOpenRef = useRef<boolean>(isDrawerOpen);
  const isPlaceSelectedRef = useRef<boolean>(isPlaceSelected);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const syncVisualStyleRef = useRef<((style: VisualStyle3D) => void) | null>(null);

  const [visualStyle, setVisualStyle] = useState<VisualStyle3D>('studio');
  const visualStyleRef = useRef<VisualStyle3D>('studio');

  const handleCycleVisualStyle = () => {
    setVisualStyle((prev) => {
      const next: VisualStyle3D =
        prev === 'studio' ? 'maquette' : prev === 'maquette' ? 'cozy' : 'studio';
      visualStyleRef.current = next;
      if (syncVisualStyleRef.current) {
        syncVisualStyleRef.current(next);
      }
      if (requestRenderRef.current) {
        requestRenderRef.current();
      }
      return next;
    });
  };

  const hoveredRoomIdRef = useRef<RoomId | null>(null);
  const isCameraTransitioningRef = useRef<boolean>(false);

  // Player / Avatar state for FPS and TPS modes (spawned at unobstructed Lobby walkway z = 4.1)
  const initialSpawn = getRoomSpawnPoint(activeRoom);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...initialSpawn));
  const cameraOrbitYawRef = useRef<number>(Math.PI);
  const avatarFacingYawRef = useRef<number>(Math.PI);
  const playerPitchRef = useRef<number>(-0.18);
  const tpsDistanceRef = useRef<number>(4.8);
  const walkTargetRef = useRef<THREE.Vector3 | null>(null);

  const keysPressedRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    turnLeft: boolean;
    turnRight: boolean;
    lookUp: boolean;
    lookDown: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
    lookUp: false,
    lookDown: false,
  });

  const fpsEdgeTurnRef = useRef<number>(0);

  // Mobile Legends-style 360° Movement Analog Joystick vector (-1..1)
  // Camera on mobile is controlled directly by touching/dragging the screen
  const moveJoystickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const moveStickCenterRef = useRef<{ x: number; y: number } | null>(null);
  const moveStickTouchIdRef = useRef<number | null>(null);

  const [moveStickUi, setMoveStickUi] = useState<{
    x: number;
    y: number;
    active: boolean;
    angleDeg: number;
  }>({ x: 0, y: 0, active: false, angleDeg: 0 });

  useEffect(() => {
    const prevMode = cameraModeRef.current;
    cameraModeRef.current = cameraMode;
    walkTargetRef.current = null;
    fpsEdgeTurnRef.current = 0;

    if (prevMode !== cameraMode) {
      if (
        cameraMode !== 'fps' &&
        typeof document !== 'undefined' &&
        document.pointerLockElement
      ) {
        try {
          document.exitPointerLock?.();
        } catch {
          // Ignore pointer lock exit errors in iframe
        }
      }

      if (cameraMode === 'orbit') {
        isCameraTransitioningRef.current = true;
      } else {
        isCameraTransitioningRef.current = false;
        const spawn = getRoomSpawnPoint(activeRoomRef.current);
        playerPosRef.current.set(...spawn);
        cameraOrbitYawRef.current = Math.PI;
        avatarFacingYawRef.current = Math.PI;
        playerPitchRef.current = cameraMode === 'fps' ? -0.04 : -0.22;
      }
    }

    const canvasEl = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    if (canvasEl) {
      canvasEl.style.cursor =
        cameraMode === 'fps' && !isDrawerOpenRef.current ? 'none' : 'grab';
    }

    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [cameraMode]);

  useEffect(() => {
    zenModeRef.current = zenMode;
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [zenMode]);

  useEffect(() => {
    isDrawerOpenRef.current = isDrawerOpen;
    if (isDrawerOpen) {
      keysPressedRef.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        turnLeft: false,
        turnRight: false,
        lookUp: false,
        lookDown: false,
      };
      walkTargetRef.current = null;
      fpsEdgeTurnRef.current = 0;
      moveJoystickRef.current = { x: 0, y: 0 };
      setMoveStickUi({ x: 0, y: 0, active: false, angleDeg: 0 });
      isCameraTransitioningRef.current = false;
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try {
          document.exitPointerLock?.();
        } catch {
          // Ignore pointer lock exit errors
        }
      }
    }
    const canvasEl = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    if (canvasEl) {
      canvasEl.style.cursor =
        cameraModeRef.current === 'fps' && !isDrawerOpen ? 'none' : 'grab';
    }
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    const prevRoom = activeRoomRef.current;
    activeRoomRef.current = activeRoom;

    if (prevRoom !== activeRoom && !isDrawerOpenRef.current) {
      if (cameraModeRef.current === 'orbit') {
        isCameraTransitioningRef.current = true;
      } else {
        const spawn = getRoomSpawnPoint(activeRoom);
        playerPosRef.current.set(...spawn);
        cameraOrbitYawRef.current = Math.PI;
        avatarFacingYawRef.current = Math.PI;
        walkTargetRef.current = null;
      }
    }

    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [activeRoom]);

  useEffect(() => {
    isPlaceSelectedRef.current = isPlaceSelected;
  }, [isPlaceSelected]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [reducedMotion]);

  const handleResetView = () => {
    if (isDrawerOpenRef.current) return;
    onDismissPlace?.();
    if (cameraModeRef.current === 'orbit') {
      isCameraTransitioningRef.current = true;
    } else {
      const spawn = getRoomSpawnPoint(activeRoomRef.current);
      playerPosRef.current.set(...spawn);
      cameraOrbitYawRef.current = Math.PI;
      avatarFacingYawRef.current = Math.PI;
      playerPitchRef.current = cameraModeRef.current === 'fps' ? -0.04 : -0.22;
      walkTargetRef.current = null;
    }
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  };

  const setPadState = (
    key: keyof typeof keysPressedRef.current,
    val: boolean
  ) => {
    if (isDrawerOpenRef.current) {
      keysPressedRef.current[key] = false;
      return;
    }
    keysPressedRef.current[key] = val;
    if (val) walkTargetRef.current = null;
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  };

  // Mobile Legends-style Analog Stick helpers (maxRadius = 36px for move, 30px for look)
  const updateMoveAnalogFromPoint = (
    clientX: number,
    clientY: number,
    maxRadius = 36
  ) => {
    if (!moveStickCenterRef.current || isDrawerOpenRef.current) return;
    const rawDx = clientX - moveStickCenterRef.current.x;
    const rawDy = clientY - moveStickCenterRef.current.y;
    const dist = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(dist, maxRadius);
    const angleRad = Math.atan2(rawDy, rawDx);
    const visualX = dist > 0 ? Math.cos(angleRad) * clampedDist : 0;
    const visualY = dist > 0 ? Math.sin(angleRad) * clampedDist : 0;

    // Normalized [-1, 1], with y inverted so dragging UP on screen is +1 (forward)
    const normX = visualX / maxRadius;
    const normY = -visualY / maxRadius;

    moveJoystickRef.current = { x: normX, y: normY };
    walkTargetRef.current = null;
    setMoveStickUi({
      x: visualX,
      y: visualY,
      active: true,
      angleDeg: (angleRad * 180) / Math.PI + 90,
    });
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  };

  const resetMoveAnalog = () => {
    moveStickCenterRef.current = null;
    moveStickTouchIdRef.current = null;
    moveJoystickRef.current = { x: 0, y: 0 };
    setMoveStickUi({ x: 0, y: 0, active: false, angleDeg: 0 });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let isSoftwareGl = false;

    try {
      const probeCanvas = document.createElement('canvas');
      const probeGl =
        probeCanvas.getContext('webgl2') ||
        probeCanvas.getContext('webgl') ||
        probeCanvas.getContext('experimental-webgl');
      if (!probeGl) {
        onSceneError('WebGL context could not be initialized on this device.');
        return;
      }
      if (
        probeGl instanceof WebGLRenderingContext ||
        (typeof WebGL2RenderingContext !== 'undefined' &&
          probeGl instanceof WebGL2RenderingContext)
      ) {
        const dbg = probeGl.getExtension('WEBGL_debug_renderer_info');
        const rendererName = dbg
          ? String(probeGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
          : String(probeGl.getParameter(probeGl.RENDERER));
        isSoftwareGl = /SwiftShader|llvmpipe|Software|Mesa OffScreen/i.test(rendererName);
      }

      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onSceneError('WebGL initialization failed. Falling back to 2D Portfolio Mode.');
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x1e293b, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = isSoftwareGl
      ? 1
      : Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    scene.fog = new THREE.FogExp2(0x1e293b, 0.0075);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const getResponsiveFov = (aspect: number) => {
      if (aspect < 0.65) return 66;
      if (aspect < 0.85) return 58;
      if (aspect < 1.1) return 50;
      return 45;
    };

    const initialAspect = width / Math.max(1, height);
    const camera = new THREE.PerspectiveCamera(
      getResponsiveFov(initialAspect),
      initialAspect,
      0.1,
      140
    );
    const initialRoom = ROOMS.find((r) => r.id === activeRoomRef.current) || ROOMS[0];
    camera.position.set(...initialRoom.cameraPosition);

    const renderSceneFrame = () => {
      renderer.render(scene, camera);
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialRoom.cameraTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minPolarAngle = 0.2;
    controls.minDistance = ORBIT_MIN_DISTANCE;
    controls.maxDistance = ORBIT_MAX_DISTANCE;
    controls.enablePan = true;
    controls.screenSpacePanning = false;

    const clampOrbitBounds = () => {
      if (cameraModeRef.current !== 'orbit') return;
      const clampedX = THREE.MathUtils.clamp(
        controls.target.x,
        ORBIT_TARGET_MIN_X,
        ORBIT_TARGET_MAX_X
      );
      const clampedY = THREE.MathUtils.clamp(
        controls.target.y,
        ORBIT_TARGET_MIN_Y,
        ORBIT_TARGET_MAX_Y
      );
      const clampedZ = THREE.MathUtils.clamp(
        controls.target.z,
        ORBIT_TARGET_MIN_Z,
        ORBIT_TARGET_MAX_Z
      );

      const corrX = clampedX - controls.target.x;
      const corrY = clampedY - controls.target.y;
      const corrZ = clampedZ - controls.target.z;

      if (corrX !== 0 || corrY !== 0 || corrZ !== 0) {
        controls.target.set(clampedX, clampedY, clampedZ);
        camera.position.x += corrX;
        camera.position.y += corrY;
        camera.position.z += corrZ;
      }

      if (camera.position.y < 1.6) {
        camera.position.y = 1.6;
      }
    };

    controls.update();
    clampOrbitBounds();

    controls.addEventListener('start', () => {
      isCameraTransitioningRef.current = false;
    });

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xd6c7b2, 1.35);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(18, 28, 16);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.set(2048, 2048);
      sunLight.shadow.camera.near = 2;
      sunLight.shadow.camera.far = 75;
      const d = 24;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.85);
    fillLight.position.set(-20, 16, -12);
    scene.add(fillLight);

    // =========================================================================
    // 1. ARCHITECTURAL OFFICE FLOOR PLAN, WALLS & COLLIDER REGISTRY
    // =========================================================================
    const disposables: { dispose: () => void }[] = [];
    const floorWalkMeshes: THREE.Object3D[] = [];
    const boxColliders: BoxCollider[] = [];
    const circleColliders: CircleCollider[] = [];

    const addBoxCollider = (cx: number, cz: number, halfW: number, halfD: number) => {
      boxColliders.push({
        minX: cx - halfW,
        maxX: cx + halfW,
        minZ: cz - halfD,
        maxZ: cz + halfD,
      });
    };

    const addCircleCollider = (cx: number, cz: number, radius: number) => {
      circleColliders.push({ x: cx, z: cz, radius });
    };

    const plinthGeo = new THREE.BoxGeometry(35.2, 0.5, 29.2);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.2,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, -0.26, 1.5);
    plinth.receiveShadow = true;
    scene.add(plinth);
    disposables.push(plinthGeo, plinthMat);

    const woodFloorTex = createWoodParquetTexture(maxAnisotropy);
    const mainFloorGeo = new THREE.PlaneGeometry(34, 28);
    mainFloorGeo.rotateX(-Math.PI / 2);
    const mainFloorMat = new THREE.MeshStandardMaterial({
      map: woodFloorTex,
      color: 0xffffff,
      roughness: 0.58,
      metalness: 0.04,
    });
    const mainFloor = new THREE.Mesh(mainFloorGeo, mainFloorMat);
    mainFloor.position.set(0, 0, 1.5);
    mainFloor.receiveShadow = true;
    scene.add(mainFloor);
    floorWalkMeshes.push(mainFloor);
    disposables.push(woodFloorTex, mainFloorGeo, mainFloorMat);

    // Eye-friendly 3D Visual Style Presets (Studio Daylight / Clay Maquette / Warm Loft)
    const applyVisualStyle = (style: VisualStyle3D) => {
      if (style === 'maquette') {
        // Minimalist Architectural Clay Maquette: soft warm ivory/alabaster monochrome model
        scene.background = new THREE.Color(0x27272a);
        scene.fog = new THREE.FogExp2(0x27272a, 0.0065);
        renderer.toneMappingExposure = 1.08;
        hemiLight.color.setHex(0xfafaf9);
        hemiLight.groundColor.setHex(0xe7e5e4);
        hemiLight.intensity = 1.45;
        sunLight.color.setHex(0xfffbeb);
        sunLight.intensity = 1.85;
        fillLight.color.setHex(0xf5f5f4);
        fillLight.intensity = 0.95;
        mainFloorMat.map = null;
        mainFloorMat.color.setHex(0xf5f2eb);
        mainFloorMat.roughness = 0.82;
        mainFloorMat.needsUpdate = true;
      } else if (style === 'cozy') {
        // Cozy Evening Studio: soothing warm golden-hour lighting with low glare
        scene.background = new THREE.Color(0x1c1917);
        scene.fog = new THREE.FogExp2(0x1c1917, 0.0075);
        renderer.toneMappingExposure = 1.02;
        hemiLight.color.setHex(0xffedd5);
        hemiLight.groundColor.setHex(0x9a3412);
        hemiLight.intensity = 1.15;
        sunLight.color.setHex(0xfdba74);
        sunLight.intensity = 2.05;
        fillLight.color.setHex(0xfed7aa);
        fillLight.intensity = 0.7;
        mainFloorMat.map = woodFloorTex;
        mainFloorMat.color.setHex(0xfde68a);
        mainFloorMat.roughness = 0.55;
        mainFloorMat.needsUpdate = true;
      } else {
        // Default Studio Daylight Diorama: crisp anti-aliased oak parquet & natural studio light
        scene.background = new THREE.Color(0x1e293b);
        scene.fog = new THREE.FogExp2(0x1e293b, 0.0075);
        renderer.toneMappingExposure = 1.12;
        hemiLight.color.setHex(0xe0f2fe);
        hemiLight.groundColor.setHex(0xd6c7b2);
        hemiLight.intensity = 1.35;
        sunLight.color.setHex(0xfff7ed);
        sunLight.intensity = 2.1;
        fillLight.color.setHex(0xbae6fd);
        fillLight.intensity = 0.85;
        mainFloorMat.map = woodFloorTex;
        mainFloorMat.color.setHex(0xffffff);
        mainFloorMat.roughness = 0.58;
        mainFloorMat.needsUpdate = true;
      }
    };

    syncVisualStyleRef.current = applyVisualStyle;
    applyVisualStyle(visualStyleRef.current);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.7,
      metalness: 0.02,
    });
    const wallTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc89d6c,
      roughness: 0.5,
      metalness: 0.1,
    });
    disposables.push(wallMat, wallTrimMat);

    const northWall = new THREE.Mesh(new THREE.BoxGeometry(34.2, 3.4, 0.35), wallMat);
    northWall.position.set(0, 1.7, -12.5);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    scene.add(northWall);

    const northTrim = new THREE.Mesh(new THREE.BoxGeometry(34.25, 0.12, 0.4), wallTrimMat);
    northTrim.position.set(0, 3.42, -12.5);
    scene.add(northTrim);

    const westWallBack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 15), wallMat);
    westWallBack.position.set(-17, 1.7, -5);
    westWallBack.castShadow = true;
    westWallBack.receiveShadow = true;
    scene.add(westWallBack);

    const westWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 13), wallMat);
    westWallFront.position.set(-17, 0.7, 9);
    westWallFront.castShadow = true;
    scene.add(westWallFront);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.1, 28), wallMat);
    eastWall.position.set(17, 0.55, 1.5);
    eastWall.receiveShadow = true;
    scene.add(eastWall);

    const slatMat = new THREE.MeshStandardMaterial({ color: 0xb47b44, roughness: 0.55 });
    for (let s = -4.2; s <= 4.2; s += 0.28) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.1, 0.08), slatMat);
      slat.position.set(s, 1.6, -12.28);
      scene.add(slat);
    }

    // Interior Glass Partition Walls + Physical Colliders (leaving open doorway passages at x ∈ [-7.95, -5.8] and x ∈ [5.8, 7.95] and z > -4.0!)
    const partitionLeftNorth = createGlassPartitionWall(8.5, 2.65);
    partitionLeftNorth.position.set(-12.2, 0, -2.2);
    scene.add(partitionLeftNorth);
    addBoxCollider(-12.2, -2.2, 4.25, 0.12);

    const partitionRightNorth = createGlassPartitionWall(8.5, 2.65);
    partitionRightNorth.position.set(12.2, 0, -2.2);
    scene.add(partitionRightNorth);
    addBoxCollider(12.2, -2.2, 4.25, 0.12);

    const partitionCenterLeft = createGlassPartitionWall(8.0, 2.65);
    partitionCenterLeft.rotation.y = Math.PI / 2;
    partitionCenterLeft.position.set(-5.8, 0, -8.0);
    scene.add(partitionCenterLeft);
    addBoxCollider(-5.8, -8.0, 0.12, 4.0);

    const partitionCenterRight = createGlassPartitionWall(8.0, 2.65);
    partitionCenterRight.rotation.y = Math.PI / 2;
    partitionCenterRight.position.set(5.8, 0, -8.0);
    scene.add(partitionCenterRight);
    addBoxCollider(5.8, -8.0, 0.12, 4.0);

    // =========================================================================
    // 1B. ARCHITECTURAL CEILING / ROOF FOR FPS & TPS MODES (HIDDEN IN ORBIT)
    // =========================================================================
    const ceilingGroup = new THREE.Group();
    ceilingGroup.visible = cameraModeRef.current === 'fps' || cameraModeRef.current === 'tps';
    scene.add(ceilingGroup);

    const ceilingSlabMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.85,
      metalness: 0.04,
    });
    const ceilingBeamMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.35,
    });
    const ceilingWoodMat = new THREE.MeshStandardMaterial({
      color: 0xb47b44,
      roughness: 0.55,
      metalness: 0.08,
    });
    const ceilingLedMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff7ed,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    });
    const ceilingSkyAccentMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    });
    disposables.push(
      ceilingSlabMat,
      ceilingBeamMat,
      ceilingWoodMat,
      ceilingLedMat,
      ceilingSkyAccentMat
    );

    // Main acoustic ceiling deck (bottom surface at y = 3.40, matching northWall top)
    // castShadow = false so directional sunlight still illuminates the interior rooms cleanly
    const mainCeilingSlab = new THREE.Mesh(
      new THREE.BoxGeometry(34.4, 0.22, 28.4),
      ceilingSlabMat
    );
    mainCeilingSlab.position.set(0, 3.51, 1.5);
    mainCeilingSlab.castShadow = false;
    mainCeilingSlab.receiveShadow = false;
    ceilingGroup.add(mainCeilingSlab);

    // Perimeter structural cornice fascia beams along outer walls
    const northCornice = new THREE.Mesh(
      new THREE.BoxGeometry(34.4, 0.18, 0.36),
      ceilingBeamMat
    );
    northCornice.position.set(0, 3.33, -12.5);
    ceilingGroup.add(northCornice);

    const southCornice = new THREE.Mesh(
      new THREE.BoxGeometry(34.4, 0.18, 0.36),
      ceilingBeamMat
    );
    southCornice.position.set(0, 3.33, 15.5);
    ceilingGroup.add(southCornice);

    const westCornice = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.18, 28.4),
      ceilingBeamMat
    );
    westCornice.position.set(-17, 3.33, 1.5);
    ceilingGroup.add(westCornice);

    const eastCornice = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.18, 28.4),
      ceilingBeamMat
    );
    eastCornice.position.set(17, 3.33, 1.5);
    ceilingGroup.add(eastCornice);

    // Perimeter vertical structural columns so the roof is supported around cutaway edges
    const columnPositions: [number, number][] = [
      [-17, -12.5],
      [-5.8, -12.5],
      [5.8, -12.5],
      [17, -12.5],
      [-17, -2.2],
      [17, -2.2],
      [-17, 6.2],
      [17, 6.2],
      [-17, 15.5],
      [-5.8, 15.5],
      [5.8, 15.5],
      [17, 15.5],
    ];
    const columnGeo = new THREE.BoxGeometry(0.28, 3.4, 0.28);
    disposables.push(columnGeo);
    for (const [cx, cz] of columnPositions) {
      const col = new THREE.Mesh(columnGeo, ceilingBeamMat);
      col.position.set(cx, 1.7, cz);
      col.castShadow = false;
      ceilingGroup.add(col);
    }

    // Interior coffered structural ceiling beams aligned with room partitions
    for (const bx of [-5.8, 5.8]) {
      const longBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.16, 28.0),
        ceilingBeamMat
      );
      longBeam.position.set(bx, 3.32, 1.5);
      ceilingGroup.add(longBeam);
    }
    for (const bz of [-2.2, 6.2]) {
      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(34.0, 0.16, 0.26),
        ceilingBeamMat
      );
      crossBeam.position.set(0, 3.32, bz);
      ceilingGroup.add(crossBeam);
    }

    // Warm oak acoustic ceiling baffles above the central Lobby & Lounge bay
    const baffleGeo = new THREE.BoxGeometry(0.12, 0.14, 15.8);
    disposables.push(baffleGeo);
    for (let sx = -4.4; sx <= 4.4; sx += 0.65) {
      const baffle = new THREE.Mesh(baffleGeo, ceilingWoodMat);
      baffle.position.set(sx, 3.33, 6.2);
      ceilingGroup.add(baffle);
    }

    // Recessed architectural LED ceiling panels across all 6 rooms
    const roomLightCenters: [number, number, boolean][] = [
      [-11.4, -7.4, false], // Projects room
      [0, -7.4, true],      // Systems room (sky accent)
      [11.4, -7.4, false],  // Experience room
      [-11.4, 2.0, false],  // West mid bay
      [0, 2.0, true],       // Central lobby north
      [11.4, 2.0, false],   // Cases room north
      [-11.4, 10.6, false], // Contact room
      [0, 10.6, true],      // Central lobby south
      [11.4, 10.6, false],  // Cases room south
    ];
    const lightFrameGeo = new THREE.BoxGeometry(3.8, 0.06, 1.3);
    const lightPanelGeo = new THREE.BoxGeometry(3.55, 0.04, 1.05);
    const linearStripGeo = new THREE.BoxGeometry(0.14, 0.05, 5.2);
    disposables.push(lightFrameGeo, lightPanelGeo, linearStripGeo);

    for (const [lx, lz, isCenter] of roomLightCenters) {
      const frame = new THREE.Mesh(lightFrameGeo, ceilingBeamMat);
      frame.position.set(lx, 3.37, lz);
      ceilingGroup.add(frame);

      const panel = new THREE.Mesh(lightPanelGeo, ceilingLedMat);
      panel.position.set(lx, 3.35, lz);
      ceilingGroup.add(panel);

      if (isCenter) {
        for (const side of [-2.2, 2.2]) {
          const strip = new THREE.Mesh(linearStripGeo, ceilingSkyAccentMat);
          strip.position.set(lx + side, 3.34, lz);
          ceilingGroup.add(strip);
        }
      }
    }

    // =========================================================================
    // 2. 3D AVATAR FOR TPS MODE + WALK TARGET MARKER
    // =========================================================================
    const avatarRig = createRizalAvatar();
    avatarRig.group.position.copy(playerPosRef.current);
    avatarRig.group.rotation.y = avatarFacingYawRef.current;
    avatarRig.group.visible = cameraModeRef.current === 'tps';
    scene.add(avatarRig.group);

    const targetMarkerGeo = new THREE.RingGeometry(0.22, 0.32, 24);
    targetMarkerGeo.rotateX(-Math.PI / 2);
    const targetMarkerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const walkTargetMarker = new THREE.Mesh(targetMarkerGeo, targetMarkerMat);
    walkTargetMarker.position.y = 0.03;
    walkTargetMarker.visible = false;
    scene.add(walkTargetMarker);
    disposables.push(targetMarkerGeo, targetMarkerMat);

    // =========================================================================
    // 3. ROOM RUGS, FURNITURE & PHYSICAL COLLIDERS FOR ALL 6 OFFICE ROOMS
    // =========================================================================
    const interactiveMeshes: THREE.Object3D[] = [];
    const animatedItems: { mesh: THREE.Object3D; baseY: number; phase: number }[] = [];
    const roomRingMap = new Map<RoomId, THREE.Mesh>();

    const roomConfigs: Record<
      RoomId,
      { width: number; depth: number; rugColor: number; borderColor: number }
    > = {
      lobby: { width: 10.5, depth: 9.5, rugColor: 0xf1f5f9, borderColor: 0x0ea5e9 },
      projects: { width: 10.2, depth: 7.8, rugColor: 0xeff6ff, borderColor: 0x6366f1 },
      systems: { width: 10.2, depth: 7.8, rugColor: 0xecfdf5, borderColor: 0x10b981 },
      experience: { width: 10.2, depth: 7.8, rugColor: 0xfffbeb, borderColor: 0xf59e0b },
      cases: { width: 10.2, depth: 7.8, rugColor: 0xfff1f2, borderColor: 0xf43f5e },
      contact: { width: 10.5, depth: 6.8, rugColor: 0xf0f9ff, borderColor: 0x38bdf8 },
    };

    ROOMS.forEach((room) => {
      const [rx, , rz] = room.roomCenter;
      const cfg = roomConfigs[room.id];
      const roomGroup = new THREE.Group();
      roomGroup.position.set(rx, 0, rz);
      roomGroup.userData = { roomId: room.id };

      const rugGeo = new THREE.BoxGeometry(cfg.width, 0.03, cfg.depth);
      const rugMat = new THREE.MeshStandardMaterial({
        color: cfg.rugColor,
        roughness: 0.88,
        metalness: 0.02,
      });
      const rug = new THREE.Mesh(rugGeo, rugMat);
      rug.position.y = 0.015;
      rug.receiveShadow = true;
      rug.userData = { roomId: room.id, isFloor: true };
      roomGroup.add(rug);
      interactiveMeshes.push(rug);
      floorWalkMeshes.push(rug);
      disposables.push(rugGeo, rugMat);

      const borderGeo = new THREE.RingGeometry(
        Math.max(cfg.width, cfg.depth) * 0.52,
        Math.max(cfg.width, cfg.depth) * 0.55,
        4
      );
      borderGeo.rotateX(-Math.PI / 2);
      borderGeo.rotateY(Math.PI / 4);
      const borderMat = new THREE.MeshBasicMaterial({
        color: cfg.borderColor,
        transparent: true,
        opacity: room.id === activeRoomRef.current ? 0.85 : 0.25,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.y = 0.025;
      roomGroup.add(borderMesh);
      roomRingMap.set(room.id, borderMesh);
      disposables.push(borderGeo, borderMat);

      const roomLight = new THREE.PointLight(0xfffbeb, 1.1, 14, 1.6);
      roomLight.position.set(0, 3.8, 0);
      roomGroup.add(roomLight);

      // -----------------------------------------------------------------------
      // ROOM 01: VIRTUAL LOBBY (rx = 0, rz = 0)
      // -----------------------------------------------------------------------
      if (room.id === 'lobby') {
        const counterBase = new THREE.Mesh(
          new THREE.BoxGeometry(4.2, 1.05, 1.0),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
        );
        counterBase.position.set(0, 0.525, -2.1);
        counterBase.castShadow = true;
        counterBase.receiveShadow = true;
        counterBase.userData = { roomId: room.id };
        roomGroup.add(counterBase);
        interactiveMeshes.push(counterBase);
        // Collider for Reception Counter + Receptionist Chair behind it
        addBoxCollider(rx + 0, rz - 2.35, 2.15, 0.85);

        const counterWoodFront = new THREE.Mesh(
          new THREE.BoxGeometry(3.9, 0.8, 0.08),
          new THREE.MeshStandardMaterial({ color: 0xc89d6c, roughness: 0.5 })
        );
        counterWoodFront.position.set(0, 0.48, -1.58);
        roomGroup.add(counterWoodFront);

        const receptionChair = createOfficeChair(0x0ea5e9);
        receptionChair.position.set(0, 0, -2.95);
        roomGroup.add(receptionChair);

        const lobbyBoardTex = createWhiteboardTexture(
          'RIZAL OS · DIGITAL OFFICE',
          '01 · LOBBY',
          '#0ea5e9',
          [
            { title: 'Technical PM', tag: 'Execution', status: '6 ROOMS' },
            { title: '6 Case Studies', tag: 'Portfolio', status: 'VERIFIED' },
            { title: 'Systems & AI', tag: 'Workflows', status: 'ACTIVE' },
          ],
          maxAnisotropy
        );
        const lobbySign = new THREE.Mesh(
          new THREE.BoxGeometry(4.8, 2.1, 0.12),
          new THREE.MeshStandardMaterial({ map: lobbyBoardTex, roughness: 0.25 })
        );
        lobbySign.position.set(0, 1.85, -3.8);
        lobbySign.castShadow = true;
        lobbySign.userData = { roomId: room.id };
        roomGroup.add(lobbySign);
        interactiveMeshes.push(lobbySign);
        disposables.push(lobbyBoardTex);
        addBoxCollider(rx + 0, rz - 3.8, 2.45, 0.2);

        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.75 });
        [-2.6, 2.6].forEach((sx) => {
          const sofaGroup = new THREE.Group();
          sofaGroup.position.set(sx, 0, 1.6);
          sofaGroup.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;

          const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.42, 0.88), sofaMat);
          seat.position.y = 0.28;
          seat.castShadow = true;
          sofaGroup.add(seat);

          const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.22), sofaMat);
          back.position.set(0, 0.65, -0.34);
          back.castShadow = true;
          sofaGroup.add(back);

          roomGroup.add(sofaGroup);
          // Rotated 90 deg: width along X is 0.88m (half = 0.48), length along Z is 2.2m (half = 1.12)
          addBoxCollider(rx + sx, rz + 1.6, 0.5, 1.14);
        });

        const lobbyTable = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.08, 24),
          new THREE.MeshStandardMaterial({ color: 0xe2c499, roughness: 0.45 })
        );
        lobbyTable.position.set(0, 0.42, 1.6);
        lobbyTable.castShadow = true;
        roomGroup.add(lobbyTable);
        addCircleCollider(rx + 0, rz + 1.6, 0.98);

        const plantL = createPottedPlant(1.1);
        plantL.position.set(-3.8, 0, -2.4);
        roomGroup.add(plantL);
        addCircleCollider(rx - 3.8, rz - 2.4, 0.48);

        const plantR = createPottedPlant(1.1);
        plantR.position.set(3.8, 0, -2.4);
        roomGroup.add(plantR);
        addCircleCollider(rx + 3.8, rz - 2.4, 0.48);
      }

      // -----------------------------------------------------------------------
      // ROOM 02: PROJECT ROOM (rx = -11.5, rz = -8.5)
      // -----------------------------------------------------------------------
      if (room.id === 'projects') {
        const deskOffsets: [number, number, number][] = [
          [-2.1, -0.8, 0],
          [2.1, -0.8, 0],
          [-2.1, 1.7, Math.PI],
          [2.1, 1.7, Math.PI],
        ];
        deskOffsets.forEach(([dx, dz, rot], idx) => {
          const ws = createWorkstationDesk(
            idx % 2 === 0 ? 0x4f46e5 : 0x0ea5e9,
            idx % 2 === 0 ? 0x6366f1 : 0x38bdf8,
            true
          );
          ws.position.set(dx, 0, dz);
          ws.rotation.y = rot;
          ws.traverse((child) => {
            child.userData = { roomId: room.id };
          });
          roomGroup.add(ws);
          interactiveMeshes.push(ws);
          // Desk (1.8m x 0.85m) + tucked chair
          addBoxCollider(rx + dx, rz + dz, 0.95, 0.72);
        });

        const kanbanTex = createWhiteboardTexture(
          'PROJECT STUDIO · SPRINT BOARD',
          '02 · PROJECTS',
          '#6366f1',
          [
            { title: 'mFood POS', tag: 'POS', status: 'SHIPPED' },
            { title: 'DIAMOND KMS', tag: 'KMS', status: 'SHIPPED' },
            { title: 'Employr HR', tag: 'SaaS', status: 'SHIPPED' },
            { title: 'Triagro Ops', tag: 'Agri', status: 'SHIPPED' },
            { title: 'Prompt Battle', tag: 'AI', status: 'SHIPPED' },
            { title: 'RevOps Engine', tag: 'Ops', status: 'SHIPPED' },
          ],
          maxAnisotropy
        );
        const kanbanBoard = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 2.45, 0.1),
          new THREE.MeshStandardMaterial({ map: kanbanTex, roughness: 0.25 })
        );
        kanbanBoard.position.set(0, 1.75, -3.65);
        kanbanBoard.castShadow = true;
        kanbanBoard.userData = { roomId: room.id };
        roomGroup.add(kanbanBoard);
        interactiveMeshes.push(kanbanBoard);
        disposables.push(kanbanTex);

        const plant = createPottedPlant(1.0);
        plant.position.set(-4.2, 0, -3.1);
        roomGroup.add(plant);
        addCircleCollider(rx - 4.2, rz - 3.1, 0.45);
      }

      // -----------------------------------------------------------------------
      // ROOM 03: SYSTEMS LAB (rx = 11.5, rz = -8.5)
      // -----------------------------------------------------------------------
      if (room.id === 'systems') {
        const confTop = new THREE.Mesh(
          new THREE.BoxGeometry(4.4, 0.08, 1.7),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
        );
        confTop.position.set(0, 0.76, 0.4);
        confTop.castShadow = true;
        confTop.receiveShadow = true;
        confTop.userData = { roomId: room.id };
        roomGroup.add(confTop);
        interactiveMeshes.push(confTop);

        const confBase = new THREE.Mesh(
          new THREE.BoxGeometry(3.2, 0.72, 0.9),
          new THREE.MeshStandardMaterial({ color: 0xc89d6c, roughness: 0.55 })
        );
        confBase.position.set(0, 0.36, 0.4);
        confBase.castShadow = true;
        roomGroup.add(confBase);

        [-1.4, 0, 1.4].forEach((cx) => {
          const chairNorth = createOfficeChair(0x10b981);
          chairNorth.position.set(cx, 0, -0.82);
          roomGroup.add(chairNorth);

          const chairSouth = createOfficeChair(0x059669);
          chairSouth.position.set(cx, 0, 1.62);
          chairSouth.rotation.y = Math.PI;
          roomGroup.add(chairSouth);
        });
        // Collider covering conference table + chairs
        addBoxCollider(rx + 0, rz + 0.4, 2.25, 1.45);

        const nodeMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: new THREE.Color(0x059669),
          emissiveIntensity: 0.4,
          roughness: 0.25,
        });
        [-1.1, 0, 1.1].forEach((nx, idx) => {
          const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), nodeMat);
          node.position.set(nx, 1.06, 0.4);
          roomGroup.add(node);
          animatedItems.push({ mesh: node, baseY: 1.06, phase: idx * 1.1 });
        });

        const sysBoardTex = createWhiteboardTexture(
          'SYSTEMS WAR ROOM · WORKFLOWS',
          '03 · SYSTEMS',
          '#10b981',
          [
            { title: 'PRD-to-Sprint', tag: 'WBS', status: 'VERIFIED' },
            { title: 'AI RAG Flow', tag: 'AI', status: 'ACTIVE' },
            { title: 'Offline Sync', tag: 'Queue', status: '99.9%' },
            { title: 'Risk Matrix', tag: 'Audit', status: 'TRACKED' },
            { title: 'API Contract', tag: 'Schema', status: 'LOCKED' },
            { title: 'Release Gate', tag: 'QA', status: 'READY' },
          ],
          maxAnisotropy
        );
        const sysBoard = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 2.45, 0.1),
          new THREE.MeshStandardMaterial({ map: sysBoardTex, roughness: 0.25 })
        );
        sysBoard.position.set(0, 1.75, -3.65);
        sysBoard.castShadow = true;
        sysBoard.userData = { roomId: room.id };
        roomGroup.add(sysBoard);
        interactiveMeshes.push(sysBoard);
        disposables.push(sysBoardTex);

        const plant = createPottedPlant(1.0);
        plant.position.set(4.1, 0, -3.1);
        roomGroup.add(plant);
        addCircleCollider(rx + 4.1, rz - 3.1, 0.45);
      }

      // -----------------------------------------------------------------------
      // ROOM 04: EXPERIENCE GALLERY (rx = -11.5, rz = 6.5)
      // -----------------------------------------------------------------------
      if (room.id === 'experience') {
        const milestones = [
          {
            role: 'Technical PM',
            period: '2023 — NOW',
            metric: '6 Product Launches',
          },
          {
            role: 'Product Ops Lead',
            period: '2021 — 2023',
            metric: '+34% Predictability',
          },
          {
            role: 'Solutions Delivery',
            period: '2019 — 2021',
            metric: '15+ Rollouts',
          },
        ];

        milestones.forEach((ms, idx) => {
          const gx = -2.9 + idx * 2.9;

          const pedestal = new THREE.Mesh(
            new THREE.BoxGeometry(2.3, 0.55, 0.65),
            new THREE.MeshStandardMaterial({ color: 0xc89d6c, roughness: 0.55 })
          );
          pedestal.position.set(gx, 0.275, -1.2);
          pedestal.castShadow = true;
          pedestal.userData = { roomId: room.id };
          roomGroup.add(pedestal);
          addBoxCollider(rx + gx, rz - 1.2, 1.18, 0.38);

          const boardTex = createWhiteboardTexture(
            ms.role,
            ms.period,
            '#f59e0b',
            [{ title: ms.role, tag: ms.period, status: ms.metric }],
            maxAnisotropy
          );
          const displayBoard = new THREE.Mesh(
            new THREE.BoxGeometry(2.25, 1.65, 0.08),
            new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.3 })
          );
          displayBoard.position.set(gx, 1.4, -1.2);
          displayBoard.castShadow = true;
          displayBoard.userData = { roomId: room.id };
          roomGroup.add(displayBoard);
          interactiveMeshes.push(displayBoard);
          disposables.push(boardTex);
        });

        const benchTop = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 0.1, 0.75),
          new THREE.MeshStandardMaterial({ color: 0xe2c499, roughness: 0.5 })
        );
        benchTop.position.set(0, 0.46, 1.65);
        benchTop.castShadow = true;
        roomGroup.add(benchTop);
        addBoxCollider(rx + 0, rz + 1.65, 1.92, 0.42);

        const plant = createPottedPlant(0.95);
        plant.position.set(-4.2, 0, 2.4);
        roomGroup.add(plant);
        addCircleCollider(rx - 4.2, rz + 2.4, 0.45);
      }

      // -----------------------------------------------------------------------
      // ROOM 05: CASE ARCHIVE (rx = 11.5, rz = 6.5)
      // -----------------------------------------------------------------------
      if (room.id === 'cases') {
        [-2.5, 0, 2.5].forEach((bx) => {
          const shelf = createOfficeBookshelf();
          shelf.position.set(bx, 0, -2.8);
          shelf.traverse((child) => {
            child.userData = { roomId: room.id };
          });
          roomGroup.add(shelf);
          interactiveMeshes.push(shelf);
          addBoxCollider(rx + bx, rz - 2.8, 1.15, 0.35);
        });

        const readingTable = createWorkstationDesk(0xd97706, 0xf43f5e, false);
        readingTable.position.set(0, 0, 1.1);
        readingTable.traverse((child) => {
          child.userData = { roomId: room.id };
        });
        roomGroup.add(readingTable);
        interactiveMeshes.push(readingTable);
        addBoxCollider(rx + 0, rz + 1.1, 0.95, 0.72);

        const plant = createPottedPlant(1.0);
        plant.position.set(4.1, 0, 2.2);
        roomGroup.add(plant);
        addCircleCollider(rx + 4.1, rz + 2.2, 0.45);
      }

      // -----------------------------------------------------------------------
      // ROOM 06: CONTACT LOUNGE (rx = 0, rz = 11.5)
      // -----------------------------------------------------------------------
      if (room.id === 'contact') {
        const leatherMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          roughness: 0.6,
          metalness: 0.05,
        });

        const mainSofa = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 0.95), leatherMat);
        mainSofa.position.set(-0.8, 0.28, -1.1);
        mainSofa.castShadow = true;
        mainSofa.userData = { roomId: room.id };
        roomGroup.add(mainSofa);
        interactiveMeshes.push(mainSofa);
        addBoxCollider(rx - 0.8, rz - 1.1, 1.82, 0.52);

        const mainSofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 0.24), leatherMat);
        mainSofaBack.position.set(-0.8, 0.68, -1.46);
        mainSofaBack.castShadow = true;
        roomGroup.add(mainSofaBack);

        const chaiseSofa = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 2.1), leatherMat);
        chaiseSofa.position.set(-2.25, 0.28, -0.4);
        chaiseSofa.castShadow = true;
        roomGroup.add(chaiseSofa);
        addBoxCollider(rx - 2.25, rz - 0.4, 0.58, 1.08);

        const coffeeTable = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.08, 24),
          new THREE.MeshStandardMaterial({ color: 0xe2c499, roughness: 0.45 })
        );
        coffeeTable.position.set(-0.3, 0.42, 0.55);
        coffeeTable.castShadow = true;
        roomGroup.add(coffeeTable);
        addCircleCollider(rx - 0.3, rz + 0.55, 0.98);

        const coffeeBar = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.95, 0.75),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
        );
        coffeeBar.position.set(2.9, 0.475, -0.8);
        coffeeBar.castShadow = true;
        coffeeBar.userData = { roomId: room.id };
        roomGroup.add(coffeeBar);
        interactiveMeshes.push(coffeeBar);
        addBoxCollider(rx + 2.9, rz - 0.8, 1.24, 0.42);

        const espressoMachine = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.48, 0.42),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.7 })
        );
        espressoMachine.position.set(2.6, 1.18, -0.8);
        roomGroup.add(espressoMachine);

        const plant = createPottedPlant(1.15);
        plant.position.set(4.3, 0, 1.4);
        roomGroup.add(plant);
        addCircleCollider(rx + 4.3, rz + 1.4, 0.5);
      }

      scene.add(roomGroup);
    });

    // =========================================================================
    // 4. SEPARATED-AXIS COLLISION DETECTION WITH SMOOTH EDGE SLIDING
    // =========================================================================
    const pushOutFromColliders = (px: number, pz: number, r: number): [number, number] => {
      let x = Math.max(-16.1, Math.min(16.1, px));
      let z = Math.max(-11.8, Math.min(14.4, pz));

      // Resolve against BoxColliders (minimum translation vector)
      for (let i = 0; i < boxColliders.length; i++) {
        const b = boxColliders[i];
        const minX = b.minX - r;
        const maxX = b.maxX + r;
        const minZ = b.minZ - r;
        const maxZ = b.maxZ + r;

        if (x > minX && x < maxX && z > minZ && z < maxZ) {
          const penLeft = x - minX;
          const penRight = maxX - x;
          const penTop = z - minZ;
          const penBottom = maxZ - z;
          const minPen = Math.min(penLeft, penRight, penTop, penBottom);

          if (minPen === penLeft) x = minX;
          else if (minPen === penRight) x = maxX;
          else if (minPen === penTop) z = minZ;
          else z = maxZ;
        }
      }

      // Resolve against CircleColliders (smooth radial normal slide)
      for (let i = 0; i < circleColliders.length; i++) {
        const c = circleColliders[i];
        const dx = x - c.x;
        const dz = z - c.z;
        const minDist = c.radius + r;
        const distSq = dx * dx + dz * dz;
        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq) || 0.001;
          x = c.x + (dx / dist) * minDist;
          z = c.z + (dz / dist) * minDist;
        }
      }

      return [x, z];
    };

    const resolveCollisionsWithSliding = (
      oldX: number,
      oldZ: number,
      targetX: number,
      targetZ: number
    ): [number, number] => {
      // Step 1: Resolve X movement first so diagonal hits slide along Z walls
      const [slidX] = pushOutFromColliders(targetX, oldZ, PLAYER_RADIUS);
      // Step 2: Resolve Z movement using slidX so diagonal hits slide along X walls
      const [finalX, finalZ] = pushOutFromColliders(slidX, targetZ, PLAYER_RADIUS);
      return [finalX, finalZ];
    };

    // =========================================================================
    // 5. RAYCASTING, FPS NO-HOLD FREE-LOOK, TPS DRAG-LOOK & WASD CONTROLS
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const centerReticle = new THREE.Vector2(0, 0);
    let pointerDownPos = { x: 0, y: 0 };
    let isDraggingLook = false;
    let activeLookPointerId: number | null = null;
    let lastDragPos = { x: 0, y: 0 };
    let hasLastHoverPos = false;
    let lastHoverPos = { x: 0, y: 0 };
    const activeTouchPoints = new Map<number, { x: number; y: number }>();
    let lastPinchDist: number | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      if (isDrawerOpenRef.current) return;
      isCameraTransitioningRef.current = false;

      if (e.pointerType === 'touch') {
        activeTouchPoints.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activeTouchPoints.size === 2) {
          const pts = Array.from(activeTouchPoints.values());
          lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          isDraggingLook = false;
          return;
        }
      }

      pointerDownPos = { x: e.clientX, y: e.clientY };
      lastDragPos = { x: e.clientX, y: e.clientY };
      lastHoverPos = { x: e.clientX, y: e.clientY };
      hasLastHoverPos = true;
      activeLookPointerId = e.pointerId;

      if (cameraModeRef.current === 'fps') {
        if (e.pointerType === 'touch') {
          isDraggingLook = true;
        } else {
          renderer.domElement.style.cursor = 'none';
          if (
            typeof document !== 'undefined' &&
            document.pointerLockElement !== renderer.domElement
          ) {
            try {
              renderer.domElement.requestPointerLock?.();
            } catch {
              // Ignore if pointer lock is restricted
            }
          }
        }
      } else if (cameraModeRef.current === 'tps') {
        isDraggingLook = true;
      }
      if (requestRenderRef.current) requestRenderRef.current();
    };

    const handlePointerLeave = (e: PointerEvent) => {
      activeTouchPoints.delete(e.pointerId);
      if (activeTouchPoints.size < 2) lastPinchDist = null;
      if (activeLookPointerId === e.pointerId) {
        activeLookPointerId = null;
        isDraggingLook = false;
      }
      hasLastHoverPos = false;
      fpsEdgeTurnRef.current = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDrawerOpenRef.current) {
        fpsEdgeTurnRef.current = 0;
        isDraggingLook = false;
        return;
      }

      // Two-finger pinch-to-zoom on touch screens in TPS mode
      if (e.pointerType === 'touch' && activeTouchPoints.has(e.pointerId)) {
        activeTouchPoints.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activeTouchPoints.size === 2 && cameraModeRef.current === 'tps') {
          const pts = Array.from(activeTouchPoints.values());
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          if (lastPinchDist !== null) {
            const deltaPinch = lastPinchDist - dist;
            tpsDistanceRef.current = Math.max(
              2.6,
              Math.min(10.0, tpsDistanceRef.current + deltaPinch * 0.018)
            );
            if (requestRenderRef.current) requestRenderRef.current();
          }
          lastPinchDist = dist;
          return;
        }
      }

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // TOUCH DRAG-LOOK IN FPS & TPS MODES (Mobile Responsive)
      if (
        e.pointerType === 'touch' &&
        (cameraModeRef.current === 'fps' || cameraModeRef.current === 'tps')
      ) {
        fpsEdgeTurnRef.current = 0;
        if (isDraggingLook && activeLookPointerId === e.pointerId) {
          const dx = e.clientX - lastDragPos.x;
          const dy = e.clientY - lastDragPos.y;
          lastDragPos = { x: e.clientX, y: e.clientY };

          if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
            cameraOrbitYawRef.current -= dx * 0.0068;
            if (cameraModeRef.current === 'fps') {
              avatarFacingYawRef.current = cameraOrbitYawRef.current;
            }
            playerPitchRef.current = Math.max(
              -0.65,
              Math.min(0.45, playerPitchRef.current - dy * 0.0052)
            );
            if (requestRenderRef.current) requestRenderRef.current();
          }
        }
        return;
      }

      // DESKTOP FPS MODE: Direct Free-Look WITHOUT holding mouse button!
      if (cameraModeRef.current === 'fps') {
        const isLocked = document.pointerLockElement === renderer.domElement;
        let dx = 0;
        let dy = 0;

        if (isLocked) {
          dx = e.movementX || 0;
          dy = e.movementY || 0;
        } else if (hasLastHoverPos) {
          dx = e.clientX - lastHoverPos.x;
          dy = e.clientY - lastHoverPos.y;
        }
        lastHoverPos = { x: e.clientX, y: e.clientY };
        hasLastHoverPos = true;

        if (dx !== 0 || dy !== 0) {
          cameraOrbitYawRef.current -= dx * 0.0055;
          avatarFacingYawRef.current = cameraOrbitYawRef.current;
          playerPitchRef.current = Math.max(
            -0.65,
            Math.min(0.45, playerPitchRef.current - dy * 0.0045)
          );
        }

        // Smooth continuous turn when cursor is held near left/right edge in non-locked desktop FPS mode
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        const edgeZone = 85;
        if (!isLocked && localY > 75 && localY < rect.height - 75) {
          if (localX >= 0 && localX < edgeZone) {
            fpsEdgeTurnRef.current = (edgeZone - localX) / edgeZone;
          } else if (localX <= rect.width && localX > rect.width - edgeZone) {
            fpsEdgeTurnRef.current = -((localX - (rect.width - edgeZone)) / edgeZone);
          } else {
            fpsEdgeTurnRef.current = 0;
          }
        } else {
          fpsEdgeTurnRef.current = 0;
        }

        // Raycast from center crosshair (or pointer) so looking at a room board highlights its pin
        raycaster.setFromCamera(centerReticle, camera);
        let hits = raycaster.intersectObjects(interactiveMeshes, true);
        if (hits.length === 0) {
          raycaster.setFromCamera(pointer, camera);
          hits = raycaster.intersectObjects(interactiveMeshes, true);
        }
        let newHoverRoom: RoomId | null = null;
        if (hits.length > 0) {
          let obj: THREE.Object3D | null = hits[0].object;
          while (obj && !obj.userData?.roomId) {
            obj = obj.parent;
          }
          newHoverRoom = (obj?.userData?.roomId as RoomId) || null;
        }
        if (hoveredRoomIdRef.current !== newHoverRoom) {
          hoveredRoomIdRef.current = newHoverRoom;
          updateHotspotPositions();
        }

        renderer.domElement.style.cursor = 'none';
        if (requestRenderRef.current) requestRenderRef.current();
        return;
      }

      // DESKTOP TPS MODE: Drag-to-Look around character
      if (cameraModeRef.current === 'tps' && isDraggingLook) {
        const dx = e.clientX - lastDragPos.x;
        const dy = e.clientY - lastDragPos.y;
        lastDragPos = { x: e.clientX, y: e.clientY };

        cameraOrbitYawRef.current -= dx * 0.0055;
        playerPitchRef.current = Math.max(
          -0.65,
          Math.min(0.45, playerPitchRef.current - dy * 0.0045)
        );
        renderer.domElement.style.cursor = 'grabbing';
        if (requestRenderRef.current) requestRenderRef.current();
        return;
      }

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, true);
      let newHoverRoom: RoomId | null = null;
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.roomId) {
          obj = obj.parent;
        }
        newHoverRoom = (obj?.userData?.roomId as RoomId) || null;
      }

      if (hoveredRoomIdRef.current !== newHoverRoom) {
        hoveredRoomIdRef.current = newHoverRoom;
        updateHotspotPositions();
      }

      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    const handlePointerUp = (e: PointerEvent) => {
      activeTouchPoints.delete(e.pointerId);
      if (activeTouchPoints.size < 2) lastPinchDist = null;
      if (activeLookPointerId === e.pointerId) {
        activeLookPointerId = null;
        isDraggingLook = false;
      } else if (e.pointerType !== 'touch') {
        isDraggingLook = false;
      }

      if (isDrawerOpenRef.current) return;
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      const tapThreshold = e.pointerType === 'touch' ? 12 : 6;
      if (dx > tapThreshold || dy > tapThreshold) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(
        cameraModeRef.current === 'fps' &&
          document.pointerLockElement === renderer.domElement
          ? centerReticle
          : pointer,
        camera
      );

      const hits = raycaster.intersectObjects(interactiveMeshes, true);
      let hitRoomId: RoomId | undefined;
      let hitIsFloor = false;
      let hitPoint: THREE.Vector3 | null = null;

      if (hits.length > 0) {
        const objectHit = hits.find((h) => !h.object.userData?.isFloor) || hits[0];
        hitIsFloor = Boolean(objectHit.object.userData?.isFloor);
        hitPoint = objectHit.point;
        let obj: THREE.Object3D | null = objectHit.object;
        while (obj && !obj.userData?.roomId) {
          obj = obj.parent;
        }
        hitRoomId = obj?.userData?.roomId as RoomId | undefined;
      }

      if (cameraModeRef.current !== 'orbit') {
        const floorHits = raycaster.intersectObjects(floorWalkMeshes, true);
        if (hitRoomId && !hitIsFloor) {
          if (hitPoint) {
            const [clampedX, clampedZ] = pushOutFromColliders(
              hitPoint.x,
              hitPoint.z,
              PLAYER_RADIUS + 0.35
            );
            walkTargetRef.current = new THREE.Vector3(clampedX, 0, clampedZ);
          }
          if (onClickRoom) {
            onClickRoom(hitRoomId);
          } else {
            onSelectRoom(hitRoomId);
          }
          if (requestRenderRef.current) requestRenderRef.current();
          return;
        }

        if (floorHits.length > 0) {
          const pt = floorHits[0].point;
          const [clampedX, clampedZ] = pushOutFromColliders(pt.x, pt.z, PLAYER_RADIUS);
          walkTargetRef.current = new THREE.Vector3(clampedX, 0, clampedZ);
          if (hitRoomId) {
            if (onClickRoom) {
              onClickRoom(hitRoomId);
            } else {
              onSelectRoom(hitRoomId);
            }
          } else {
            onDismissPlace?.();
          }
          if (requestRenderRef.current) requestRenderRef.current();
          return;
        }
      }

      if (hitRoomId) {
        walkTargetRef.current = null;
        fpsEdgeTurnRef.current = 0;
        isCameraTransitioningRef.current = true;
        if (onClickRoom) {
          onClickRoom(hitRoomId);
        } else {
          onSelectRoom(hitRoomId);
        }
        if (requestRenderRef.current) requestRenderRef.current();
      } else {
        onDismissPlace?.();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isDrawerOpenRef.current) return;
      isCameraTransitioningRef.current = false;
      if (cameraModeRef.current === 'tps') {
        e.preventDefault();
        tpsDistanceRef.current = Math.max(
          2.6,
          Math.min(10.5, tpsDistanceRef.current + e.deltaY * 0.005)
        );
        if (requestRenderRef.current) requestRenderRef.current();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawerOpenRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      let handled = false;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressedRef.current.forward = true;
          walkTargetRef.current = null;
          handled = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressedRef.current.backward = true;
          walkTargetRef.current = null;
          handled = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressedRef.current.left = true;
          walkTargetRef.current = null;
          handled = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressedRef.current.right = true;
          walkTargetRef.current = null;
          handled = true;
          break;
        case 'KeyQ':
          keysPressedRef.current.turnLeft = true;
          handled = true;
          break;
        case 'KeyE':
          keysPressedRef.current.turnRight = true;
          handled = true;
          break;
        case 'KeyR':
          handleResetView();
          handled = true;
          break;
        case 'KeyG':
          handleCycleVisualStyle();
          handled = true;
          break;
        case 'Enter':
          if (cameraModeRef.current !== 'orbit') {
            onOpenRoomDetail(activeRoomRef.current);
          }
          break;
      }

      if (handled) {
        isCameraTransitioningRef.current = false;
        if (requestRenderRef.current) requestRenderRef.current();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressedRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressedRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressedRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressedRef.current.right = false;
          break;
        case 'KeyQ':
          keysPressedRef.current.turnLeft = false;
          break;
        case 'KeyE':
          keysPressedRef.current.turnRight = false;
          break;
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // =========================================================================
    // 6. CONTEXTUAL HOVER & PROXIMITY 3D ROOM PINS & RENDER LOOP
    // =========================================================================
    const updateHotspotPositions = () => {
      const hotspotParent = hotspotContainerRef.current;
      if (!hotspotParent) return;
      const cWidth = container.clientWidth || window.innerWidth;
      const cHeight = container.clientHeight || window.innerHeight;

      ROOMS.forEach((room) => {
        const el = hotspotParent.querySelector(
          `[data-room-hotspot="${room.id}"]`
        ) as HTMLElement | null;
        if (!el) return;

        if (zenModeRef.current || isDrawerOpenRef.current) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        const isHovered = hoveredRoomIdRef.current === room.id;
        let isNearPlayer = false;
        if (cameraModeRef.current !== 'orbit') {
          const distToRoom = Math.hypot(
            playerPosRef.current.x - room.roomCenter[0],
            playerPosRef.current.z - room.roomCenter[2]
          );
          isNearPlayer = distToRoom < 5.8;
        }

        if (!isHovered && !isNearPlayer) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        _projVec.set(room.roomCenter[0] * 0.74, 2.15, room.roomCenter[2]);
        _projVec.project(camera);

        if (_projVec.z > 1) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        const x = (_projVec.x * 0.5 + 0.5) * cWidth;
        const y = (-(_projVec.y * 0.5) + 0.5) * cHeight;

        const outOfBounds = x < 60 || x > cWidth - 60 || y < 70 || y > cHeight - 80;
        if (outOfBounds) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
      });
    };

    let lastTime = performance.now();
    let elapsed = 0;
    let walkCycle = 0;
    let stuckTimer = 0;
    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let isLoopActive = false;

    const scheduleNextFrame = () => {
      if (disposed) return;
      if (isSoftwareGl) {
        timeoutId = setTimeout(animate, 40);
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    const requestRender = () => {
      if (disposed || isLoopActive) return;
      isLoopActive = true;
      lastTime = performance.now();
      scheduleNextFrame();
    };
    requestRenderRef.current = requestRender;

    controls.addEventListener('change', () => {
      clampOrbitBounds();
      updateHotspotPositions();
      requestRender();
    });

    const animate = () => {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += delta;

      const mode = cameraModeRef.current;
      const isLockedByDrawer = isDrawerOpenRef.current;
      controls.enabled = mode === 'orbit' && !isLockedByDrawer;
      avatarRig.group.visible = mode === 'tps';
      ceilingGroup.visible = mode === 'fps' || mode === 'tps';

      let needsMoreFrames = false;

      if (mode === 'orbit') {
        walkTargetMarker.visible = false;

        const keys = keysPressedRef.current;
        const mJoy = moveJoystickRef.current;
        const hasMoveJoy = Math.hypot(mJoy.x, mJoy.y) > 0.04;
        if (
          !isLockedByDrawer &&
          (hasMoveJoy ||
            keys.forward ||
            keys.backward ||
            keys.left ||
            keys.right ||
            keys.turnLeft ||
            keys.turnRight)
        ) {
          isCameraTransitioningRef.current = false;
          const panSpeed = 9.0 * delta;
          camera.getWorldDirection(_forwardDir);
          _forwardDir.y = 0;
          if (_forwardDir.lengthSq() > 0.0001) {
            _forwardDir.normalize();
          } else {
            _forwardDir.set(0, 0, -1);
          }
          _rightDir.set(-_forwardDir.z, 0, _forwardDir.x);

          _moveVec.set(0, 0, 0);
          if (keys.forward) _moveVec.addScaledVector(_forwardDir, panSpeed);
          if (keys.backward) _moveVec.addScaledVector(_forwardDir, -panSpeed);
          if (keys.right) _moveVec.addScaledVector(_rightDir, panSpeed);
          if (keys.left) _moveVec.addScaledVector(_rightDir, -panSpeed);
          if (hasMoveJoy) {
            _moveVec.addScaledVector(_forwardDir, mJoy.y * panSpeed);
            _moveVec.addScaledVector(_rightDir, mJoy.x * panSpeed);
          }

          camera.position.add(_moveVec);
          controls.target.add(_moveVec);
          clampOrbitBounds();

          if (keys.turnLeft || keys.turnRight) {
            const yawDelta =
              ((keys.turnLeft ? 1 : 0) - (keys.turnRight ? 1 : 0)) * 1.6 * delta;

            _orbitOffset.copy(camera.position).sub(controls.target);
            _spherical.setFromVector3(_orbitOffset);
            _spherical.theta += yawDelta;
            _spherical.radius = THREE.MathUtils.clamp(
              _spherical.radius,
              ORBIT_MIN_DISTANCE,
              ORBIT_MAX_DISTANCE
            );
            _orbitOffset.setFromSpherical(_spherical);
            camera.position.copy(controls.target).add(_orbitOffset);
          }

          needsMoreFrames = true;
        }

        if (!isLockedByDrawer && isCameraTransitioningRef.current) {
          const currentRoom = ROOMS.find((r) => r.id === activeRoomRef.current) || ROOMS[0];
          _targetPos.set(...currentRoom.cameraPosition);
          _targetLook.set(...currentRoom.cameraTarget);

          if (reducedMotionRef.current || isSoftwareGl) {
            camera.position.copy(_targetPos);
            controls.target.copy(_targetLook);
            isCameraTransitioningRef.current = false;
          } else {
            const distPos = camera.position.distanceToSquared(_targetPos);
            const distLook = controls.target.distanceToSquared(_targetLook);
            if (distPos > 0.01 || distLook > 0.01) {
              needsMoreFrames = true;
              const lerpAlpha = 1 - Math.exp(-4.5 * delta);
              camera.position.lerp(_targetPos, lerpAlpha);
              controls.target.lerp(_targetLook, lerpAlpha);
            } else {
              isCameraTransitioningRef.current = false;
            }
          }
        }

        if (!isLockedByDrawer) {
          controls.update();
          clampOrbitBounds();
        }
      } else {
        // =====================================================================
        // FPS & TPS MOVEMENT WITH PHYSICAL COLLISION & SMOOTH WALL SLIDING
        // =====================================================================
        if (isLockedByDrawer) {
          walkTargetRef.current = null;
          fpsEdgeTurnRef.current = 0;
        }
        const keys = keysPressedRef.current;
        const mJoy = moveJoystickRef.current;
        const turnSpeed = 2.0 * delta;
        const pitchSpeed = 1.45 * delta;
        if (!isLockedByDrawer && keys.turnLeft) {
          cameraOrbitYawRef.current += turnSpeed;
          if (mode === 'fps') avatarFacingYawRef.current = cameraOrbitYawRef.current;
          needsMoreFrames = true;
        }
        if (!isLockedByDrawer && keys.turnRight) {
          cameraOrbitYawRef.current -= turnSpeed;
          if (mode === 'fps') avatarFacingYawRef.current = cameraOrbitYawRef.current;
          needsMoreFrames = true;
        }
        if (!isLockedByDrawer && keys.lookUp) {
          playerPitchRef.current = Math.min(0.45, playerPitchRef.current + pitchSpeed);
          needsMoreFrames = true;
        }
        if (!isLockedByDrawer && keys.lookDown) {
          playerPitchRef.current = Math.max(-0.65, playerPitchRef.current - pitchSpeed);
          needsMoreFrames = true;
        }
        if (!isLockedByDrawer && mode === 'fps' && Math.abs(fpsEdgeTurnRef.current) > 0.01) {
          cameraOrbitYawRef.current += fpsEdgeTurnRef.current * 1.85 * delta;
          avatarFacingYawRef.current = cameraOrbitYawRef.current;
          needsMoreFrames = true;
        }

        const camForwardX = Math.sin(cameraOrbitYawRef.current);
        const camForwardZ = Math.cos(cameraOrbitYawRef.current);
        const camRightX = -camForwardZ;
        const camRightZ = camForwardX;

        let moveX = 0;
        let moveZ = 0;
        const moveJoyMag = Math.min(1, Math.hypot(mJoy.x, mJoy.y));
        const hasMoveJoy = moveJoyMag > 0.04;

        if (!isLockedByDrawer) {
          if (keys.forward) {
            moveX += camForwardX;
            moveZ += camForwardZ;
          }
          if (keys.backward) {
            moveX -= camForwardX;
            moveZ -= camForwardZ;
          }
          if (keys.right) {
            moveX += camRightX;
            moveZ += camRightZ;
          }
          if (keys.left) {
            moveX -= camRightX;
            moveZ -= camRightZ;
          }
          if (hasMoveJoy) {
            moveX += camForwardX * mJoy.y + camRightX * mJoy.x;
            moveZ += camForwardZ * mJoy.y + camRightZ * mJoy.x;
          }
        }

        let isMoving = false;
        const speedMultiplier =
          hasMoveJoy &&
          !keys.forward &&
          !keys.backward &&
          !keys.left &&
          !keys.right
            ? Math.max(0.28, moveJoyMag)
            : 1.0;
        const walkSpeed = 6.2 * speedMultiplier;
        const prevX = playerPosRef.current.x;
        const prevZ = playerPosRef.current.z;

        if (moveX !== 0 || moveZ !== 0) {
          const len = Math.hypot(moveX, moveZ);
          moveX /= len;
          moveZ /= len;

          const desiredX = prevX + moveX * walkSpeed * delta;
          const desiredZ = prevZ + moveZ * walkSpeed * delta;
          const [resolvedX, resolvedZ] = resolveCollisionsWithSliding(
            prevX,
            prevZ,
            desiredX,
            desiredZ
          );
          playerPosRef.current.x = resolvedX;
          playerPosRef.current.z = resolvedZ;

          // RPG-style body rotation toward intended movement direction
          const targetAvatarYaw = Math.atan2(moveX, moveZ);
          if (mode === 'tps') {
            const angleDiff = Math.atan2(
              Math.sin(targetAvatarYaw - avatarFacingYawRef.current),
              Math.cos(targetAvatarYaw - avatarFacingYawRef.current)
            );
            if (isSoftwareGl || reducedMotionRef.current) {
              avatarFacingYawRef.current = targetAvatarYaw;
            } else {
              avatarFacingYawRef.current += angleDiff * Math.min(1, delta * 14);
            }
          } else {
            avatarFacingYawRef.current = cameraOrbitYawRef.current;
          }

          isMoving = true;
          needsMoreFrames = true;
        } else if (walkTargetRef.current) {
          const dx = walkTargetRef.current.x - prevX;
          const dz = walkTargetRef.current.z - prevZ;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.18) {
            const step = Math.min(dist, walkSpeed * delta);
            const desiredX = prevX + (dx / dist) * step;
            const desiredZ = prevZ + (dz / dist) * step;
            const [resolvedX, resolvedZ] = resolveCollisionsWithSliding(
              prevX,
              prevZ,
              desiredX,
              desiredZ
            );
            playerPosRef.current.x = resolvedX;
            playerPosRef.current.z = resolvedZ;

            const actualMoved = Math.hypot(resolvedX - prevX, resolvedZ - prevZ);
            if (actualMoved < 0.004) {
              stuckTimer += delta;
              if (stuckTimer > 0.2) {
                walkTargetRef.current = null;
                walkTargetMarker.visible = false;
                stuckTimer = 0;
              }
            } else {
              stuckTimer = 0;
            }

            const targetAvatarYaw = Math.atan2(dx, dz);
            const angleDiff = Math.atan2(
              Math.sin(targetAvatarYaw - avatarFacingYawRef.current),
              Math.cos(targetAvatarYaw - avatarFacingYawRef.current)
            );
            avatarFacingYawRef.current +=
              isSoftwareGl || reducedMotionRef.current
                ? angleDiff
                : angleDiff * Math.min(1, delta * 14);

            if (mode === 'fps') {
              cameraOrbitYawRef.current = avatarFacingYawRef.current;
            }

            isMoving = actualMoved > 0.001;
            needsMoreFrames = true;
            if (walkTargetRef.current) {
              walkTargetMarker.visible = true;
              walkTargetMarker.position.set(
                walkTargetRef.current.x,
                0.03,
                walkTargetRef.current.z
              );
            }
          } else {
            walkTargetRef.current = null;
            walkTargetMarker.visible = false;
          }
        } else {
          walkTargetMarker.visible = false;
        }

        avatarRig.group.position.copy(playerPosRef.current);
        avatarRig.group.rotation.y = avatarFacingYawRef.current;

        if (isMoving) {
          walkCycle += delta * 10.5;
          const swing = Math.sin(walkCycle) * 0.55;
          avatarRig.leftLeg.rotation.x = swing;
          avatarRig.rightLeg.rotation.x = -swing;
          avatarRig.leftArm.rotation.x = -swing * 0.75;
          avatarRig.rightArm.rotation.x = swing * 0.75;
        } else {
          avatarRig.leftLeg.rotation.x *= 0.8;
          avatarRig.rightLeg.rotation.x *= 0.8;
          avatarRig.leftArm.rotation.x *= 0.8;
          avatarRig.rightArm.rotation.x *= 0.8;
        }

        if (isMoving) {
          let closestRoom: RoomId = activeRoomRef.current;
          let minDist = Infinity;
          for (const rm of ROOMS) {
            const d = Math.hypot(
              playerPosRef.current.x - rm.roomCenter[0],
              playerPosRef.current.z - rm.roomCenter[2]
            );
            if (d < minDist) {
              minDist = d;
              closestRoom = rm.id;
            }
          }
          if (minDist < 5.8 && closestRoom !== activeRoomRef.current) {
            activeRoomRef.current = closestRoom;
            onSelectRoom(closestRoom);
          }
        }

        if (mode === 'fps') {
          camera.position.set(
            playerPosRef.current.x,
            1.68 + (isMoving ? Math.sin(walkCycle * 2) * 0.025 : 0),
            playerPosRef.current.z
          );
          const lookDist = 6.0;
          const cosPitch = Math.cos(playerPitchRef.current);
          _targetLook.set(
            camera.position.x + Math.sin(cameraOrbitYawRef.current) * cosPitch * lookDist,
            camera.position.y + Math.sin(playerPitchRef.current) * lookDist,
            camera.position.z + Math.cos(cameraOrbitYawRef.current) * cosPitch * lookDist
          );
          camera.lookAt(_targetLook);
        } else {
          const dist = tpsDistanceRef.current;
          const pitch = Math.max(-0.55, Math.min(-0.08, playerPitchRef.current));
          const horizDist = dist * Math.cos(pitch);
          const vertDist = Math.min(2.95, Math.max(1.4, -dist * Math.sin(pitch) + 1.5));

          _camOffset.set(
            playerPosRef.current.x - Math.sin(cameraOrbitYawRef.current) * horizDist,
            vertDist,
            playerPosRef.current.z - Math.cos(cameraOrbitYawRef.current) * horizDist
          );
          camera.position.lerp(_camOffset, isSoftwareGl ? 1 : Math.min(1, delta * 12));
          _targetLook.set(
            playerPosRef.current.x,
            1.35,
            playerPosRef.current.z
          );
          camera.lookAt(_targetLook);
        }
      }

      roomRingMap.forEach((ringMesh, rId) => {
        const mat = ringMesh.material as THREE.MeshBasicMaterial;
        const targetOpacity = rId === activeRoomRef.current ? 0.9 : 0.22;
        mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, delta * 8);
      });

      if (!reducedMotionRef.current && !isSoftwareGl) {
        for (let i = 0; i < animatedItems.length; i++) {
          const item = animatedItems[i];
          item.mesh.position.y = item.baseY + Math.sin(elapsed * 2.2 + item.phase) * 0.08;
          item.mesh.rotation.y += delta * 0.6;
        }
      }

      renderSceneFrame();
      updateHotspotPositions();

      if (needsMoreFrames || (!isSoftwareGl && !reducedMotionRef.current)) {
        scheduleNextFrame();
      } else {
        isLoopActive = false;
      }
    };

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      const newAspect = newW / Math.max(1, newH);
      camera.aspect = newAspect;
      camera.fov = getResponsiveFov(newAspect);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(newW, newH, false);
      renderSceneFrame();
      updateHotspotPositions();
    };

    window.addEventListener('resize', handleResize);

    renderSceneFrame();
    updateHotspotPositions();
    onSceneReady();
    requestRender();

    return () => {
      disposed = true;
      requestRenderRef.current = null;
      syncVisualStyleRef.current = null;
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      controls.dispose();
      pmremGenerator.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRoomMeta = getRoomById(activeRoom);
  const styleLabel =
    visualStyle === 'studio'
      ? 'Studio'
      : visualStyle === 'maquette'
        ? 'Maquette'
        : 'Warm';

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-[#1e293b] ${
        cameraMode === 'fps' && !isDrawerOpen ? 'md:!cursor-none md:[&_*]:!cursor-none' : ''
      }`}
    >
      {/* WebGL Viewport Mount */}
      <div
        ref={mountRef}
        className={`w-full h-full touch-none ${
          cameraMode === 'fps' && !isDrawerOpen ? 'md:!cursor-none' : ''
        }`}
        aria-label="Interactive 3D Digital Office Viewport"
      />

      {/* ZEN MODE EXIT BUTTON — Linear DESIGN.md surface & border */}
      {zenMode && (
        <button
          type="button"
          onClick={onToggleZenMode}
          aria-label="Exit Zen Mode"
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-30 px-3 py-1.5 rounded-md bg-[#0f1011] hover:bg-[#18191a] border border-[#23252a] text-xs font-mono text-[#f7f8f8] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
        >
          Keluar Zen Mode (Z)
        </button>
      )}

      {/* TOP-CENTER CAMERA MODE & 3D STYLE HUD — Linear DESIGN.md surface (#0f1011) & 1px border (#23252a) */}
      {!zenMode && (
        <div
          role="region"
          aria-label="3D Camera Mode Switcher"
          className="fixed top-13 left-2.5 right-2.5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 md:top-3.5 z-20 flex items-center justify-between sm:justify-center gap-1 p-1 rounded-lg bg-[#0f1011] border border-[#23252a]"
        >
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onChangeCameraMode('orbit')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] ${
                cameraMode === 'orbit'
                  ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                  : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
              }`}
            >
              <kbd
                className={`hidden sm:inline-block px-1 py-0.5 rounded-xs text-[10px] font-mono ${
                  cameraMode === 'orbit'
                    ? 'bg-black/25 text-[#f7f8f8]'
                    : 'bg-[#141516] text-[#8a8f98] border border-[#23252a]'
                }`}
              >
                1
              </kbd>
              <span>Orbit</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeCameraMode('fps')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] ${
                cameraMode === 'fps'
                  ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                  : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
              }`}
            >
              <kbd
                className={`hidden sm:inline-block px-1 py-0.5 rounded-xs text-[10px] font-mono ${
                  cameraMode === 'fps'
                    ? 'bg-black/25 text-[#f7f8f8]'
                    : 'bg-[#141516] text-[#8a8f98] border border-[#23252a]'
                }`}
              >
                2
              </kbd>
              <span>FPS</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeCameraMode('tps')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] ${
                cameraMode === 'tps'
                  ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                  : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
              }`}
            >
              <kbd
                className={`hidden sm:inline-block px-1 py-0.5 rounded-xs text-[10px] font-mono ${
                  cameraMode === 'tps'
                    ? 'bg-black/25 text-[#f7f8f8]'
                    : 'bg-[#141516] text-[#8a8f98] border border-[#23252a]'
                }`}
              >
                3
              </kbd>
              <span>TPS</span>
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <span className="hidden sm:inline-block h-3.5 w-px bg-[#23252a] mx-1" aria-hidden="true" />
            <button
              type="button"
              onClick={handleCycleVisualStyle}
              title="Ganti gaya visual ruangan 3D: Studio / Clay Maquette / Warm Loft (Shortcut: G)"
              className="px-2 py-1 rounded-md text-[11px] font-mono text-[#f7f8f8] bg-[#141516] hover:bg-[#18191a] border border-[#23252a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
            >
              {styleLabel}
              <span className="hidden sm:inline text-[#8a8f98]"> (G)</span>
            </button>
            <button
              type="button"
              onClick={handleResetView}
              title="Reset posisi kamera (Shortcut: R)"
              className="px-2 py-1 rounded-md text-[11px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
            >
              Reset<span className="hidden sm:inline"> (R)</span>
            </button>
            <button
              type="button"
              onClick={onToggleZenMode}
              title="Sembunyikan semua UI (Shortcut: Z)"
              className="px-2 py-1 rounded-md text-[11px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
            >
              Zen<span className="hidden sm:inline"> (Z)</span>
            </button>
          </div>
        </div>
      )}

      {/* FPS Crosshair Reticle in Center of Screen */}
      {!zenMode && !isDrawerOpen && cameraMode === 'fps' && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 flex items-center justify-center z-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#f7f8f8] ring-2 ring-[#0f1011]/80" />
        </div>
      )}

      {/* DESKTOP CONTEXTUAL ROOM BAR (md+ only; only shown when a room/place is clicked) */}
      {!zenMode && !isDrawerOpen && isPlaceSelected && (
        <div className="hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-20 items-center justify-center gap-3 px-3.5 py-2 rounded-lg bg-[#0f1011] border border-[#23252a]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-xs shrink-0"
              style={{ backgroundColor: currentRoomMeta.accentHex }}
            />
            <span className="text-xs font-medium tracking-[-0.01em] text-[#f7f8f8] truncate">
              {currentRoomMeta.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenRoomDetail(activeRoom)}
            className="px-3 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] text-xs font-medium transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
          >
            Buka Detail Ruangan
          </button>
        </div>
      )}

      {/* =====================================================================
          1. MOBILE LEFT-THUMB 360° MOVEMENT ANALOG JOYSTICK (Mobile < md only, stays visible in Zen Mode)
          Note: The circular right-side Camera Analog Joystick has been removed as requested
          because mobile users rotate/orbit the camera directly via native touch gestures on the screen.
         ===================================================================== */}
      {!isDrawerOpen && (
        <div
          role="group"
          aria-label="Analog Joystick Pergerakan 360 Derajat"
          onTouchStart={(e) => {
            e.stopPropagation();
            const touch = e.changedTouches[0];
            if (!touch) return;
            const rect = e.currentTarget.getBoundingClientRect();
            moveStickTouchIdRef.current = touch.identifier;
            moveStickCenterRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };
            updateMoveAnalogFromPoint(touch.clientX, touch.clientY, 36);
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            for (let i = 0; i < e.changedTouches.length; i++) {
              const t = e.changedTouches[i];
              if (t.identifier === moveStickTouchIdRef.current) {
                updateMoveAnalogFromPoint(t.clientX, t.clientY, 36);
                break;
              }
            }
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            for (let i = 0; i < e.changedTouches.length; i++) {
              if (
                e.changedTouches[i].identifier === moveStickTouchIdRef.current
              ) {
                resetMoveAnalog();
                break;
              }
            }
          }}
          onTouchCancel={(e) => {
            e.stopPropagation();
            resetMoveAnalog();
          }}
          onPointerDown={(e) => {
            if (e.pointerType === 'touch') return;
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            const rect = e.currentTarget.getBoundingClientRect();
            moveStickCenterRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };
            updateMoveAnalogFromPoint(e.clientX, e.clientY, 36);
          }}
          onPointerMove={(e) => {
            if (e.pointerType === 'touch' || !moveStickCenterRef.current)
              return;
            e.stopPropagation();
            updateMoveAnalogFromPoint(e.clientX, e.clientY, 36);
          }}
          onPointerUp={(e) => {
            if (e.pointerType === 'touch') return;
            e.stopPropagation();
            resetMoveAnalog();
          }}
          onPointerCancel={(e) => {
            if (e.pointerType === 'touch') return;
            e.stopPropagation();
            resetMoveAnalog();
          }}
          className={`md:hidden fixed ${
            zenMode || !isPlaceSelected ? 'bottom-5' : 'bottom-[74px]'
          } left-4 z-20 w-26 h-26 rounded-full bg-[#0f1011]/90 border border-[#23252a] flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing transition-[bottom] duration-200`}
        >
          {/* Inner Arena Ring */}
          <div className="pointer-events-none absolute inset-3 rounded-full border border-[#23252a] bg-[#141516]/80" />

          {/* Directional Chevrons around Outer Ring */}
          <span
            className={`pointer-events-none absolute top-1.5 text-[8px] font-mono transition-colors ${
              moveStickUi.active && moveStickUi.y < -10
                ? 'text-[#f7f8f8]'
                : 'text-[#62666d]'
            }`}
          >
            ▲
          </span>
          <span
            className={`pointer-events-none absolute bottom-1.5 text-[8px] font-mono transition-colors ${
              moveStickUi.active && moveStickUi.y > 10
                ? 'text-[#f7f8f8]'
                : 'text-[#62666d]'
            }`}
          >
            ▼
          </span>
          <span
            className={`pointer-events-none absolute left-1.5 text-[8px] font-mono transition-colors ${
              moveStickUi.active && moveStickUi.x < -10
                ? 'text-[#f7f8f8]'
                : 'text-[#62666d]'
            }`}
          >
            ◄
          </span>
          <span
            className={`pointer-events-none absolute right-1.5 text-[8px] font-mono transition-colors ${
              moveStickUi.active && moveStickUi.x > 10
                ? 'text-[#f7f8f8]'
                : 'text-[#62666d]'
            }`}
          >
            ►
          </span>

          {/* Active Directional Rim Highlight */}
          {moveStickUi.active && (
            <div
              style={{ transform: `rotate(${moveStickUi.angleDeg}deg)` }}
              className="pointer-events-none absolute inset-0 rounded-full border-t-2 border-[#5e6ad2]"
            />
          )}

          {/* Draggable Inner Analog Thumb Stick Knob — Linear DESIGN.md #5e6ad2 */}
          <div
            style={{
              transform: `translate3d(${moveStickUi.x}px, ${moveStickUi.y}px, 0)`,
            }}
            className={`pointer-events-none w-11 h-11 rounded-full bg-[#5e6ad2] border border-[#f7f8f8]/40 flex items-center justify-center ${
              moveStickUi.active
                ? 'scale-105'
                : 'transition-transform duration-150 ease-out'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#f7f8f8]/25" />
          </div>
        </div>
      )}

      {/* =====================================================================
          2. DESKTOP KEYBOARD / BUTTON PAD (Hidden on Mobile, visible on md+)
         ===================================================================== */}
      {!zenMode && !isDrawerOpen && (
        <div
          aria-label="On-Screen 3D Movement Controls"
          className="hidden md:flex fixed bottom-4 left-4 z-20 flex-col items-center gap-1.5 p-2 rounded-lg bg-[#0f1011] border border-[#23252a] touch-none select-none"
        >
          <div className="font-mono text-[9px] uppercase tracking-wider text-[#62666d]">
            {cameraMode === 'orbit' ? 'GESER KAMERA' : 'JALAN (WASD)'}
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('turnLeft', true);
              }}
              onPointerUp={() => setPadState('turnLeft', false)}
              onPointerCancel={() => setPadState('turnLeft', false)}
              onPointerLeave={() => setPadState('turnLeft', false)}
              className="w-9 h-7 rounded-md bg-[#141516] hover:bg-[#18191a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[10px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Putar Kamera Kiri (Q)"
            >
              ↺ Q
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('forward', true);
              }}
              onPointerUp={() => setPadState('forward', false)}
              onPointerCancel={() => setPadState('forward', false)}
              onPointerLeave={() => setPadState('forward', false)}
              className="w-9 h-7 rounded-md bg-[#18191a] hover:bg-[#23252a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[11px] font-mono font-medium text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Maju (W / Arrow Up)"
            >
              ▲ W
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('turnRight', true);
              }}
              onPointerUp={() => setPadState('turnRight', false)}
              onPointerCancel={() => setPadState('turnRight', false)}
              onPointerLeave={() => setPadState('turnRight', false)}
              className="w-9 h-7 rounded-md bg-[#141516] hover:bg-[#18191a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[10px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Putar Kamera Kanan (E)"
            >
              E ↻
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('left', true);
              }}
              onPointerUp={() => setPadState('left', false)}
              onPointerCancel={() => setPadState('left', false)}
              onPointerLeave={() => setPadState('left', false)}
              className="w-9 h-7 rounded-md bg-[#18191a] hover:bg-[#23252a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[11px] font-mono font-medium text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Kiri (A / Arrow Left)"
            >
              ◄ A
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('backward', true);
              }}
              onPointerUp={() => setPadState('backward', false)}
              onPointerCancel={() => setPadState('backward', false)}
              onPointerLeave={() => setPadState('backward', false)}
              className="w-9 h-7 rounded-md bg-[#18191a] hover:bg-[#23252a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[11px] font-mono font-medium text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Putar Balik / Mundur (S / Arrow Down)"
            >
              ▼ S
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setPadState('right', true);
              }}
              onPointerUp={() => setPadState('right', false)}
              onPointerCancel={() => setPadState('right', false)}
              onPointerLeave={() => setPadState('right', false)}
              className="w-9 h-7 rounded-md bg-[#18191a] hover:bg-[#23252a] active:bg-[#5e6ad2] active:text-[#f7f8f8] border border-[#23252a] text-[11px] font-mono font-medium text-[#f7f8f8] flex items-center justify-center cursor-pointer touch-none select-none"
              title="Kanan (D / Arrow Right)"
            >
              D ►
            </button>
          </div>
        </div>
      )}

      {/* 3D-Projected Room Signage Pins (Only visible on Hover or Proximity!) */}
      <div
        ref={hotspotContainerRef}
        className="pointer-events-none absolute inset-0 overflow-hidden z-10"
      >
        {ROOMS.map((room) => {
          const isCurrent = room.id === activeRoom;
          return (
            <button
              key={room.id}
              type="button"
              data-room-hotspot={room.id}
              onClick={() => {
                onSelectRoom(room.id);
                onOpenRoomDetail(room.id);
              }}
              aria-label={`Enter ${room.name} (${room.shortLabel})`}
              className={`pointer-events-auto absolute top-0 left-0 flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-opacity duration-150 cursor-pointer opacity-0 ${
                isCurrent
                  ? 'bg-[#0f1011] border-[#5e6ad2] text-[#f7f8f8]'
                  : 'bg-[#0f1011]/95 border-[#23252a] text-[#8a8f98] hover:border-[#34373f] hover:text-[#f7f8f8]'
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: room.accentHex }}
              />
              <span className="text-xs font-medium tracking-[-0.01em] whitespace-nowrap">
                {room.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Collapsible Office Floor Plan Blueprint — Linear DESIGN.md panel */}
      {!zenMode && showFloorPlan && (
        <aside
          aria-label="Digital Office Floor Plan"
          className="fixed top-26 left-2.5 right-2.5 sm:left-auto sm:right-4 sm:w-64 md:top-15 z-30 bg-[#0f1011] border border-[#23252a] rounded-lg p-3.5"
        >
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#23252a]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#62666d]">
                DENAH KANTOR DIGITAL
              </p>
              <p className="text-xs font-medium text-[#f7f8f8]">
                Pilih Ruangan
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleFloorPlan}
              className="font-mono text-[10px] text-[#8a8f98] hover:text-[#f7f8f8] px-2 py-0.5 rounded-xs bg-[#141516] border border-[#23252a] cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              {(['projects', 'systems'] as RoomId[]).map((rid) => {
                const r = ROOMS.find((rm) => rm.id === rid)!;
                const active = activeRoom === rid;
                return (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => {
                      if (onClickRoom) {
                        onClickRoom(rid);
                      } else {
                        onSelectRoom(rid);
                      }
                    }}
                    className={`text-left p-2 rounded-md border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#5e6ad2]/15 border-[#5e6ad2] text-[#f7f8f8]'
                        : 'bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34373f]'
                    }`}
                  >
                    <div className="text-[11px] font-medium text-[#f7f8f8] truncate">{r.name}</div>
                    <div className="text-[10px] text-[#62666d] truncate">Sayap Utara</div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (onClickRoom) {
                  onClickRoom('lobby');
                } else {
                  onSelectRoom('lobby');
                }
              }}
              className={`w-full text-left p-2 rounded-md border transition-colors cursor-pointer ${
                activeRoom === 'lobby'
                  ? 'bg-[#5e6ad2]/15 border-[#5e6ad2] text-[#f7f8f8]'
                  : 'bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34373f]'
              }`}
            >
              <div className="text-xs font-medium text-[#f7f8f8]">Virtual Office Lobby</div>
              <div className="text-[10px] text-[#62666d]">Area Resepsionis Utama</div>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              {(['experience', 'cases'] as RoomId[]).map((rid) => {
                const r = ROOMS.find((rm) => rm.id === rid)!;
                const active = activeRoom === rid;
                return (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => {
                      if (onClickRoom) {
                        onClickRoom(rid);
                      } else {
                        onSelectRoom(rid);
                      }
                    }}
                    className={`text-left p-2 rounded-md border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#5e6ad2]/15 border-[#5e6ad2] text-[#f7f8f8]'
                        : 'bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34373f]'
                    }`}
                  >
                    <div className="text-[11px] font-medium text-[#f7f8f8] truncate">{r.name}</div>
                    <div className="text-[10px] text-[#62666d] truncate">Sayap Tengah</div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (onClickRoom) {
                  onClickRoom('contact');
                } else {
                  onSelectRoom('contact');
                }
              }}
              className={`w-full text-left p-2 rounded-md border transition-colors cursor-pointer ${
                activeRoom === 'contact'
                  ? 'bg-[#5e6ad2]/15 border-[#5e6ad2] text-[#f7f8f8]'
                  : 'bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34373f]'
              }`}
            >
              <div className="text-xs font-medium text-[#f7f8f8]">Coffee Bar & Contact Lounge</div>
              <div className="text-[10px] text-[#62666d]">Area Tamu Selatan</div>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

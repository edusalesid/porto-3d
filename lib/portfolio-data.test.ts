import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTFOLIO_PROJECTS,
  ROOMS,
  EXPERIENCE_TIMELINE,
  SYSTEMS_WORKFLOWS,
  filterAndSortProjects,
  getProjectBySlug,
  getRoomById,
  validateCaseStudyCompleteness,
} from './portfolio-data';

test('all 6 virtual office rooms exist with valid camera coordinates', () => {
  assert.equal(ROOMS.length, 6);
  const expectedIds = ['lobby', 'projects', 'systems', 'experience', 'cases', 'contact'];
  assert.deepEqual(
    ROOMS.map((r) => r.id),
    expectedIds
  );
  for (const room of ROOMS) {
    assert.equal(room.cameraPosition.length, 3);
    assert.equal(room.cameraTarget.length, 3);
    assert.ok(room.summary.length > 20);
  }
});

test('all portfolio projects satisfy the 14-point Case Archive structure', () => {
  assert.ok(PORTFOLIO_PROJECTS.length >= 5);
  for (const project of PORTFOLIO_PROJECTS) {
    const check = validateCaseStudyCompleteness(project);
    assert.equal(
      check.valid,
      true,
      `Project ${project.slug} is missing fields: ${check.missingFields.join(', ')}`
    );
  }
});

test('filterAndSortProjects filters by category and search query accurately', () => {
  const aiProjects = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    category: 'AI',
  });
  assert.ok(aiProjects.length >= 3);
  assert.ok(aiProjects.every((p) => p.category.includes('AI')));

  const posSearch = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    searchQuery: 'IndexedDB',
  });
  assert.equal(posSearch.length, 1);
  assert.equal(posSearch[0].slug, 'mfood-pos');

  const sortedByTitle = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    sortBy: 'title',
  });
  assert.ok(sortedByTitle[0].title.localeCompare(sortedByTitle[1].title) <= 0);
});

test('getProjectBySlug and getRoomById resolve expected items and safe defaults', () => {
  const kms = getProjectBySlug('diamond-kms');
  assert.ok(kms);
  assert.equal(kms.role, 'Project Manager & Systems Analyst');

  const unknownRoom = getRoomById('non-existent');
  assert.equal(unknownRoom.id, 'lobby');
});

test('experience timeline and systems workflows link to valid project slugs', () => {
  for (const exp of EXPERIENCE_TIMELINE) {
    for (const slug of exp.relatedCaseSlugs) {
      assert.ok(getProjectBySlug(slug), `Missing project slug ${slug} in experience ${exp.id}`);
    }
  }
  for (const sys of SYSTEMS_WORKFLOWS) {
    assert.ok(getProjectBySlug(sys.appliedInSlug), `Missing project slug ${sys.appliedInSlug} in system ${sys.id}`);
  }
});

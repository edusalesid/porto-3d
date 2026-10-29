import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTFOLIO_PROJECTS,
  ROOMS,
  EXPERIENCE_TIMELINE,
  SYSTEMS_WORKFLOWS,
  CONTACT_INFO,
  filterAndSortProjects,
  getProjectBySlug,
  getRoomById,
  validateCaseStudyCompleteness,
} from './portfolio-data.ts';

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
  assert.equal(PORTFOLIO_PROJECTS.length, 4);
  const expectedSlugs = ['unilever-gt2', 'dashboard-oee', 'employr', 'mfood'];
  assert.deepEqual(
    PORTFOLIO_PROJECTS.map((p) => p.slug),
    expectedSlugs
  );
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
  assert.ok(aiProjects.length >= 1);
  assert.ok(aiProjects.every((p) => p.category.includes('AI')));

  const posSearch = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    searchQuery: 'IndexedDB',
  });
  assert.equal(posSearch.length, 1);
  assert.equal(posSearch[0].slug, 'mfood');

  const oeeSearch = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    searchQuery: 'Overall Equipment Effectiveness',
  });
  assert.equal(oeeSearch.length, 1);
  assert.equal(oeeSearch[0].slug, 'dashboard-oee');

  const unileverSearch = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    searchQuery: 'Captivate',
  });
  assert.equal(unileverSearch.length, 1);
  assert.equal(unileverSearch[0].slug, 'unilever-gt2');

  const sortedByTitle = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    sortBy: 'title',
  });
  assert.ok(sortedByTitle[0].title.localeCompare(sortedByTitle[1].title) <= 0);
});

test('getProjectBySlug and getRoomById resolve expected items and safe defaults', () => {
  const employr = getProjectBySlug('employr');
  assert.ok(employr);
  assert.equal(employr.role, 'Product & Full-Stack System Architect');

  // Verify backward compatibility for old slug 'mfood-pos'
  const legacyMfood = getProjectBySlug('mfood-pos');
  assert.ok(legacyMfood);
  assert.equal(legacyMfood.slug, 'mfood');

  const unilever = getProjectBySlug('unilever-gt2');
  assert.ok(unilever);
  assert.equal(unilever.publicUrl, 'https://unilever.riizalhp.web.id');

  const oee = getProjectBySlug('dashboard-oee');
  assert.ok(oee);
  assert.equal(oee.publicUrl, 'https://dashboard-oee.riizalhp.web.id');

  const unknownRoom = getRoomById('non-existent');
  assert.equal(unknownRoom.id, 'lobby');
});

test('experience timeline and systems workflows link to valid project slugs', () => {
  assert.equal(EXPERIENCE_TIMELINE.length, 8);
  for (const exp of EXPERIENCE_TIMELINE) {
    assert.ok(exp.role.length > 0);
    assert.ok(exp.organization.length > 0);
    assert.ok(exp.contributions.length > 0);
    for (const slug of exp.relatedCaseSlugs) {
      assert.ok(getProjectBySlug(slug), `Missing project slug ${slug} in experience ${exp.id}`);
    }
  }
  for (const sys of SYSTEMS_WORKFLOWS) {
    assert.ok(getProjectBySlug(sys.appliedInSlug), `Missing project slug ${sys.appliedInSlug} in system ${sys.id}`);
  }
});

test('contact information reflects Rizal Hanifa Pratama profile accurately', () => {
  assert.equal(CONTACT_INFO.fullName, 'Rizal Hanifa Pratama');
  assert.equal(CONTACT_INFO.email, 'rizalhp12345@gmail.com');
  assert.equal(CONTACT_INFO.linkedinUrl, 'https://www.linkedin.com/in/riizalhp');
  assert.equal(CONTACT_INFO.websiteUrl, 'https://riizalhp.web.id');
  assert.ok(CONTACT_INFO.education.length >= 2);
  assert.ok(CONTACT_INFO.certifications.length >= 5);
  assert.ok(CONTACT_INFO.topSkills.length >= 3);
});

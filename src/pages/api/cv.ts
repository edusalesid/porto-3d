import type { APIRoute } from 'astro';

const CV_TEXT = `================================================================================
RIZAL HANIFA PRATAMA
Coding Teacher @ SMA IHSANUL FIKRI MUNGKID | Bilingual Communications, Digitalization Development
================================================================================
Location: Semarang, Central Java, Indonesia
Email: rizalhp12345@gmail.com
LinkedIn: https://www.linkedin.com/in/riizalhp
Personal Website: https://riizalhp.web.id/

--------------------------------------------------------------------------------
SUMMARY
--------------------------------------------------------------------------------
As a Coding Teacher at SMA IHSANUL FIKRI MUNGKID, I deliver 26 teaching hours
weekly to over 200 students across 11 classes, including bilingual instruction
for the International Class of Ihsanul Fikri (ICIF). I also contribute to the
Internal Quality Assurance System (SPMI) to enhance academic and learning
standards and oversee the operation of a 50+ device computer lab, ensuring its
readiness for daily education activities. With a Bachelor's degree in Informatika
from Universitas Pembangunan Nasional Veteran Yogyakarta, I specialize in
digitalization development, bilingual communications, and teacher training.
My dedication lies in fostering computational and programming skills while
promoting academic excellence and technical innovation in educational environments.

--------------------------------------------------------------------------------
TOP SKILLS
--------------------------------------------------------------------------------
- Bilingual Communications
- Curriculum Development
- Teacher Training
- Digitalization Development
- IT Project Management & Agile Scrum
- Deep Learning & Artificial Intelligence (AI) Education

--------------------------------------------------------------------------------
CERTIFICATIONS
--------------------------------------------------------------------------------
- Project Execution: Running the Project
- Project Planning: Putting It All Together
- Project Management (Fresh Graduate Academy)
- Agile Scrum Certifications Training
- Studi Independen

--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
Universitas Pembangunan Nasional Veteran Yogyakarta
Bachelor's degree, Informatika (August 2021 — July 2025)

SMA Negeri 2 Semarang
Graduated, IPA (2019 — 2021)

--------------------------------------------------------------------------------
EXPERIENCE
--------------------------------------------------------------------------------

1. SMA IHSANUL FIKRI MUNGKID
   Coding Teacher
   August 2026 — Present (3 months)
   Magelang, Central Java, Indonesia
   - Taught 200+ students across 11 classes, delivering 26 teaching hours per
     week focused on coding, programming, and computational skills.
   - Taught 2 classes in the International Class of Ihsanul Fikri (ICIF) using
     a bilingual Indonesian-English teaching approach, delivering coding concepts
     and technical instruction in both languages.
   - Contributed to the school's Internal Quality Assurance System (SPMI) to
     support continuous improvement of academic and learning processes.
   - Managed and maintained the school's computer laboratory with 50+ devices,
     ensuring hardware and software readiness for daily learning activities.
   - Contributed to the development and implementation of Deep Learning and
     Coding & Artificial Intelligence (AI) learning programs at the senior high
     school level.

2. PT Triagro Hijrah Jaya
   Digital Marketing
   November 2025 — Present (1 year)
   Sukoharjo, Central Java, Indonesia
   - Planned and executed digital marketing campaigns across online channels to
     expand agricultural product reach and buyer engagement.
   - Coordinated operational marketing funnels, lead intake tracking, and sales
     conversion optimization.
   - Analyzed digital marketing campaign metrics and attribution performance to
     drive commercial growth and customer retention.

3. Movio Studio (PT Movio Kreasi Indonesia)
   11 months | Kota Tangerang Selatan, Banten, Indonesia
   - Information Technology Team Lead (May 2026 — September 2026 · 5 months)
     * Led the IT engineering team in technical architecture planning, sprint
       execution, and systems delivery.
   - General Project Manager (November 2025 — May 2026 · 7 months)
     * Directed project management workflows, coordinating cross-functional
       engineering, creative, and operational deliverables.
     * Standardized project tracking rituals and technical documentation.

4. Cont Solutions Indonesia
   IT Project Manager
   June 2024 — November 2025 (1 year 6 months)
   Yogyakarta, Indonesia
   - Managed end-to-end IT solution deliverables and client software projects,
     translating business requirements into clear technical specifications and
     agile sprint milestones.
   - Facilitated cross-functional collaboration between engineering, design, and
     business stakeholders.
   - Mitigated technical dependencies, managed delivery risks, and ensured high
     standards of software quality and system stability.

5. PT Gemala Kempa Daya
   Product Development Intern
   June 2024 — August 2024 (3 months)
   North Jakarta, Jakarta, Indonesia
   - Assisted product engineering teams in preparing technical drawings, component
     specifications, and product validation protocols.
   - Collaborated with production and quality control departments to review
     manufacturing tolerances and assembly workflows.
   - Conducted process evaluations to help enhance product quality standards.

6. Information Technology Club UPN Veteran Yogyakarta
   2 years 7 months | Sleman Regency, Yogyakarta, Indonesia
   - Head of Project Manager Departement (February 2023 — August 2024 · 1 yr 7 mos)
     * Becoming the Project Manager Leader leading 5 Project Managers who
       successfully handled 10 Final Projects for the Information Technology Club.
     * Established standardized agile project governance frameworks and sprint rituals.
   - Staff Project Manager (February 2022 — 2023 · 1 year)
     * Coordinated student software initiatives and cross-functional workshops.

7. Gerakan Nasional 1000 Startup Digital
   Hustler and Hacker
   February 2024 — July 2024 (6 months)
   Yogyakarta, Indonesia
   - Validated early-stage problem-solution fit, conducted user interviews, and
     modeled digital business value propositions.
   - Synthesized business requirements into workable technology MVP prototypes.

8. Sinaou Education
   Co-Founder and Product Manager
   June 2023 — March 2024 (10 months)
   Sleman Regency, Yogyakarta, Indonesia
   - Defined educational product roadmap, user journey maps, and backlog priorities.
   - Coordinated agile product releases with student developers and designed
     curriculum learning materials.

--------------------------------------------------------------------------------
PORTFOLIO CASE STUDIES & SOFTWARE SYSTEMS
--------------------------------------------------------------------------------
- Unilever GT2 Learning Portal: E-Learning & SCORM 1.2 Simulation (https://unilever.riizalhp.web.id)
- OEE Monitoring System: Real-Time Overall Equipment Effectiveness Dashboard (https://dashboard-oee.riizalhp.web.id)
- Employr: Career Workspace & ATS-Friendly CV Builder Platform (https://employr.id)
- mfood.id: Integrated F&B Business Operating System & Mobile POS (https://mfood.id)
================================================================================
`;

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(CV_TEXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Rizal_Hanifa_Pratama_CV.txt"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};

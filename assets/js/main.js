const CONTACT = Object.freeze({
  whatsappBase: 'https://wa.me/543513199546',
  whatsappUrl: 'https://wa.me/543513199546?text=Hola%20M%C3%A9dicos%20de%20Familia%2C%20quiero%20hacer%20una%20consulta%20o%20coordinar%20un%20turno.',
  phoneUrl: 'tel:+543514214225',
  mapsUrl: 'https://maps.app.goo.gl/eV1vY4MmGpJ5j6Mh9'
});

// Neutral measurement layer: pushes structured events to window.dataLayer so a
// future GTM container can pick them up without any code changes here. No
// tracking script is loaded and no container/measurement ID is referenced.
window.dataLayer = window.dataLayer || [];

const pushDataLayerEvent = (event, payload = {}) => {
  window.dataLayer.push({ event, ...payload });
};

document.addEventListener('click', (event) => {
  const whatsappLink = event.target.closest('a[href*="wa.me"]');
  if (whatsappLink) {
    pushDataLayerEvent('whatsapp_click', {
      link_url: whatsappLink.href,
      link_section: whatsappLink.closest('section, header, footer')?.id || 'unknown'
    });
    return;
  }

  const telLink = event.target.closest('a[href^="tel:"]');
  if (telLink) {
    pushDataLayerEvent('phone_click', { link_url: telLink.href });
    return;
  }

  const mapsLink = event.target.closest('a[href*="maps.app.goo.gl"]');
  if (mapsLink) {
    pushDataLayerEvent('maps_click', { link_url: mapsLink.href });
  }
});

const siteHeader = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const professionalDialog = document.getElementById('professionalDialog');
const professionalDialogContent = document.getElementById('professionalDialogContent');
let lastProfessionalTrigger = null;
let lastMenuTrigger = null;
let closeDialogTimer = null;
let filterTimer = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Must match --duration-dialog-close in styles.css: closing is intentionally
// quicker than opening (--duration-dialog).
const dialogMotionMs = prefersReducedMotion ? 0 : 300;

const pageChrome = [...document.querySelectorAll('body > header, body > main, body > footer')];

if (mobileDrawer) {
  mobileDrawer.inert = true;
}

const setMenu = (open) => {
  if (!mobileDrawer || !menuToggle) return;

  if (open) {
    lastMenuTrigger = document.activeElement === menuToggle ? menuToggle : null;
  }

  mobileDrawer.classList.toggle('open', open);
  mobileDrawer.setAttribute('aria-hidden', String(!open));
  mobileDrawer.inert = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);

  if (open) {
    requestAnimationFrame(() => mobileDrawer.querySelector('a')?.focus());
  } else if (lastMenuTrigger?.isConnected) {
    lastMenuTrigger.focus();
    lastMenuTrigger = null;
  }
};

if (menuToggle && mobileDrawer) {
  menuToggle.addEventListener('click', () => {
    setMenu(!mobileDrawer.classList.contains('open'));
  });

  mobileDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

const updateHeader = () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const professionals = [
  {
    type: 'professional', name: 'Dr. Carlos Presman', treatment: 'Dr.',
    specialty: 'Clínica Médica · Medicina Interna',
    cardSpecialty: 'Clínica Médica',
    filterCategories: ['Clínica Médica'],
    description: 'Acompaña consultas clínicas de adultos y personas mayores, con mirada de medicina interna.',
    detail: 'Médico clínico de adultos y adultos mayores, especialista en medicina interna y terapia intensiva. Su perfil permite orientar controles, seguimiento clínico y evaluación integral de pacientes adultos.',
    keywords: ['clínica médica', 'medicina interna', 'terapia intensiva', 'adultos mayores'],
    consultationAreas: ['Clínica médica', 'Medicina interna', 'Adultos', 'Personas mayores', 'Terapia intensiva'],
    phone: null, whatsapp: null, license: 'MP 17871 · ME 5130 · ME 9125',
    slug: 'carlos-presman', photo: './assets/images/profesionales/carlos-presman.webp'
  },
  {
    type: 'professional', name: 'Dr. Guillermo Calvo Hidalgo', treatment: 'Dr.',
    specialty: 'Clínica Médica · Cardiología',
    description: 'Consultas de clínica médica y cardiología para adultos, con seguimiento clínico integral.',
    detail: 'Especialista en clínica médica y cardiología. Orienta a adultos que requieren evaluación clínica general, mirada cardiovascular y continuidad en el seguimiento.',
    keywords: ['clínica médica', 'cardiología', 'adultos'],
    consultationAreas: ['Clínica médica', 'Cardiología', 'Adultos', 'Seguimiento clínico'],
    phone: null, whatsapp: null, license: 'MP 24172 · CE 8341 · CE 13122',
    slug: 'guillermo-calvo-hidalgo', photo: './assets/images/profesionales/guillermo-calvo-hidalgo.webp'
  },
  {
    type: 'professional', name: 'Dra. Juana A. Presman', treatment: 'Dra.',
    specialty: 'Medicina Interna · Adolescencia',
    cardSpecialty: 'Clínica Médica · Adolescencia',
    filterCategories: ['Clínica Médica'],
    description: 'Medicina interna con formación en salud del adolescente y atención especializada en desórdenes alimentarios.',
    detail: 'Médica especialista en medicina interna, con formación y experiencia en salud del adolescente. Atiende también consultas de desórdenes alimentarios, con una mirada clínica orientada al acompañamiento y el seguimiento.',
    credential: 'Expertoria en Salud del Adolescente · N.º 94 C.M.P.C.',
    keywords: ['medicina interna', 'salud del adolescente', 'desórdenes alimentarios'],
    consultationAreas: ['Medicina interna', 'Salud del adolescente', 'Desórdenes alimentarios', 'Seguimiento clínico'],
    phone: null, whatsapp: null, license: 'MP 13353 · ME 4328',
    slug: 'juana-presman', photo: './assets/images/profesionales/juana-presman.webp'
  },
  {
    type: 'professional', name: 'Julio César Guerini', treatment: null,
    specialty: 'Medicina Interna · Medicina del Trabajo · Medicina Legal',
    cardSpecialty: 'Clínica Médica',
    filterCategories: ['Clínica Médica'],
    description: 'Consultas vinculadas a medicina interna, medicina del trabajo y medicina legal.',
    detail: 'Especialista en medicina interna, medicina legal y medicina del trabajo. Su perfil integra la evaluación clínica de adultos y adultos mayores, y permite orientar controles, seguimiento clínico y evaluación integral de pacientes.',
    keywords: ['clínica médica', 'medicina interna', 'medicina laboral', 'medicina legal', 'adultos mayores'],
    consultationAreas: ['Medicina interna', 'Medicina del trabajo', 'Medicina legal', 'Adultos', 'Adultos mayores', 'Seguimiento clínico', 'Evaluación integral'],
    phone: null, whatsapp: null, license: 'MP 36.996 · MN 157187 · CE 18.660 · CE 19.577 · CE 22.157',
    slug: 'julio-guerini', photo: './assets/images/profesionales/julio-cesar-guerini.webp',
    photoAlt: 'Julio César Guerini, profesional de Médicos de Familia'
  },
  {
    type: 'professional', name: 'Dr. Marcelo H. Argüello', treatment: 'Dr.',
    specialty: 'Pediatría · Emergentología Pediátrica',
    description: 'Pediatría para controles y consultas de salud infantil, con formación en emergentología.',
    detail: 'Médico pediatra y emergentólogo pediatra. Atiende consultas pediátricas, controles de salud infantil y situaciones que requieren criterio especializado en emergentología pediátrica.',
    keywords: ['pediatría', 'emergentología pediátrica', 'niños'],
    consultationAreas: ['Pediatría', 'Emergentología pediátrica', 'Controles de salud', 'Niñas y niños'],
    phone: null, whatsapp: null, license: 'MP 20281 · MN 121953 · ME 6827 · ME 14369',
    slug: 'marcelo-arguello', photo: './assets/images/profesionales/marcelo-arguello.webp'
  },
  {
    type: 'professional', name: 'Dra. Graciela Testa', treatment: 'Dra.',
    specialty: 'Endocrinología Pediátrica',
    description: 'Endocrinología pediátrica para recién nacidos, niñas, niños y adolescentes.',
    detail: 'Médica pediatra especialista en endocrinología infantil. Atiende consultas relacionadas con el diagnóstico, control y tratamiento de trastornos hormonales en recién nacidos, niños y adolescentes.',
    keywords: ['endocrinología pediátrica', 'endocrinología infantil', 'trastornos hormonales', 'recién nacidos', 'niños', 'adolescentes'],
    consultationAreas: ['Endocrinología pediátrica', 'Trastornos hormonales', 'Recién nacidos', 'Niñas y niños', 'Adolescentes'],
    phone: null, whatsapp: null, license: 'MP 17870 · ME 5056 · ME 12384',
    slug: 'graciela-testa', photo: './assets/images/profesionales/graciela-testa.webp'
  },
  {
    type: 'professional', name: 'Dra. Malvina Signorino', treatment: 'Dra.',
    specialty: 'Endocrinología Pediátrica',
    description: 'Endocrinología pediátrica para el seguimiento del crecimiento, el desarrollo y el sistema endocrino.',
    detail: 'Médica pediatra especialista en endocrinología pediátrica. Acompaña consultas de salud infantil y controles vinculados al crecimiento, desarrollo y sistema endocrino pediátrico.',
    keywords: ['endocrinología pediátrica', 'crecimiento y desarrollo', 'sistema endocrino', 'niños'],
    consultationAreas: ['Endocrinología pediátrica', 'Crecimiento y desarrollo', 'Sistema endocrino pediátrico', 'Niñas y niños'],
    phone: null, whatsapp: null, license: 'MP 28446 · ME 15124 · ME 17798',
    slug: 'malvina-signorino', photo: './assets/images/profesionales/malvina-signorino.webp'
  },
  {
    type: 'professional', name: 'Dra. Paredes Natalia', treatment: 'Dra.',
    specialty: 'Pediatría',
    filterCategories: ['Pediatría'],
    description: 'Pediatría para controles, crecimiento, desarrollo y orientación en salud infantil.',
    detail: 'Atiende pediatría general, controles de niño sano y consultas por enfermedad. También acompaña crecimiento y desarrollo, patologías crónicas pediátricas, nutrición infantil y puericultura.',
    keywords: ['pediatría', 'crecimiento y desarrollo', 'nutrición infantil', 'puericultura'],
    consultationAreas: ['Pediatría', 'Niño sano', 'Crecimiento y desarrollo', 'Patologías crónicas pediátricas', 'Nutrición infantil', 'Puericultura'],
    phone: null, whatsapp: null, license: 'MP 36789',
    slug: 'paredes-natalia', photo: './assets/images/profesionales/paredes-natalia.webp'
  },
  {
    type: 'professional', name: 'Dra. Valeria Gaon', treatment: 'Dra.',
    specialty: 'Endocrinología',
    description: 'Endocrinología de adultos, con consultas presenciales y virtuales confirmadas.',
    detail: 'Especialista en endocrinología de adultos. Atiende consultas presenciales y virtuales para evaluación y seguimiento de condiciones hormonales y metabólicas.',
    keywords: ['endocrinología', 'adultos', 'consultas virtuales'],
    consultationAreas: ['Endocrinología de adultos', 'Trastornos hormonales', 'Seguimiento metabólico'],
    modalities: ['Presencial', 'Virtual'],
    phone: null, whatsapp: null, license: 'MP 22947 · ME 8774',
    slug: 'valeria-gaon', photo: './assets/images/profesionales/valeria-gaon.webp'
  },
  {
    type: 'professional', name: 'Dra. Mariela Álvarez', treatment: 'Dra.',
    specialty: 'Dermatología · Cirugía Dermatológica · Estética Médica Facial',
    description: 'Dermatología integral para adultos, adolescentes y niños, con diagnóstico, prevención y seguimiento de la salud de la piel.',
    detail: 'Médica cirujana especialista en dermatología y estética médica. Atiende a adultos, adolescentes y niños con un abordaje integral de las enfermedades de la piel, el pelo y las uñas. Realiza dermatoscopia, control de lunares, diagnóstico y seguimiento de lesiones cutáneas, cirugía dermatológica y tratamientos de estética médica con un enfoque seguro, personalizado y basado en evidencia científica.',
    keywords: ['dermatología', 'cirugía dermatológica', 'estética médica facial', 'dermatoscopia digital', 'control de lunares', 'lesiones cutáneas'],
    consultationAreas: ['Niños, adolescentes y adultos', 'Dermatología clínica', 'Acné, rosácea y manchas', 'Piel, pelo y uñas', 'Dermatoscopia digital', 'Control de lunares', 'Cirugía dermatológica', 'Botox', 'Rellenos con ácido hialurónico', 'Bioestimuladores', 'Skin care'],
    areasLayout: 'list',
    phone: null, whatsapp: null, license: 'MP 28710 · ME 15917',
    slug: 'mariela-alvarez', photo: './assets/images/profesionales/mariela-alvarez.webp'
  },
  {
    type: 'professional', name: 'Dra. Ana Virginia Corrado', treatment: 'Dra.',
    specialty: 'Dermatología',
    description: 'Dermatología clínica integral y oncológica para distintas etapas de la vida.',
    detail: 'Médica dermatóloga, diplomada en Dermatología Oncológica y docente de la Universidad Católica de Córdoba. Atiende afecciones dermatológicas en adultos, adultos mayores, adolescentes y niños.',
    keywords: ['dermatología', 'dermatología clínica integral', 'dermatología oncológica', 'cirugía dermatológica', 'dermatología pediátrica', 'dermatoscopia'],
    consultationAreas: ['Dermatología Clínica Integral', 'Dermatología Oncológica', 'Cirugía Dermatológica', 'Dermatología Pediátrica', 'Dermatoscopia', 'Dermatología Estética Preventiva y Reparadora', 'Procedimientos terapéuticos del fotodaño'],
    areasLayout: 'list',
    phone: null, whatsapp: null, license: 'MP 28234/3 · ME 14464',
    slug: 'ana-virginia-corrado', photo: './assets/images/profesionales/ana-virginia-corrado.webp'
  },
  {
    type: 'professional', name: 'Dra. Sara Ochoa', treatment: 'Dra.',
    specialty: 'Tocoginecología · Menopausia',
    description: 'Tocoginecología para adolescencia, adultez y etapa de menopausia.',
    detail: 'Especialista en tocoginecología, adolescencia y menopausia. Atiende consultas ginecológicas orientadas a distintas etapas de la salud femenina.',
    keywords: ['ginecología', 'tocoginecología', 'menopausia', 'adolescencia'],
    consultationAreas: ['Tocoginecología', 'Ginecología', 'Adolescencia', 'Menopausia'],
    phone: null, whatsapp: null, license: 'MP 9529 · ME 3247',
    slug: 'sara-ochoa', photo: './assets/images/profesionales/sara-ochoa.webp'
  },
  {
    type: 'professional', name: 'Lic. Maria Julieta Agüero', treatment: 'Lic.',
    specialty: 'Nutrición',
    filterCategories: ['Nutrición'],
    description: 'Nutrición para niños y adultos, orientada a mejorar hábitos alimentarios.',
    detail: 'Licenciada en nutrición. Propone un abordaje integral para mejorar hábitos alimentarios en niños y adultos, con orientación en obesidad y sobrepeso, diabetes, alimentación vegetariana y vegana, nutrición antiinflamatoria y microbiota.',
    keywords: ['nutrición', 'obesidad', 'diabetes', 'microbiota'],
    consultationAreas: ['Nutrición', 'Hábitos alimentarios', 'Obesidad y sobrepeso', 'Diabetes', 'Alimentación vegetariana y vegana', 'Microbiota'],
    phone: null, whatsapp: null, license: 'MP 3132',
    slug: 'julieta-aguero', photo: './assets/images/profesionales/julieta-aguero.webp'
  },
  {
    type: 'professional', name: 'Lic. Mónica Inés Garrone', treatment: 'Lic.',
    specialty: 'Kinesiología y Fisioterapia',
    description: 'Kinesiología y fisioterapia con trabajo en rehabilitación postural.',
    detail: 'Licenciada en kinesiología y fisioterapia. Trabaja en rehabilitación postural global, gimnasia postural y gimnasia correctiva para mejorar función, postura y movimiento.',
    keywords: ['kinesiología', 'fisioterapia', 'rehabilitación postural', 'gimnasia correctiva'],
    consultationAreas: ['Kinesiología', 'Fisioterapia', 'Rehabilitación postural global', 'Gimnasia postural', 'Gimnasia correctiva'],
    phone: null, whatsapp: null, license: 'MP 1379',
    slug: 'monica-garrone', photo: './assets/images/profesionales/monica-garrone.webp'
  },
  {
    type: 'professional', name: 'Dr. Guillermo Ferrero', treatment: 'Dr.',
    specialty: 'Psiquiatría · Psicología',
    description: 'Salud mental para adolescentes, jóvenes y adultos, desde psiquiatría y psicología.',
    detail: 'Médico cirujano, licenciado en psicología y especialista en psiquiatría. Cuenta con trayectoria en salud mental y atiende de manera integral a adolescentes, jóvenes y adultos.',
    keywords: ['psiquiatría', 'psicología', 'salud mental', 'adolescentes'],
    consultationAreas: ['Psiquiatría', 'Psicología', 'Salud mental', 'Adolescentes', 'Jóvenes', 'Adultos'],
    phone: null, whatsapp: null, license: 'MP 18099 · MP 1119 · CE 6238',
    slug: 'guillermo-ferrero', photo: './assets/images/profesionales/guillermo-ferrero.webp'
  },
  {
    type: 'professional', name: 'Dra. Ana E. Ponzo Florimonte', treatment: 'Dra.',
    specialty: 'Psiquiatría · Geriatría',
    description: 'Psiquiatría y geriatría, con consultas presenciales y virtuales confirmadas.',
    detail: 'Especialista en psiquiatría y geriatría. Atiende consultas presenciales y virtuales, con foco en salud mental y acompañamiento clínico de personas mayores.',
    keywords: ['psiquiatría', 'geriatría', 'salud mental', 'adultos mayores'],
    consultationAreas: ['Psiquiatría', 'Geriatría', 'Salud mental', 'Personas mayores'],
    modalities: ['Presencial', 'Virtual'],
    phone: null, whatsapp: null, license: 'MP 34911 · ME 21390 · ME 17554',
    slug: 'ana-ponzo-florimonte', photo: './assets/images/profesionales/ana-ponzo-florimonte.webp'
  },
  {
    type: 'professional', name: 'Lic. Adriana Leticia Vitelli', treatment: 'Lic.',
    specialty: 'Psicología Clínica',
    description: 'Psicología clínica, psicoterapia y psicoanálisis para adolescentes, jóvenes y adultos.',
    detail: 'Licenciada en psicología y especialista en psicología clínica. Trabaja en psicoterapia y psicoanálisis para adolescentes, jóvenes y adultos. También realiza asesoramiento y certificados de apto psicológico, con atención presencial y online.',
    keywords: ['psicología', 'psicoterapia', 'psicoanálisis', 'adolescentes'],
    consultationAreas: ['Psicología clínica', 'Psicoterapia', 'Psicoanálisis', 'Adolescentes', 'Jóvenes', 'Adultos', 'Apto psicológico'],
    modalities: ['Presencial', 'Online'],
    phone: null, whatsapp: 'https://wa.me/5493515487365', license: 'MP 1093 · ME 553',
    slug: 'adriana-vitelli', photo: './assets/images/profesionales/adriana-vitelli.webp'
  },
  {
    type: 'professional', name: 'Lic. María Inés Salto', treatment: 'Lic.',
    specialty: 'Psicoanálisis',
    description: 'Psicoanálisis para adolescentes, jóvenes y adultos.',
    detail: 'Trabaja en psicoanálisis con adolescentes, jóvenes y adultos. Su práctica propone abrir un espacio de palabra para ordenar conflictos, construir una nueva mirada y acompañar procesos personales.',
    keywords: ['psicoanálisis', 'adolescentes', 'jóvenes', 'adultos'],
    consultationAreas: ['Psicoanálisis'],
    phone: null, whatsapp: 'https://wa.me/5493515584625', license: 'MP 13-1129',
    slug: 'maria-ines-salto', photo: './assets/images/profesionales/maria-ines-salto.webp',
    photoAlt: 'Retrato de María Inés Salto, psicoanalista de Médicos de Familia'
  },
  {
    type: 'space',
    name: 'Red Mayor',
    subtitle: 'Espacio de Gerontología',
    description: 'Encuentros y actividades para promover un envejecimiento activo, saludable y con vínculos significativos.',
    detail: 'Red Mayor brinda atención psicológica, orientación familiar, acompañamiento terapéutico, talleres sociorecreativos y capacitaciones para profesionales e instituciones.',
    logo: './assets/images/logos/red-mayor-logo.png',
    services: [
      'Atención psicológica',
      'Orientación familiar',
      'Acompañamiento terapéutico',
      'Talleres sociorecreativos',
      'Capacitaciones'
    ],
    members: [
      { name: 'Natalia Franco', role: 'Lic. en Psicología', license: 'MP 9219', photo: './assets/images/profesionales/red-mayor-natalia-franco.webp' },
      { name: 'María José Trigo', role: 'Lic. en Psicología', license: 'MP 8512', photo: './assets/images/profesionales/red-mayor-maria-jose-trigo.webp' },
      { name: 'Natalia Ledesma', role: 'Lic. en Psicología', license: 'MP 13898', photo: './assets/images/profesionales/red-mayor-natalia-ledesma.webp' },
      { name: 'Carina Quinteros', role: 'Lic. en Acompañamiento Terapéutico', license: 'MP 000002/2023', photo: './assets/images/profesionales/red-mayor-carina-quinteros.webp' }
    ],
    whatsapp: 'https://wa.me/5493515168938',
    slug: 'red-mayor',
    isPending: false
  }
];

const proGrid = document.getElementById('proGrid');
const redMayorFeature = document.getElementById('redMayorFeature');
const filterButtons = document.querySelectorAll('.filter-btn');

const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

const getInitials = (name) => {
  const clean = name.replace(/^(Dr\.|Dra\.|Lic\.|Mg\.)\s+/i, '').trim().split(/\s+/);
  return `${clean[0]?.charAt(0) || ''}${clean[1]?.charAt(0) || ''}`.toUpperCase();
};

const matchesFilter = (pro, filter) => {
  if (pro.isPending) return false;
  if (pro.type === 'space') return false;
  if (filter === 'Todos') return true;

  const normalized = filter.toLowerCase();
  const haystack = [
    pro.specialty,
    pro.cardSpecialty,
    ...(pro.filterCategories || []),
    ...(pro.keywords || []),
    ...(pro.consultationAreas || [])
  ].join(' ').toLowerCase();

  if (normalized === 'ginecología') {
    return ['ginecología', 'tocoginecología'].some((t) => haystack.includes(t));
  }
  if (normalized === 'clínica médica') {
    return ['clínica médica', 'medicina interna'].some((term) => haystack.includes(term));
  }
  if (normalized === 'geriatría') {
    return ['geriatría', 'personas mayores', 'adultos mayores'].some((t) => haystack.includes(t));
  }
  if (normalized === 'nutrición') {
    // Categoría canónica: sólo especialidad/filterCategories, sin keywords ni
    // consultationAreas, para no confundir un área mencionada en la
    // descripción (p. ej. "nutrición infantil" en Pediatría) con la
    // especialidad real del profesional.
    const canonical = [pro.specialty, pro.cardSpecialty, ...(pro.filterCategories || [])].join(' ').toLowerCase();
    return canonical.includes('nutrición');
  }

  return haystack.includes(normalized);
};

const bindProfessionalCards = (scope = document) => {
  scope.querySelectorAll('.pro-card:not(.is-pending), .red-mayor-card').forEach((card) => {
    card.addEventListener('click', () => openProfessionalDialog(card.dataset.slug, card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProfessionalDialog(card.dataset.slug, card);
      }
    });
  });
};

const renderRedMayorFeature = () => {
  if (!redMayorFeature) return;

  const item = professionals.find((pro) => pro.type === 'space' && pro.slug === 'red-mayor');
  if (!item) {
    redMayorFeature.hidden = true;
    return;
  }

  const logoImg = item.logo
    ? `<img src="${escapeHTML(item.logo)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentNode.dataset.fallback='true'" />`
    : '';

  redMayorFeature.hidden = false;
  redMayorFeature.innerHTML = `
    <article id="profesional-${escapeHTML(item.slug)}" class="red-mayor-card" data-slug="${escapeHTML(item.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(item.name)}, ${escapeHTML(item.subtitle || 'Espacio de gerontología')} en Córdoba">
      <div class="red-mayor-main">
        <div class="red-mayor-logo" aria-hidden="true" data-initials="RM">${logoImg}</div>
        <div class="red-mayor-copy">
          <span class="red-mayor-kicker">${escapeHTML(item.name)}</span>
          <h3>${escapeHTML(item.subtitle || 'Espacio de Gerontología')}</h3>
          <p>${escapeHTML(item.description)}</p>
          <div class="red-mayor-services" aria-label="Servicios de Red Mayor">
            ${item.services?.slice(0, 2).map((service) => `<span>${escapeHTML(service)}</span>`).join('') || ''}
          </div>
        </div>
      </div>
      <span class="red-mayor-action" aria-hidden="true">Ver detalle y pedir turno</span>
    </article>
  `;

  bindProfessionalCards(redMayorFeature);
};

const renderProfessionals = (filter = 'Todos') => {
  if (!proGrid) return;

  const filtered = professionals.filter((pro) => matchesFilter(pro, filter));

  if (!filtered.length) {
    proGrid.innerHTML = `
      <div class="pro-empty" role="status">
        No hay profesionales cargados para este filtro por ahora.
      </div>
    `;
    return;
  }

  proGrid.innerHTML = filtered.map((pro, index) => {
    if (pro.type === 'space') {
      const logoImg = pro.logo
        ? `<img src="${escapeHTML(pro.logo)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentNode.dataset.fallback='true'" />`
        : '';

      return `
        <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card is-space" data-specialty="Gerontología" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}, ${escapeHTML(pro.subtitle || 'Espacio de gerontología')} en Córdoba" style="--stagger-index: ${index}">
          <div class="space-avatar" aria-hidden="true" data-initials="RM">${logoImg}</div>
          <div class="pro-content">
            <h3>${escapeHTML(pro.name)}</h3>
            <span class="pro-spec">${escapeHTML(pro.subtitle || 'Espacio especializado')}</span>
            <p class="pro-desc">${escapeHTML(pro.description)}</p>
            <span class="pro-more" aria-hidden="true">Ver detalle y consultar</span>
          </div>
        </article>
      `;
    }

    const visibleSpecialty = pro.cardSpecialty || pro.specialty;
    const photoStyle = pro.photoPosition ? ` style="object-position: ${escapeHTML(pro.photoPosition)}"` : '';
    const avatar = pro.photo
      ? `<img src="${escapeHTML(pro.photo)}" alt="${escapeHTML(pro.photoAlt || `Foto de ${pro.name}`)}" loading="lazy" decoding="async"${photoStyle} />`
      : escapeHTML(getInitials(pro.name));

    if (pro.isPending) {
      return `
        <article class="pro-card is-pending" data-specialty="${escapeHTML(visibleSpecialty)}" style="--stagger-index: ${index}">
          <div class="avatar" aria-hidden="true">${avatar}</div>
          <div class="pro-content">
            <h3>${escapeHTML(pro.name)}</h3>
            <span class="pro-spec">${escapeHTML(visibleSpecialty)}</span>
            <p class="pro-desc">${escapeHTML(pro.description)}</p>
            <span class="pro-more">Pendiente de validación</span>
          </div>
        </article>
      `;
    }

    return `
      <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card" data-specialty="${escapeHTML(visibleSpecialty)}" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}, ${escapeHTML(visibleSpecialty)} en Córdoba" style="--stagger-index: ${index}">
        <div class="avatar" aria-hidden="true">${avatar}</div>
        <div class="pro-content">
          <h3>${escapeHTML(pro.name)}</h3>
          <span class="pro-spec">${escapeHTML(visibleSpecialty)}</span>
          ${pro.license ? `<span class="pro-license">${escapeHTML(getCompactLicense(pro.license))}</span>` : ''}
          ${pro.credential ? `<span class="pro-credential">${escapeHTML(pro.credential)}</span>` : ''}
          <p class="pro-desc">${escapeHTML(pro.description)}</p>
          <span class="pro-more" aria-hidden="true">Ver detalle y pedir turno</span>
        </div>
      </article>
    `;
  }).join('');

  bindProfessionalCards(proGrid);
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    pushDataLayerEvent('specialty_filter', { filter: button.dataset.filter });

    if (prefersReducedMotion || !proGrid) {
      renderProfessionals(button.dataset.filter);
      return;
    }

    window.clearTimeout(filterTimer);
    proGrid.classList.add('is-filtering');
    filterTimer = window.setTimeout(() => {
      renderProfessionals(button.dataset.filter);
      requestAnimationFrame(() => proGrid.classList.remove('is-filtering'));
    }, 170);
  });
});

const getProfessionalBySlug = (slug) => professionals.find((pro) => pro.slug === slug);

const buildWhatsappUrl = (baseUrl, message) => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
};

const getPrimarySpecialty = (specialty = '') => specialty
  .split('·')[0]
  .trim()
  .toLocaleLowerCase('es-AR');

const getCompactLicense = (license = '') => {
  return license.split('·').map((item) => item.trim()).filter(Boolean).join(' · ');
};

const getProfessionalMessageName = (pro) => {
  if (!pro?.name) return '';
  if (/^(Dr\.|Dra\.|Lic\.|Mg\.)\s+/i.test(pro.name)) return pro.name;
  return pro.treatment ? `${pro.treatment} ${pro.name}` : pro.name;
};

const getProfessionalWhatsappUrl = (pro) => {
  if (pro?.type === 'space' && pro?.slug === 'red-mayor') {
    return buildWhatsappUrl(
      pro.whatsapp || CONTACT.whatsappBase,
      'Hola Médicos de Familia, quiero consultar por Red Mayor - Espacio de Gerontología.'
    );
  }

  const specialty = getPrimarySpecialty(pro?.specialty);
  const message = `Hola Médicos de Familia, quiero solicitar un turno con ${getProfessionalMessageName(pro)} por ${specialty}.`;
  return buildWhatsappUrl(pro?.whatsapp || CONTACT.whatsappBase, message);
};

const renderKeywordList = (keywords) => {
  if (!keywords?.length) return '';

  return `
    <div class="keyword-list">
      ${keywords.map((keyword) => `<span>${escapeHTML(keyword)}</span>`).join('')}
    </div>
  `;
};

const renderConsultationAreas = (pro) => {
  const areas = pro?.consultationAreas || pro?.keywords;
  if (!areas?.length) return '';

  if (pro.areasLayout === 'list') {
    return `
      <ul class="consultation-area-list">
        ${areas.map((area) => `<li>${escapeHTML(area)}</li>`).join('')}
      </ul>
    `;
  }

  return renderKeywordList(areas);
};

const renderSpaceServices = (services) => {
  if (!services?.length) return '';

  return `
    <section class="space-section" aria-labelledby="space-services-title">
      <h3 id="space-services-title">Áreas de acompañamiento</h3>
      <div class="space-services">
        ${services.map((service) => `<span class="space-service-chip">${escapeHTML(service)}</span>`).join('')}
      </div>
    </section>
  `;
};

const renderSpaceMembers = (members) => {
  if (!members?.length) return '';

  return `
    <section class="space-section" aria-labelledby="space-members-title">
      <h3 id="space-members-title">Equipo</h3>
      <div class="space-members">
        ${members.map((member) => `
          <article class="space-member-card">
            ${member.photo ? `<img src="${escapeHTML(member.photo)}" alt="Foto de ${escapeHTML(member.name)}" loading="lazy" decoding="async" />` : ''}
            <span>
              <strong class="space-member-name">${escapeHTML(member.name)}</strong>
              <span class="space-member-role">${escapeHTML(member.role)}</span>
              <span class="space-member-license">${escapeHTML(member.license)}</span>
            </span>
          </article>
        `).join('')}
      </div>
    </section>
  `;
};

const renderProfessionalDialog = (pro) => {
  const contactUrl = getProfessionalWhatsappUrl(pro);

  if (pro.type === 'space') {
    const logoImg = pro.logo
      ? `<img src="${escapeHTML(pro.logo)}" alt="Logo ${escapeHTML(pro.name)}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentNode.dataset.fallback='true'" />`
      : '';

    professionalDialogContent.innerHTML = `
      <div class="professional-scroll">
        <div class="professional-hero space-hero">
          <div class="professional-identity">
            <div class="space-dialog-logo" aria-hidden="true" data-initials="RM">${logoImg}</div>
            <div>
              <span class="professional-kicker">${escapeHTML(pro.name)}</span>
              <h2 id="professionalDialogTitle">${escapeHTML(pro.subtitle || 'Espacio de Gerontología')}</h2>
              <span class="professional-specialty">Acompañamiento para personas mayores, familias e instituciones.</span>
            </div>
          </div>
          <p class="professional-description" id="professionalDialogDescription">${escapeHTML(pro.detail || pro.description)}</p>
        </div>

        ${renderSpaceMembers(pro.members)}
        ${renderSpaceServices(pro.services)}

        ${pro.isPending ? `
          <p class="professional-note">
            Información del espacio en proceso de validación final. Los datos definitivos del equipo se incorporarán próximamente.
          </p>
        ` : ''}
      </div>

      <div class="professional-actions professional-actions-sticky">
        <a class="btn btn-primary btn-whatsapp" href="${escapeHTML(contactUrl)}" target="_blank" rel="noopener">Consultar por Red Mayor</a>
        <a class="btn btn-secondary" href="tel:+543514214225">Llamar al centro</a>
      </div>
    `;
    return;
  }

  const portrait = pro.photo
    ? `<img src="${escapeHTML(pro.photo)}" alt="${escapeHTML(pro.photoAlt || `Foto de ${pro.name}`)}" loading="lazy" decoding="async"${pro.photoPosition ? ` style="object-position: ${escapeHTML(pro.photoPosition)}"` : ''} />`
    : escapeHTML(getInitials(pro.name));

  professionalDialogContent.innerHTML = `
    <div class="professional-scroll">
      <div class="professional-hero">
        <div class="professional-identity">
          <div class="professional-avatar" aria-hidden="${pro.photo ? 'false' : 'true'}">${portrait}</div>
          <div>
            <span class="professional-kicker">${pro.isPending ? 'Pendiente' : 'Profesional del centro'}</span>
            <h2 id="professionalDialogTitle">${escapeHTML(pro.name)}</h2>
            <span class="professional-specialty">${escapeHTML(pro.specialty)}</span>
          </div>
        </div>
        <p class="professional-description" id="professionalDialogDescription">${escapeHTML(pro.detail || pro.description)}</p>
      </div>

      <dl class="professional-meta">
        <div class="professional-meta-row">
          <dt>Especialidad</dt>
          <dd>${escapeHTML(pro.specialty)}</dd>
        </div>
        ${pro.license ? `<div class="professional-meta-row">
          <dt>Matrículas</dt>
          <dd>${escapeHTML(pro.license)}</dd>
        </div>` : ''}
        ${pro.credential ? `<div class="professional-meta-row">
          <dt>Formación adicional</dt>
          <dd>${escapeHTML(pro.credential)}</dd>
        </div>` : ''}
        ${pro.modalities?.length ? `<div class="professional-meta-row">
          <dt>Modalidad</dt>
          <dd>${escapeHTML(pro.modalities.join(' · '))}</dd>
        </div>` : ''}
        ${pro.consultationAreas?.length || pro.keywords?.length ? `
          <div class="professional-meta-row">
            <dt>Áreas de consulta</dt>
            <dd>${renderConsultationAreas(pro)}</dd>
          </div>
        ` : ''}
      </dl>
    </div>

    <div class="professional-actions professional-actions-sticky">
      <a class="btn btn-primary btn-whatsapp" href="${escapeHTML(contactUrl)}" target="_blank" rel="noopener">Pedir turno por WhatsApp</a>
      <a class="btn btn-secondary" href="tel:+543514214225">Llamar al centro</a>
    </div>
  `;
};

const setProfessionalTriggersExpanded = (expanded, trigger = null) => {
  document.querySelectorAll('.pro-card[aria-expanded="true"], .red-mayor-card[aria-expanded="true"]').forEach((card) => {
    card.setAttribute('aria-expanded', 'false');
  });

  if (trigger && expanded) {
    trigger.setAttribute('aria-expanded', 'true');
  }
};

const getDialogFocusable = () => professionalDialog
  ? [...professionalDialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  : [];

const openProfessionalDialog = (slug, trigger) => {
  const pro = getProfessionalBySlug(slug);
  if (!pro || !professionalDialog || !professionalDialogContent) return;

  window.clearTimeout(closeDialogTimer);
  lastProfessionalTrigger = trigger;
  renderProfessionalDialog(pro);
  pushDataLayerEvent('professional_view', {
    professional_slug: pro.slug,
    professional_name: pro.name,
    professional_type: pro.type
  });
  professionalDialog.classList.remove('is-closing');
  professionalDialog.hidden = false;
  professionalDialog.setAttribute('aria-hidden', 'false');
  document.body.classList.add('professional-open');
  pageChrome.forEach((element) => {
    element.inert = true;
  });
  setProfessionalTriggersExpanded(true, trigger);

  const closeButton = professionalDialog.querySelector('.professional-close');
  requestAnimationFrame(() => {
    professionalDialog.classList.add('is-open');
    closeButton?.focus();
  });
};

const closeProfessionalDialog = () => {
  if (!professionalDialog || professionalDialog.hidden) return;

  professionalDialog.classList.remove('is-open');
  professionalDialog.classList.add('is-closing');
  setProfessionalTriggersExpanded(false);

  closeDialogTimer = window.setTimeout(() => {
    professionalDialog.hidden = true;
    professionalDialog.setAttribute('aria-hidden', 'true');
    professionalDialog.classList.remove('is-closing');
    document.body.classList.remove('professional-open');
    pageChrome.forEach((element) => {
      element.inert = false;
    });

    if (lastProfessionalTrigger?.isConnected) {
      lastProfessionalTrigger.focus();
    }
    lastProfessionalTrigger = null;
  }, dialogMotionMs);
};

if (professionalDialog) {
  professionalDialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-dialog-close]')) closeProfessionalDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (professionalDialog.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeProfessionalDialog();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getDialogFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

renderRedMayorFeature();
renderProfessionals();

const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Safety net: if an observer callback never fires for some element (edge
// case, not the expected path), don't leave content permanently hidden.
window.setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach((element) => {
    element.classList.add('visible');
  });
}, 2500);

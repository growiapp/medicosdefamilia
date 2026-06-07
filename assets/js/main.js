const CONTACT = Object.freeze({
  whatsappUrl: 'https://wa.me/543513199546?text=Hola%20M%C3%A9dicos%20de%20Familia%2C%20quiero%20hacer%20una%20consulta%20o%20coordinar%20un%20turno.',
  phoneUrl: 'tel:+543514214225',
  mapsUrl: 'https://www.google.com/maps?q=27+de+abril+1254+C%C3%B3rdoba+Argentina+5000'
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
const dialogMotionMs = prefersReducedMotion ? 0 : 420;

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
  // ── Clínica Médica / Medicina Interna ──────────────────────────────────────
  {
    type: 'professional', name: 'Dr. Carlos Presman', treatment: 'Dr.',
    specialty: 'Clínica Médica · Terapia Intensiva',
    description: 'Médico clínico de adultos y adultos mayores. Especialista en Medicina Interna y Terapia Intensiva.',
    keywords: ['clínica médica', 'medicina interna', 'terapia intensiva', 'adultos mayores'],
    phone: null, whatsapp: null, license: 'MP 17871 · MP 5130 · MP 9125',
    slug: 'carlos-presman', photo: null
  },
  {
    type: 'professional', name: 'Dr. Guillermo Calvo Hidalgo', treatment: 'Dr.',
    specialty: 'Cardiología · Clínica Médica',
    description: 'Especialista en Cardiología y Clínica Médica.',
    keywords: ['cardiología', 'clínica médica', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 24172 · CE 8341 · CE 13122',
    slug: 'guillermo-calvo-hidalgo', photo: null
  },
  {
    type: 'professional', name: 'Dra. Juana A. Presman', treatment: 'Dra.',
    specialty: 'Medicina Interna · Adolescencia',
    description: 'Medicina interna con enfoque en adolescentes. Atención especializada de desórdenes alimentarios.',
    keywords: ['medicina interna', 'adolescentes', 'desórdenes alimentarios'],
    phone: null, whatsapp: null, license: 'MP 13353 · ME 4328',
    slug: 'juana-presman', photo: null
  },
  {
    type: 'professional', name: 'Julio César Guerini', treatment: null,
    specialty: 'Medicina Interna · Medicina del Trabajo · Medicina Legal',
    description: 'Especialista en Medicina Interna, Medicina Legal y Medicina del Trabajo.',
    keywords: ['medicina interna', 'medicina laboral', 'medicina legal'],
    phone: null, whatsapp: null, license: 'MP 36.996 · MN 157187 · CE 18.660 · CE 19.577 · CE 22.157',
    slug: 'julio-guerini', photo: null
  },
  // ── Pediatría ──────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dr. Marcelo H. Argüello', treatment: 'Dr.',
    specialty: 'Pediatría · Emergentología Pediátrica',
    description: 'Pediatra y emergentologo pediátrico. Atención integral y urgencias pediátricas.',
    keywords: ['pediatría', 'emergentología', 'urgencias pediátricas', 'niños'],
    phone: null, whatsapp: null, license: 'MP 20281 · MN 121953 · ME 6827 · ME 14369',
    slug: 'marcelo-arguello', photo: null
  },
  {
    type: 'professional', name: 'Dra. Graciela Testa', treatment: 'Dra.',
    specialty: 'Pediatría · Endocrinología Pediátrica',
    description: 'Pediatra y especialista en endocrinología infanto-juvenil.',
    keywords: ['pediatría', 'endocrinología pediátrica', 'niños', 'adolescentes'],
    phone: null, whatsapp: null, license: 'MP 17870 · ME 5056 · ME 12384',
    slug: 'graciela-testa', photo: null
  },
  {
    type: 'professional', name: 'Dra. Malvina Signorino', treatment: 'Dra.',
    specialty: 'Pediatría · Endocrinología Pediátrica',
    description: 'Pediatra y especialista en endocrinología pediátrica.',
    keywords: ['pediatría', 'endocrinología pediátrica', 'niños'],
    phone: null, whatsapp: null, license: 'MP 28446 · ME 15124 · ME 17798',
    slug: 'malvina-signorino', photo: null
  },
  // ── Endocrinología ─────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Valeria Gaon', treatment: 'Dra.',
    specialty: 'Endocrinología',
    description: 'Especialista en endocrinología de adultos. Consultas presenciales y virtuales.',
    keywords: ['endocrinología', 'diabetes', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 22947 · ME 8774',
    slug: 'valeria-gaon', photo: null
  },
  // ── Dermatología ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Natalia Paredes', treatment: 'Dra.',
    specialty: 'Dermatología y Estética Médica',
    description: 'Dermatología integral para adultos y niños. Dermatoscopia y control de lunares. Tratamientos estéticos: botox, ácido hialurónico y bioestimuladores.',
    keywords: ['dermatología', 'estética médica', 'lunares', 'dermatoscopia'],
    phone: null, whatsapp: null, license: 'MP 28710 · MP 15917',
    slug: 'natalia-paredes', photo: null
  },
  {
    type: 'professional', name: 'Dra. Ana Virginia Corrado', treatment: 'Dra.',
    specialty: 'Dermatología',
    description: 'Médica dermatóloga. Diplomada en dermatología oncológica. Docente de la UCC.',
    keywords: ['dermatología', 'oncología cutánea', 'piel'],
    phone: null, whatsapp: null, license: 'MP 28234/3 · ME 14464',
    slug: 'ana-virginia-corrado', photo: null
  },
  // ── Ginecología ────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Sara Ochoa', treatment: 'Dra.',
    specialty: 'Tocoginecología · Menopausia',
    description: 'Especialista en tocoginecología y atención en adolescencia. Experta en menopausia.',
    keywords: ['ginecología', 'tocoginecología', 'menopausia', 'adolescentes'],
    phone: null, whatsapp: null, license: 'MP 9529 · ME 3247',
    slug: 'sara-ochoa', photo: null
  },
  // ── Nutrición ──────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Lic. Julieta Agüero', treatment: 'Lic.',
    specialty: 'Nutrición',
    description: 'Nutricionista. Especialista en obesidad, diabetes, alimentación vegetariana y vegana, nutrición antiinflamatoria y microbiota. Atención de niños y adultos.',
    keywords: ['nutrición', 'obesidad', 'diabetes', 'alimentación vegetariana', 'microbiota'],
    phone: null, whatsapp: null, license: 'MP 3132',
    slug: 'julieta-aguero', photo: null
  },
  // ── Kinesiología ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Lic. Mónica Inés Garrone', treatment: 'Lic.',
    specialty: 'Kinesiología y Fisioterapia',
    description: 'Kinesióloga. Rehabilitación postural global, gimnasia postural y correctiva.',
    keywords: ['kinesiología', 'fisioterapia', 'rehabilitación', 'postura'],
    phone: null, whatsapp: null, license: 'MP 1379',
    slug: 'monica-garrone', photo: null
  },
  // ── Salud Mental ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dr. Guillermo Ferrero', treatment: 'Dr.',
    specialty: 'Psiquiatría',
    description: 'Médico y psicólogo. Especialista en psiquiatría. Atención integral de adolescentes, jóvenes y adultos.',
    keywords: ['psiquiatría', 'salud mental', 'adolescentes', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 18099 · MP 1119 · CE 6238',
    slug: 'guillermo-ferrero', photo: null
  },
  {
    type: 'professional', name: 'Dra. Ana E. Ponzo Florimonte', treatment: 'Dra.',
    specialty: 'Psiquiatría · Geriatría',
    description: 'Especialista en psiquiatría y geriatría. Consultas presenciales y virtuales.',
    keywords: ['psiquiatría', 'geriatría', 'salud mental', 'adultos mayores'],
    phone: null, whatsapp: null, license: 'MP 34911 · ME 21390 · ME 17554',
    slug: 'ana-ponzo-florimonte', photo: null
  },
  {
    type: 'professional', name: 'Lic. Adriana Leticia Vitelli', treatment: 'Lic.',
    specialty: 'Psicología Clínica',
    description: 'Psicoterapia y psicoanálisis. Atención de adolescentes, jóvenes y adultos. Certificados de Apto Psicológico. Presencial y online.',
    keywords: ['psicología', 'psicoterapia', 'psicoanálisis', 'adolescentes', 'adultos'],
    phone: null, whatsapp: 'https://wa.me/5493515487365', license: 'MP 1093 · ME 553',
    slug: 'adriana-vitelli', photo: null
  },
  {
    type: 'professional', name: 'Lic. María Inés Salto', treatment: 'Lic.',
    specialty: 'Psicopedagogía · Psicoanálisis',
    description: 'Psicopedagogía y psicoanálisis. Atención de adolescentes, jóvenes y adultos.',
    keywords: ['psicopedagogía', 'psicoanálisis', 'adolescentes', 'adultos'],
    phone: null, whatsapp: 'https://wa.me/5493515584625', license: 'MP 13-1129',
    slug: 'maria-ines-salto', photo: null
  },
  // ── Pediatría (pendiente de confirmación de nombre) ────────────────────────
  {
    type: 'professional', name: 'Profesional en incorporación', treatment: 'Dra.',
    specialty: 'Pediatría',
    description: 'Atención a niño sano y enfermo. Crecimiento y desarrollo. Patologías crónicas pediátricas, nutrición infantil y puericultura.',
    keywords: ['pediatría', 'niños', 'puericultura'],
    phone: null, whatsapp: null, license: 'MP 36789',
    slug: 'pediatra-incorporacion', photo: null, isPending: true
  },
  // ── Gerontología (Espacio) ─────────────────────────────────────────────────
  {
    type: 'space',
    name: 'Red Mayor',
    subtitle: 'Espacio de Gerontología',
    description: 'Profesionales con formación y experiencia en la atención de personas mayores. Brindamos atención psicológica, orientación familiar, acompañamiento terapéutico, talleres sociorecreativos y capacitaciones.',
    logo: './assets/images/logos/red-mayor-logo.png',
    members: [
      'Natalia Franco — MP 9219 · Lic. en Psicología',
      'María José Trigo — MP 8512 · Lic. en Psicología',
      'Natalia Ledesma — MP 13898 · Lic. en Psicología',
      'Carina Quinteros — MP 2/2023 · Lic. en Acompañamiento Terapéutico'
    ],
    whatsapp: null,
    slug: 'red-mayor',
    isPending: false
  }
];

const proGrid = document.getElementById('proGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

const getInitials = (name) => {
  if (name.toLowerCase().includes('pendiente') || name.toLowerCase().includes('incorporación')) return 'PV';

  const clean = name.replace(/^(Dr\.|Dra\.|Lic\.|Mg\.)\s+/i, '').trim().split(/\s+/);
  return `${clean[0]?.charAt(0) || ''}${clean[1]?.charAt(0) || ''}`.toUpperCase();
};

const matchesFilter = (pro, filter) => {
  if (filter === 'Todos') return true;
  if (pro.type === 'space') return false;
  if (pro.isPending) return false;

  const specialty = pro.specialty.toLowerCase();
  const normalized = filter.toLowerCase();

  if (normalized === 'clínica') {
    return ['clínica', 'medicina interna', 'cardiología'].some((t) => specialty.includes(t));
  }
  if (normalized === 'salud mental') {
    return ['psicología', 'psiquiatría', 'psicopedagogía', 'psicoanálisis'].some((t) => specialty.includes(t));
  }
  if (normalized === 'ginecología') {
    return ['ginecología', 'tocoginecología'].some((t) => specialty.includes(t));
  }

  return specialty.includes(normalized);
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
        <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card is-space" data-specialty="Gerontología" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}" style="--stagger-index: ${index}">
          <div class="space-avatar" aria-hidden="true" data-initials="RM">${logoImg}</div>
          <div class="pro-content">
            <h3>${escapeHTML(pro.name)}</h3>
            <span class="pro-spec">${escapeHTML(pro.subtitle || 'Espacio especializado')}</span>
            <p class="pro-desc">${escapeHTML(pro.description)}</p>
            <span class="pro-more" aria-hidden="true">Ver información <span>→</span></span>
          </div>
        </article>
      `;
    }

    const avatar = pro.photo
      ? `<img src="${escapeHTML(pro.photo)}" alt="Foto de ${escapeHTML(pro.name)}" loading="lazy" decoding="async" />`
      : escapeHTML(getInitials(pro.name));

    if (pro.isPending) {
      return `
        <article class="pro-card is-pending" data-specialty="${escapeHTML(pro.specialty)}" style="--stagger-index: ${index}">
          <div class="avatar" aria-hidden="true">${avatar}</div>
          <div class="pro-content">
            <h3>${escapeHTML(pro.name)}</h3>
            <span class="pro-spec">${escapeHTML(pro.specialty)}</span>
            <p class="pro-desc">${escapeHTML(pro.description)}</p>
            <span class="pro-more">Pendiente de validación</span>
          </div>
        </article>
      `;
    }

    return `
      <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card" data-specialty="${escapeHTML(pro.specialty)}" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}" style="--stagger-index: ${index}">
        <div class="avatar" aria-hidden="true">${avatar}</div>
        <div class="pro-content">
          <h3>${escapeHTML(pro.name)}</h3>
          <span class="pro-spec">${escapeHTML(pro.specialty)}</span>
          <p class="pro-desc">${escapeHTML(pro.description)}</p>
          <span class="pro-more" aria-hidden="true">Ver información <span>→</span></span>
        </div>
      </article>
    `;
  }).join('');

  proGrid.querySelectorAll('.pro-card:not(.is-pending)').forEach((card) => {
    card.addEventListener('click', () => openProfessionalDialog(card.dataset.slug, card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProfessionalDialog(card.dataset.slug, card);
      }
    });
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');

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

const getContactUrl = (pro) => {
  if (pro?.whatsapp) return pro.whatsapp;
  if (pro?.type === 'space' && pro?.slug === 'red-mayor') {
    return 'https://wa.me/543513199546?text=Hola%20M%C3%A9dicos%20de%20Familia%2C%20quisiera%20consultar%20por%20Red%20Mayor.';
  }
  return CONTACT.whatsappUrl;
};

const renderKeywordList = (keywords) => {
  if (!keywords?.length) return '';

  return `
    <div class="keyword-list">
      ${keywords.map((keyword) => `<span>${escapeHTML(keyword)}</span>`).join('')}
    </div>
  `;
};

const renderProfessionalDialog = (pro) => {
  const contactUrl = getContactUrl(pro);

  if (pro.type === 'space') {
    const logoImg = pro.logo
      ? `<img src="${escapeHTML(pro.logo)}" alt="Logo ${escapeHTML(pro.name)}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentNode.dataset.fallback='true'" />`
      : '';

    professionalDialogContent.innerHTML = `
      <div class="professional-hero space-hero">
        <div class="space-dialog-logo" aria-hidden="true" data-initials="RM">${logoImg}</div>
        <div>
          <span class="professional-kicker">Espacio de atención especializada</span>
          <h2 id="professionalDialogTitle">${escapeHTML(pro.name)}</h2>
        </div>
        <span class="professional-specialty">${escapeHTML(pro.subtitle || '')}</span>
        <p class="professional-description" id="professionalDialogDescription">${escapeHTML(pro.description)}</p>
      </div>

      ${pro.members?.length ? `
        <dl class="professional-meta">
          <div class="professional-meta-row">
            <dt>Equipo</dt>
            <dd>${pro.members.map((m) => escapeHTML(m)).join(', ')}</dd>
          </div>
        </dl>
      ` : ''}

      ${pro.isPending ? `
        <p class="professional-note">
          Información del espacio en proceso de validación final. Los datos definitivos del equipo se incorporarán próximamente.
        </p>
      ` : ''}

      <div class="professional-actions">
        <a class="btn btn-whatsapp" href="${escapeHTML(contactUrl)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        <a class="btn btn-light" href="tel:+543514214225">Llamar al centro</a>
      </div>
    `;
    return;
  }

  const hasCurricularInfo = Boolean(pro.license || pro.phone || pro.whatsapp);

  professionalDialogContent.innerHTML = `
    <div class="professional-hero">
      <div class="professional-avatar" aria-hidden="true">${escapeHTML(getInitials(pro.name))}</div>
      <div>
        <span class="professional-kicker">${pro.isPending ? 'Pendiente' : 'Profesional del centro'}</span>
        <h2 id="professionalDialogTitle">${escapeHTML(pro.name)}</h2>
      </div>
      <span class="professional-specialty">${escapeHTML(pro.specialty)}</span>
      <p class="professional-description" id="professionalDialogDescription">${escapeHTML(pro.description)}</p>
    </div>

    <dl class="professional-meta">
      <div class="professional-meta-row">
        <dt>Área</dt>
        <dd>${escapeHTML(pro.specialty)}</dd>
      </div>
      ${pro.license ? `
        <div class="professional-meta-row">
          <dt>Matrícula</dt>
          <dd>${escapeHTML(pro.license)}</dd>
        </div>
      ` : ''}
      ${pro.phone ? `
        <div class="professional-meta-row">
          <dt>Teléfono</dt>
          <dd><a href="${escapeHTML(pro.phone)}">Contacto individual</a></dd>
        </div>
      ` : ''}
      ${pro.keywords?.length ? `
        <div class="professional-meta-row">
          <dt>Temas</dt>
          <dd>${renderKeywordList(pro.keywords)}</dd>
        </div>
      ` : ''}
    </dl>

    ${hasCurricularInfo ? '' : '<p class="professional-note">Matrícula y minicurrículum se incorporarán cuando el centro valide la información final.</p>'}

    <div class="professional-actions">
      <a class="btn btn-whatsapp" href="${escapeHTML(contactUrl)}" target="_blank" rel="noopener">Consultar turno por WhatsApp</a>
      <a class="btn btn-light" href="tel:+543514214225">Llamar al centro</a>
    </div>
  `;
};

const setProfessionalTriggersExpanded = (expanded, trigger = null) => {
  document.querySelectorAll('.pro-card[aria-expanded="true"]').forEach((card) => {
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

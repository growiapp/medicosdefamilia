const CONTACT = Object.freeze({
  whatsappBase: 'https://wa.me/543513199546',
  whatsappUrl: 'https://wa.me/543513199546?text=Hola%20M%C3%A9dicos%20de%20Familia%2C%20quiero%20hacer%20una%20consulta%20o%20coordinar%20un%20turno.',
  phoneUrl: 'tel:+543514214225',
  mapsUrl: 'https://maps.app.goo.gl/eV1vY4MmGpJ5j6Mh9'
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
    description: 'Atiende adultos y personas mayores desde clínica médica, medicina interna y terapia intensiva.',
    keywords: ['clínica médica', 'medicina interna', 'terapia intensiva', 'adultos mayores'],
    phone: null, whatsapp: null, license: 'MP 17871 · MP 5130 · MP 9125',
    slug: 'carlos-presman', photo: null
  },
  {
    type: 'professional', name: 'Dr. Guillermo Calvo Hidalgo', treatment: 'Dr.',
    specialty: 'Cardiología · Clínica Médica',
    description: 'Atiende consultas de cardiología y clínica médica para adultos.',
    keywords: ['cardiología', 'clínica médica', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 24172 · CE 8341 · CE 13122',
    slug: 'guillermo-calvo-hidalgo', photo: null
  },
  {
    type: 'professional', name: 'Dra. Juana A. Presman', treatment: 'Dra.',
    specialty: 'Medicina Interna · Adolescencia',
    description: 'Atiende adolescentes desde medicina interna, con experiencia en desórdenes alimentarios.',
    keywords: ['medicina interna', 'adolescentes', 'desórdenes alimentarios'],
    phone: null, whatsapp: null, license: 'MP 13353 · ME 4328',
    slug: 'juana-presman', photo: null
  },
  {
    type: 'professional', name: 'Julio César Guerini', treatment: null,
    specialty: 'Medicina Interna · Medicina del Trabajo · Medicina Legal',
    description: 'Atiende consultas de medicina interna, medicina laboral y medicina legal.',
    keywords: ['medicina interna', 'medicina laboral', 'medicina legal'],
    phone: null, whatsapp: null, license: 'MP 36.996 · MN 157187 · CE 18.660 · CE 19.577 · CE 22.157',
    slug: 'julio-guerini', photo: null
  },
  // ── Pediatría ──────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dr. Marcelo H. Argüello', treatment: 'Dr.',
    specialty: 'Pediatría · Emergentología Pediátrica',
    description: 'Atiende controles pediátricos, consultas de salud infantil y urgencias pediátricas.',
    keywords: ['pediatría', 'emergentología', 'urgencias pediátricas', 'niños'],
    phone: null, whatsapp: null, license: 'MP 20281 · MN 121953 · ME 6827 · ME 14369',
    slug: 'marcelo-arguello', photo: null
  },
  {
    type: 'professional', name: 'Dra. Graciela Testa', treatment: 'Dra.',
    specialty: 'Pediatría · Endocrinología Pediátrica',
    description: 'Atiende pediatría y endocrinología infanto-juvenil para niñas, niños y adolescentes.',
    keywords: ['pediatría', 'endocrinología pediátrica', 'niños', 'adolescentes'],
    phone: null, whatsapp: null, license: 'MP 17870 · ME 5056 · ME 12384',
    slug: 'graciela-testa', photo: null
  },
  {
    type: 'professional', name: 'Dra. Malvina Signorino', treatment: 'Dra.',
    specialty: 'Pediatría · Endocrinología Pediátrica',
    description: 'Atiende consultas pediátricas y endocrinología pediátrica.',
    keywords: ['pediatría', 'endocrinología pediátrica', 'niños'],
    phone: null, whatsapp: null, license: 'MP 28446 · ME 15124 · ME 17798',
    slug: 'malvina-signorino', photo: null
  },
  // ── Endocrinología ─────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Valeria Gaon', treatment: 'Dra.',
    specialty: 'Endocrinología',
    description: 'Atiende endocrinología de adultos, con consultas presenciales y virtuales.',
    keywords: ['endocrinología', 'diabetes', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 22947 · ME 8774',
    slug: 'valeria-gaon', photo: null
  },
  // ── Dermatología ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Natalia Paredes', treatment: 'Dra.',
    specialty: 'Dermatología y Estética Médica',
    description: 'Atiende dermatología de adultos y niños, dermatoscopia, control de lunares y estética médica.',
    keywords: ['dermatología', 'estética médica', 'lunares', 'dermatoscopia'],
    phone: null, whatsapp: null, license: 'MP 28710 · MP 15917',
    slug: 'natalia-paredes', photo: null
  },
  {
    type: 'professional', name: 'Dra. Ana Virginia Corrado', treatment: 'Dra.',
    specialty: 'Dermatología',
    description: 'Atiende dermatología clínica y consultas vinculadas a dermatología oncológica.',
    keywords: ['dermatología', 'oncología cutánea', 'piel'],
    phone: null, whatsapp: null, license: 'MP 28234/3 · ME 14464',
    slug: 'ana-virginia-corrado', photo: null
  },
  // ── Ginecología ────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dra. Sara Ochoa', treatment: 'Dra.',
    specialty: 'Tocoginecología · Menopausia',
    description: 'Atiende tocoginecología en adolescencia, adultez y menopausia.',
    keywords: ['ginecología', 'tocoginecología', 'menopausia', 'adolescentes'],
    phone: null, whatsapp: null, license: 'MP 9529 · ME 3247',
    slug: 'sara-ochoa', photo: null
  },
  // ── Nutrición ──────────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Lic. Julieta Agüero', treatment: 'Lic.',
    specialty: 'Nutrición',
    description: 'Atiende nutrición de niños y adultos: obesidad, diabetes, alimentación vegetariana, microbiota y nutrición antiinflamatoria.',
    keywords: ['nutrición', 'obesidad', 'diabetes', 'alimentación vegetariana', 'microbiota'],
    phone: null, whatsapp: null, license: 'MP 3132',
    slug: 'julieta-aguero', photo: null
  },
  // ── Kinesiología ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Lic. Mónica Inés Garrone', treatment: 'Lic.',
    specialty: 'Kinesiología y Fisioterapia',
    description: 'Atiende kinesiología, fisioterapia, rehabilitación postural global y gimnasia correctiva.',
    keywords: ['kinesiología', 'fisioterapia', 'rehabilitación', 'postura'],
    phone: null, whatsapp: null, license: 'MP 1379',
    slug: 'monica-garrone', photo: null
  },
  // ── Salud Mental ───────────────────────────────────────────────────────────
  {
    type: 'professional', name: 'Dr. Guillermo Ferrero', treatment: 'Dr.',
    specialty: 'Psiquiatría',
    description: 'Atiende psiquiatría y salud mental para adolescentes, jóvenes y adultos.',
    keywords: ['psiquiatría', 'salud mental', 'adolescentes', 'adultos'],
    phone: null, whatsapp: null, license: 'MP 18099 · MP 1119 · CE 6238',
    slug: 'guillermo-ferrero', photo: null
  },
  {
    type: 'professional', name: 'Dra. Ana E. Ponzo Florimonte', treatment: 'Dra.',
    specialty: 'Psiquiatría · Geriatría',
    description: 'Atiende psiquiatría y geriatría, con consultas presenciales y virtuales.',
    keywords: ['psiquiatría', 'geriatría', 'salud mental', 'adultos mayores'],
    phone: null, whatsapp: null, license: 'MP 34911 · ME 21390 · ME 17554',
    slug: 'ana-ponzo-florimonte', photo: null
  },
  {
    type: 'professional', name: 'Lic. Adriana Leticia Vitelli', treatment: 'Lic.',
    specialty: 'Psicología Clínica',
    description: 'Atiende psicoterapia y psicoanálisis para adolescentes, jóvenes y adultos. Presencial y online.',
    keywords: ['psicología', 'psicoterapia', 'psicoanálisis', 'adolescentes', 'adultos'],
    phone: null, whatsapp: 'https://wa.me/5493515487365', license: 'MP 1093 · ME 553',
    slug: 'adriana-vitelli', photo: null
  },
  {
    type: 'professional', name: 'Lic. María Inés Salto', treatment: 'Lic.',
    specialty: 'Psicopedagogía · Psicoanálisis',
    description: 'Atiende psicopedagogía y psicoanálisis para adolescentes, jóvenes y adultos.',
    keywords: ['psicopedagogía', 'psicoanálisis', 'adolescentes', 'adultos'],
    phone: null, whatsapp: 'https://wa.me/5493515584625', license: 'MP 13-1129',
    slug: 'maria-ines-salto', photo: null
  },
  // ── Gerontología (Espacio) ─────────────────────────────────────────────────
  {
    type: 'space',
    name: 'Red Mayor',
    subtitle: 'Espacio de Gerontología',
    description: 'Espacio de gerontología para personas mayores, familias e instituciones, con orientación psicológica, acompañamiento terapéutico, talleres y capacitaciones.',
    logo: './assets/images/logos/red-mayor-logo.png',
    services: [
      'Atención psicológica',
      'Orientación familiar',
      'Acompañamiento terapéutico',
      'Talleres sociorecreativos',
      'Capacitaciones'
    ],
    members: [
      { name: 'Natalia Franco', role: 'Lic. en Psicología', license: 'MP 9219' },
      { name: 'María José Trigo', role: 'Lic. en Psicología', license: 'MP 8512' },
      { name: 'Natalia Ledesma', role: 'Lic. en Psicología', license: 'MP 13898' },
      { name: 'Carina Quinteros', role: 'Lic. en Acompañamiento Terapéutico', license: 'MP 2/2023' }
    ],
    whatsapp: null,
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

const renderCardKeywords = (keywords) => {
  if (!keywords?.length) return '';
  return `
    <div class="pro-keywords" aria-label="Consultas que atiende">
      ${keywords.slice(0, 3).map((keyword) => `<span>${escapeHTML(keyword)}</span>`).join('')}
    </div>
  `;
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
          <span class="red-mayor-kicker">Espacio de gerontología en Córdoba</span>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <div class="red-mayor-services" aria-label="Áreas de acompañamiento de Red Mayor">
            ${item.services?.slice(0, 5).map((service) => `<span>${escapeHTML(service)}</span>`).join('') || ''}
          </div>
        </div>
      </div>
      ${item.members?.length ? `
        <div class="red-mayor-team-list" aria-label="Equipo de Red Mayor">
          ${item.members.map((member) => `
            <span><strong>${escapeHTML(member.name)}</strong> ${escapeHTML(member.role)} · ${escapeHTML(member.license)}</span>
          `).join('')}
        </div>
      ` : ''}
      <span class="red-mayor-action" aria-hidden="true">Consultar por Red Mayor <span>→</span></span>
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
            <span class="pro-more" aria-hidden="true">Ver detalle y consultar <span>→</span></span>
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
      <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card" data-specialty="${escapeHTML(pro.specialty)}" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-haspopup="dialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}, ${escapeHTML(pro.specialty)} en Córdoba" style="--stagger-index: ${index}">
        <div class="avatar" aria-hidden="true">${avatar}</div>
        <div class="pro-content">
          <h3>${escapeHTML(pro.name)}</h3>
          <span class="pro-spec">${escapeHTML(pro.specialty)}</span>
          ${pro.license ? `<span class="pro-license">${escapeHTML(pro.license)}</span>` : ''}
          <p class="pro-desc">${escapeHTML(pro.description)}</p>
          ${renderCardKeywords(pro.keywords)}
          <span class="pro-more" aria-hidden="true">Ver detalle y pedir turno <span>→</span></span>
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
            <strong class="space-member-name">${escapeHTML(member.name)}</strong>
            <span class="space-member-role">${escapeHTML(member.role)}</span>
            <span class="space-member-license">${escapeHTML(member.license)}</span>
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
      <div class="professional-hero space-hero">
        <div class="space-dialog-logo" aria-hidden="true" data-initials="RM">${logoImg}</div>
        <div>
          <span class="professional-kicker">Espacio de atención especializada</span>
          <h2 id="professionalDialogTitle">${escapeHTML(pro.name)}</h2>
        </div>
        <span class="professional-specialty">${escapeHTML(pro.subtitle || '')}</span>
        <p class="professional-description" id="professionalDialogDescription">${escapeHTML(pro.description)}</p>
      </div>

      ${renderSpaceServices(pro.services)}
      ${renderSpaceMembers(pro.members)}

      <dl class="professional-meta space-location-meta">
        <div class="professional-meta-row">
          <dt>Ubicación</dt>
          <dd>Médicos de Familia · Córdoba capital</dd>
        </div>
      </dl>

      ${pro.isPending ? `
        <p class="professional-note">
          Información del espacio en proceso de validación final. Los datos definitivos del equipo se incorporarán próximamente.
        </p>
      ` : ''}

      <div class="professional-actions">
        <a class="btn btn-primary btn-whatsapp" href="${escapeHTML(contactUrl)}" target="_blank" rel="noopener">Consultar por Red Mayor</a>
        <a class="btn btn-secondary" href="tel:+543514214225">Llamar al centro</a>
      </div>
    `;
    return;
  }

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
      <div class="professional-meta-row">
        <dt>Ubicación</dt>
        <dd>Médicos de Familia, Córdoba capital</dd>
      </div>
      ${pro.phone ? `
        <div class="professional-meta-row">
          <dt>Teléfono</dt>
          <dd><a href="${escapeHTML(pro.phone)}">Contacto individual</a></dd>
        </div>
      ` : ''}
      ${pro.keywords?.length ? `
        <div class="professional-meta-row">
          <dt>Atiende consultas de</dt>
          <dd>${renderKeywordList(pro.keywords)}</dd>
        </div>
      ` : ''}
    </dl>

    <p class="professional-note">El botón de WhatsApp abre un mensaje con el nombre del profesional y la especialidad para que puedas pedir turno sin escribir todo de cero.</p>

    <div class="professional-actions">
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

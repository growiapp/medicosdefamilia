const CONTACT = Object.freeze({
  whatsappUrl: 'https://wa.me/543513199546',
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

// TODO Growi: validar con el cliente la nómina, especialidades, matrículas y minicurrículums antes de publicación final.
const professionals = [
  { name: 'Dr. Carlos Presman', treatment: 'Dr.', specialty: 'Clínica médica', description: 'Atención clínica general y seguimiento de adultos.', keywords: ['Carlos Presman', 'clínica médica Córdoba'], phone: null, whatsapp: null, license: null, slug: 'carlos-presman', photo: null },
  { name: 'Dr. Guillermo Calvo', treatment: 'Dr.', specialty: 'Clínica médica', description: 'Consulta clínica, prevención y orientación diagnóstica.', keywords: ['Guillermo Calvo', 'clínica médica Córdoba'], phone: null, whatsapp: null, license: null, slug: 'guillermo-calvo', photo: null },
  { name: 'Dra. Juana Presman', treatment: 'Dra.', specialty: 'Clínica médica - Adolescentes', description: 'Seguimiento clínico orientado a adolescentes.', keywords: ['Juana Presman', 'adolescentes Córdoba'], phone: null, whatsapp: null, license: null, slug: 'juana-presman', photo: null },
  { name: 'Dr. Luis Ahumada', treatment: 'Dr.', specialty: 'Pediatría', description: 'Atención pediátrica y acompañamiento familiar.', keywords: ['Luis Ahumada', 'pediatría Córdoba'], phone: null, whatsapp: null, license: null, slug: 'luis-ahumada', photo: null },
  { name: 'Dr. Marcelo Arguello', treatment: 'Dr.', specialty: 'Pediatría', description: 'Controles, crecimiento y salud infantil.', keywords: ['Marcelo Arguello', 'pediatría Córdoba'], phone: null, whatsapp: null, license: null, slug: 'marcelo-arguello', photo: null },
  { name: 'Dra. Graciela Testa', treatment: 'Dra.', specialty: 'Endocrinología infanto juvenil', description: 'Atención endocrinológica en infancias y adolescencias.', keywords: ['Graciela Testa', 'endocrinología infanto juvenil Córdoba'], phone: null, whatsapp: null, license: null, slug: 'graciela-testa', photo: null },
  { name: 'Dra. Valeria Gaón', treatment: 'Dra.', specialty: 'Endocrinología adultos - Diabetes', description: 'Seguimiento endocrinológico y diabetes en adultos.', keywords: ['Valeria Gaón', 'diabetes Córdoba'], phone: null, whatsapp: null, license: null, slug: 'valeria-gaon', photo: null },
  { name: 'Dra. Ana Corrado', treatment: 'Dra.', specialty: 'Dermatología', description: 'Consulta dermatológica y cuidado de la piel.', keywords: ['Ana Corrado', 'dermatología Córdoba'], phone: null, whatsapp: null, license: null, slug: 'ana-corrado', photo: null },
  { name: 'Dra. Mariela Álvarez', treatment: 'Dra.', specialty: 'Dermatología estética', description: 'Atención estética dermatológica.', keywords: ['Mariela Álvarez', 'dermatología estética Córdoba'], phone: null, whatsapp: null, license: null, slug: 'mariela-alvarez', photo: null },
  { name: 'Dra. Mónica Garrone', treatment: 'Dra.', specialty: 'Fisioterapia', description: 'Acompañamiento físico y recuperación funcional.', keywords: ['Mónica Garrone', 'fisioterapia Córdoba'], phone: null, whatsapp: null, license: null, slug: 'monica-garrone', photo: null },
  { name: 'Dr. Clovis Domínguez', treatment: 'Dr.', specialty: 'Medicina laboral', description: 'Consultas vinculadas a salud y ámbito laboral.', keywords: ['Clovis Domínguez', 'medicina laboral Córdoba'], phone: null, whatsapp: null, license: null, slug: 'clovis-dominguez', photo: null },
  { name: 'Dr. Guillermo Ferrero', treatment: 'Dr.', specialty: 'Psiquiatría y psicología', description: 'Atención de salud mental y acompañamiento terapéutico.', keywords: ['Guillermo Ferrero', 'psiquiatría Córdoba', 'psicología Córdoba'], phone: null, whatsapp: null, license: null, slug: 'guillermo-ferrero', photo: null },
  { name: 'Lic. María Inés Salto', treatment: 'Lic.', specialty: 'Psicopedagogía - Psicoanálisis', description: 'Procesos psicopedagógicos y psicoanalíticos.', keywords: ['María Inés Salto', 'psicopedagogía Córdoba'], phone: null, whatsapp: null, license: null, slug: 'maria-ines-salto', photo: null },
  { name: 'Lic. Adriana Vitelli', treatment: 'Lic.', specialty: 'Psicología', description: 'Atención psicológica y espacios de escucha.', keywords: ['Adriana Vitelli', 'psicología Córdoba'], phone: null, whatsapp: null, license: null, slug: 'adriana-vitelli', photo: null },
  { name: 'Dr. Ariel Gaón', treatment: 'Dr.', specialty: 'Prácticas cardiovasculares', description: 'Prácticas y evaluación cardiovascular.', keywords: ['Ariel Gaón', 'prácticas cardiovasculares Córdoba'], phone: null, whatsapp: null, license: null, slug: 'ariel-gaon', photo: null },
  { name: 'Lic. Julieta Agüero', treatment: 'Lic.', specialty: 'Nutrición', description: 'Orientación nutricional y hábitos sostenibles.', keywords: ['Julieta Agüero', 'nutrición Córdoba'], phone: null, whatsapp: null, license: null, slug: 'julieta-aguero', photo: null },
  { name: 'Dra. Sara Ochoa', treatment: 'Dra.', specialty: 'Ginecología', description: 'Controles ginecológicos y salud integral.', keywords: ['Sara Ochoa', 'ginecología Córdoba'], phone: null, whatsapp: null, license: null, slug: 'sara-ochoa', photo: null },
  { name: 'Dra. Graciela Giachero', treatment: 'Dra.', specialty: 'Traumatología', description: 'Evaluación traumatológica y seguimiento físico.', keywords: ['Graciela Giachero', 'traumatología Córdoba'], phone: null, whatsapp: null, license: null, slug: 'graciela-giachero', photo: null },
  { name: 'Profesional pendiente de validación', treatment: null, specialty: 'Especialidad pendiente', description: 'Espacio reservado para completar la nómina final de 19 profesionales con datos validados por el cliente.', keywords: [], phone: null, whatsapp: null, license: null, slug: 'profesional-pendiente-validacion', photo: null, isPending: true }
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
  if (name.toLowerCase().includes('pendiente')) return 'PV';

  const clean = name.replace(/^(Dr\.|Dra\.|Lic\.|Mg\.)\s+/i, '').trim().split(/\s+/);
  return `${clean[0]?.charAt(0) || ''}${clean[1]?.charAt(0) || ''}`.toUpperCase();
};

const matchesFilter = (pro, filter) => {
  if (filter === 'Todos') return true;
  if (pro.isPending) return false;

  const specialty = pro.specialty.toLowerCase();
  const normalized = filter.toLowerCase();

  if (normalized === 'clínica') return specialty.includes('clínica');
  if (normalized === 'salud mental') {
    return ['psicología', 'psiquiatría', 'psicopedagogía', 'psicoanálisis'].some((term) => specialty.includes(term));
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

  proGrid.innerHTML = filtered.map((pro) => {
    const avatar = pro.photo
      ? `<img src="${escapeHTML(pro.photo)}" alt="Foto de ${escapeHTML(pro.name)}" loading="lazy" decoding="async" />`
      : escapeHTML(getInitials(pro.name));

    if (pro.isPending) {
      return `
        <article class="pro-card is-pending" data-specialty="${escapeHTML(pro.specialty)}">
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
      <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card" data-specialty="${escapeHTML(pro.specialty)}" data-slug="${escapeHTML(pro.slug)}" role="button" tabindex="0" aria-controls="professionalDialog" aria-expanded="false" aria-label="Ver información de ${escapeHTML(pro.name)}">
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
    renderProfessionals(button.dataset.filter);
  });
});

const getProfessionalBySlug = (slug) => professionals.find((pro) => pro.slug === slug);

const getContactUrl = (pro) => pro?.whatsapp || CONTACT.whatsappUrl;

const renderKeywordList = (keywords) => {
  if (!keywords?.length) return '';

  return `
    <div class="keyword-list">
      ${keywords.map((keyword) => `<span>${escapeHTML(keyword)}</span>`).join('')}
    </div>
  `;
};

const renderProfessionalDialog = (pro) => {
  const hasCurricularInfo = Boolean(pro.license || pro.phone || pro.whatsapp);
  const contactUrl = getContactUrl(pro);

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

  lastProfessionalTrigger = trigger;
  renderProfessionalDialog(pro);
  professionalDialog.hidden = false;
  professionalDialog.setAttribute('aria-hidden', 'false');
  document.body.classList.add('professional-open');
  pageChrome.forEach((element) => {
    element.inert = true;
  });
  setProfessionalTriggersExpanded(true, trigger);

  const closeButton = professionalDialog.querySelector('.professional-close');
  requestAnimationFrame(() => closeButton?.focus());
};

const closeProfessionalDialog = () => {
  if (!professionalDialog || professionalDialog.hidden) return;

  professionalDialog.hidden = true;
  professionalDialog.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('professional-open');
  pageChrome.forEach((element) => {
    element.inert = false;
  });
  setProfessionalTriggersExpanded(false);

  if (lastProfessionalTrigger?.isConnected) {
    lastProfessionalTrigger.focus();
  }
  lastProfessionalTrigger = null;
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

if ('IntersectionObserver' in window) {
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

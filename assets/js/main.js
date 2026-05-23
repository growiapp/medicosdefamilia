const CONTACT = Object.freeze({
  whatsappUrl: 'https://wa.me/543513199546',
  phoneUrl: 'tel:+543514214225',
  mapsUrl: 'https://www.google.com/maps?q=27+de+abril+1254+C%C3%B3rdoba+Argentina+5000'
});

const siteHeader = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDemo = document.getElementById('closeDemo');
const demoBadge = document.getElementById('demoBadge');

const setMenu = (open) => {
  if (!mobileDrawer || !menuToggle) return;

  mobileDrawer.classList.toggle('open', open);
  mobileDrawer.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);
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

if (closeDemo && demoBadge) {
  closeDemo.addEventListener('click', () => demoBadge.remove());
}

// TODO Growi: validar con el cliente la nómina, especialidades, matrículas, minicurrículums y WhatsApp individuales antes de publicación final.
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

    return `
      <article id="profesional-${escapeHTML(pro.slug)}" class="pro-card${pro.isPending ? ' is-pending' : ''}" data-specialty="${escapeHTML(pro.specialty)}" data-slug="${escapeHTML(pro.slug)}" itemscope itemtype="https://schema.org/Person">
        <div class="avatar" aria-hidden="true">${avatar}</div>
        <div class="pro-content">
          <h3 itemprop="name">${escapeHTML(pro.name)}</h3>
          <span class="pro-spec" itemprop="jobTitle">${escapeHTML(pro.specialty)}</span>
          <p class="pro-desc" itemprop="description">${escapeHTML(pro.description)}</p>
        </div>
      </article>
    `;
  }).join('');
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

const injectProfessionalsSchema = () => {
  const publicProfessionals = professionals.filter((pro) => !pro.isPending);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Profesionales de Médicos de Familia',
    itemListElement: publicProfessionals.map((pro, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: pro.name,
        jobTitle: pro.specialty,
        description: pro.description,
        worksFor: {
          '@type': 'MedicalClinic',
          name: 'Médicos de Familia',
          telephone: CONTACT.phoneUrl.replace('tel:', ''),
          hasMap: CONTACT.mapsUrl,
          sameAs: [CONTACT.whatsappUrl]
        },
        url: `#profesional-${pro.slug}`,
        knowsAbout: pro.keywords
      }
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

renderProfessionals();
injectProfessionalsSchema();

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

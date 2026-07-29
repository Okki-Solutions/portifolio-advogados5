(function() {
  'use strict';

  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  const body = document.body;
  const header = document.getElementById('header');

  function toggleHeaderState() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }

  hamburger.addEventListener('click', function() {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const depoimentosData = [
    {
      nome: 'Renata M.',
      cidade: 'São Paulo, SP',
      texto: 'O Dr. Marcus resolveu meu caso com uma rapidez e competência que eu nunca vi. Profissionalismo e empatia andam juntos. Recomendo de olhos fechados!',
      estrelas: 5
    },
    {
      nome: 'Carlos A.',
      cidade: 'Rio de Janeiro, RJ',
      texto: 'Contratei o escritório para uma questão trabalhista complexa. O resultado foi muito além do esperado. Marcus é um advogado brilhante.',
      estrelas: 5
    },
    {
      nome: 'Fernanda L.',
      cidade: 'Belo Horizonte, MG',
      texto: 'Atendimento humano e ao mesmo tempo técnico. Senti que meu caso foi tratado com a devida importância. Excelente estrutura e comunicação.',
      estrelas: 4
    },
    {
      nome: 'Jorge R.',
      cidade: 'Curitiba, PR',
      texto: 'Dr. Marcus nos auxiliou na recuperação judicial da empresa. Estratégia impecável, salvou nossa companhia. Gratidão eterna.',
      estrelas: 5
    },
    {
      nome: 'Patrícia K.',
      cidade: 'Porto Alegre, RS',
      texto: 'Uma das melhores experiências com um advogado. Transparente, objetivo e sempre disponível. Resolveu meu problema de família com muita sensibilidade.',
      estrelas: 5
    }
  ];

  const track = document.getElementById('carouselTrack');
  const indicators = document.getElementById('indicators');
  let currentIndex = 0;
  let autoSlideInterval;

  function criarEstrelas(num) {
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += i < num ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return html;
  }

  function renderDepoimentos() {
    track.innerHTML = '';
    depoimentosData.forEach((dep) => {
      const slide = document.createElement('div');
      slide.className = 'depoimento-slide';
      slide.innerHTML = `
        <div class="estrelas">${criarEstrelas(dep.estrelas)}</div>
        <blockquote>“${dep.texto}”</blockquote>
        <p class="cliente">${dep.nome}</p>
        <p class="cidade">${dep.cidade}</p>
      `;
      track.appendChild(slide);
    });

    indicators.innerHTML = '';
    depoimentosData.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      indicators.appendChild(dot);
    });
  }

  function goToSlide(index) {
    const slides = track.children;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.carousel-indicators span').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });
  document.getElementById('prevBtn').addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  renderDepoimentos();
  goToSlide(0);
  autoSlideInterval = setInterval(nextSlide, 5000);

  const revealElements = document.querySelectorAll('.section, .area-card, .estat-card, .diferencial-card, .depoimento-slide, .local-grid, .contato-grid, .hero-panel');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });

  const styleReveal = document.createElement('style');
  styleReveal.textContent = `
    .reveal {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleReveal);

  const form = document.getElementById('contatoForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const assunto = document.getElementById('assunto').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !assunto || !mensagem) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    form.reset();
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });

  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState();
})();

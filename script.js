(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  window.lucide?.createIcons();

  const menu = $('.mobile-menu');
  const navigation = $('#mobile-nav');
  function closeMenu() {
    navigation.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }
  menu.addEventListener('click', () => {
    const open = navigation.hidden;
    navigation.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const viewer = $('.photo-dialog');
  $$('[data-photo]').forEach(button => button.addEventListener('click', () => {
    $('#viewer-photo').src = button.dataset.photo;
    $('#viewer-photo').alt = button.dataset.alt;
    $('#photo-caption').textContent = button.dataset.caption;
    viewer.showModal();
  }));
  $('[data-close-photo]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      if (viewer.open) { event.preventDefault(); viewer.close(); }
    }
  });

  if ($('#destination-search')) {
    let region = 'all';
    const cards = $$('.destinations-grid .place-card');
    function filterPlaces() {
      const query = $('#destination-search').value.trim().toLowerCase();
      let count = 0;
      cards.forEach(card => {
        card.hidden = !(region === 'all' || card.dataset.region === region) || !card.dataset.search.toLowerCase().includes(query);
        if (!card.hidden) count++;
      });
      $('#results-count').textContent = `${count} ${count === 1 ? 'place' : 'places'} to spark your curiosity`;
      $('#no-places').hidden = count > 0;
    }
    $$('[data-region-filter]').forEach(button => button.addEventListener('click', () => {
      region = button.dataset.regionFilter;
      $$('[data-region-filter]').forEach(other => {
        other.classList.toggle('selected', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
      filterPlaces();
    }));
    $('#destination-search').addEventListener('input', filterPlaces);
    $('#reset-filters').addEventListener('click', () => {
      $('#destination-search').value = '';
      $('[data-region-filter="all"]').click();
    });
    if (location.hash) document.getElementById(location.hash.slice(1))?.querySelector('details')?.setAttribute('open', '');
  }

  if ($('#journey-trail')) {
    const trails = {
      heritage: {
        title: 'The heritage trail', image: 'jaipur', alt: 'Amber Fort in Jaipur',
        intro: 'Three distinctive cities, connected by architecture, craftsmanship, and stories.',
        short: [0, 2, 5],
        days: [
          ['Delhi', "Explore old-city lanes and the gardens around Humayun's Tomb."],
          ['Delhi', 'Leave time for craft collections, markets, and a regional meal.'],
          ['Agra', 'Discover the sandstone courtyards of Agra Fort.'],
          ['Agra', "Look closely at the Taj Mahal's marble craftsmanship."],
          ['Jaipur', "Continue to Jaipur's old city, bazaars, and textiles."],
          ['Jaipur', "Explore Amber Fort and Jaipur's architectural heritage."],
          ['Jaipur', 'Make room for a slow meal and a final studio visit.']
        ]
      },
      coast: {
        title: 'A slower southern journey', image: 'kerala', alt: "A houseboat on Kerala's backwaters",
        intro: 'Coastal heritage, local kitchens, and afternoons on the backwaters.',
        short: [0, 3, 4],
        days: [
          ['Kochi', 'Wander through Fort Kochi and its maritime neighbourhoods.'],
          ['Kochi', "Discover galleries, markets, and the region's food traditions."],
          ['Alappuzha', 'Travel to the backwaters and settle into the local rhythm.'],
          ['Alappuzha', 'Spend a quiet day discovering village waterways.'],
          ['Kerala coast', 'Make room for a coastal walk and a regional meal.'],
          ['Kerala coast', 'Visit a nearby village or discover local craft.'],
          ['Kochi', 'Return to Kochi with time for an unhurried final stop.']
        ]
      }
    };
    let duration = 7;
    function renderJourney() {
      const trail = trails[$('#journey-trail').value];
      const days = duration === 3 ? trail.short.map(index => trail.days[index]) : duration === 5 ? trail.days.filter((_, index) => ![1, 5].includes(index)) : trail.days;
      $('#journey-title').textContent = trail.title;
      $('#journey-intro').textContent = trail.intro;
      $('#journey-image').src = `assets/${trail.image}.jpg`;
      $('#journey-image').alt = trail.alt;
      $('#journey-region').textContent = [...new Set(days.map(day => day[0]))].join(' / ');
      $('#journey-timeline').replaceChildren(...days.map(([place, description], index) => {
        const article = document.createElement('article');
        for (const [tag, text] of [['span', `DAY ${String(index + 1).padStart(2, '0')}`], ['h3', place], ['p', description]]) {
          const element = document.createElement(tag);
          element.textContent = text;
          article.append(element);
        }
        return article;
      }));
    }
    $('#journey-trail').addEventListener('change', renderJourney);
    $$('[data-days]').forEach(button => button.addEventListener('click', () => {
      duration = Number(button.dataset.days);
      $$('[data-days]').forEach(other => {
        other.classList.toggle('selected', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
      renderJourney();
    }));
    $('#print-journey').addEventListener('click', () => window.print());
  }
})();

/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            navigation.classList.add('is-open');
            document.documentElement.style.overflowY = 'hidden';
        } else {
            navigation.classList.remove('is-open');
            document.documentElement.style.overflowY = null;
        }
    });
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');
    
    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* Build Category dropdown (tags with slug starting with category-) */
(function () {
    try {
        console.log('[category] init');
        const head = document.querySelector('.gh-navigation');
        if (!head) { console.log('[category] no .gh-navigation'); return; }
        const menu = head.querySelector('.gh-navigation-menu');
        if (!menu) { console.log('[category] no .gh-navigation-menu'); return; }
        const nav = menu.querySelector('.nav');
        if (!nav) { console.log('[category] no .nav'); return; }

        const source = menu.querySelector('ul.gh-category-extra[data-source="categories"]');
        if (!source) { console.log('[category] no hidden category source UL'); return; }
        const items = Array.from(source.querySelectorAll('li'))
            .filter(function (li) {
                const slug = li.getAttribute('data-slug') || '';
                const ok = slug.indexOf('category-') === 0;
                if (!ok) { console.log('[category] filtered out non-category tag:', slug); }
                return ok;
            });
        console.log('[category] found category items:', items.length);
        if (!items.length) { console.log('[category] no category-* tags, skip'); return; }

        // Create LI container
        const li = document.createElement('li');
        li.className = 'nav-category';

        // Create toggle link
        const toggle = document.createElement('a');
        toggle.href = '#';
        toggle.className = 'nav-category-link';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Category';

        // Create dropdown wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-dropdown gh-category-dropdown';

        // Append cloned items
        items.forEach(function (item, idx) {
            console.log('[category] append item', idx, item?.className);
            wrapper.appendChild(item.cloneNode(true));
        });

        li.appendChild(toggle);
        li.appendChild(wrapper);

        // Insert after first two items (e.g., Home, About)
        const siblings = Array.from(nav.children).filter(function (el) { return el.tagName && el.tagName.toLowerCase() === 'li'; });
        const insertIndex = Math.min(2, siblings.length);
        const refNode = siblings[insertIndex] || null;
        console.log('[category] insert position index=', insertIndex, 'of', siblings.length);
        nav.insertBefore(li, refNode);

        const close = function () {
            if (li.classList.contains('is-open')) {
                li.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        };

        // Toggle behavior
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !li.classList.contains('is-open');
            console.log('[category] toggle click, willOpen=', willOpen);
            // Close any open overflow dropdown controlled by header class
            head.classList.remove('is-dropdown-open');
            // Toggle this dropdown
            if (willOpen) {
                li.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                li.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('click', function (e) {
            if (!li.contains(e.target)) {
                close();
            }
        });

        window.addEventListener('resize', function () {
            // No layout recompute needed, but keep log
            console.log('[category] window resize');
        });

        console.log('[category] initialized successfully');
    } catch (err) {
        console.error('[category] init error', err);
    }
})();

/* Build Topic dropdown (tags with slug starting with topic-) */
(function () {
    try {
        console.log('[topic] init');
        const head = document.querySelector('.gh-navigation');
        if (!head) { console.log('[topic] no .gh-navigation'); return; }
        const menu = head.querySelector('.gh-navigation-menu');
        if (!menu) { console.log('[topic] no .gh-navigation-menu'); return; }
        const nav = menu.querySelector('.nav');
        if (!nav) { console.log('[topic] no .nav'); return; }

        const source = menu.querySelector('ul.gh-topic-extra[data-source="topics"]');
        if (!source) { console.log('[topic] no hidden topic source UL'); return; }
        const items = Array.from(source.querySelectorAll('li'))
            .filter(function (li) {
                const slug = li.getAttribute('data-slug') || '';
                const ok = slug.indexOf('topic-') === 0;
                if (!ok) { console.log('[topic] filtered out non-topic tag:', slug); }
                return ok;
            });
        console.log('[topic] found topic items:', items.length);
        if (!items.length) { console.log('[topic] no topic-* tags, skip'); return; }

        const li = document.createElement('li');
        li.className = 'nav-topic';

        const toggle = document.createElement('a');
        toggle.href = '#';
        toggle.className = 'nav-topic-link';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Topic';

        const wrapper = document.createElement('div');
        wrapper.className = 'gh-dropdown gh-topic-dropdown';

        items.forEach(function (item) {
            wrapper.appendChild(item.cloneNode(true));
        });

        li.appendChild(toggle);
        li.appendChild(wrapper);

        const siblings = Array.from(nav.children).filter(function (el) { return el.tagName && el.tagName.toLowerCase() === 'li'; });
        const insertIndex = Math.min(3, siblings.length); // after Home, About, Category
        const refNode = siblings[insertIndex] || null;
        console.log('[topic] insert position index=', insertIndex, 'of', siblings.length);
        nav.insertBefore(li, refNode);

        const close = function () {
            if (li.classList.contains('is-open')) {
                li.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        };

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !li.classList.contains('is-open');
            head.classList.remove('is-dropdown-open');
            if (willOpen) {
                li.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                li.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('click', function (e) {
            if (!li.contains(e.target)) {
                close();
            }
        });

        window.addEventListener('resize', function () {
            console.log('[topic] window resize');
        });

        console.log('[topic] initialized successfully');
    } catch (err) {
        console.error('[topic] init error', err);
    }
})();
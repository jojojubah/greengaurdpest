(function () {
  var CONSENT_KEY = 'gg_consent_v1';
  var analyticsLoaded = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function parseConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveConsent(preferences) {
    var payload = {
      version: 1,
      necessary: true,
      analytics: !!preferences.analytics,
      marketing: !!preferences.marketing,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
    applyConsent(payload);
    updateConsentStatus(payload);
    hideBanner();
    closeModal();
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) {
      loadAnalytics();
    }
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    var script = document.createElement('script');
    script.defer = true;
    script.src = 'https://greenguard.brst.website/~flock.js';
    script.setAttribute('data-proxy-url', 'https://greenguard.brst.website/~api/analytics');
    script.setAttribute('data-loaded-from', 'consent-granted');
    document.head.appendChild(script);
  }

  function updateConsentStatus(consent) {
    var nodes = document.querySelectorAll('[data-consent-state]');
    if (!nodes.length) return;

    var label = 'Not set';
    if (consent) {
      if (consent.analytics || consent.marketing) {
        label = 'Custom preferences saved';
      } else {
        label = 'Essential only';
      }
    }

    nodes.forEach(function (node) {
      node.textContent = label;
    });
  }

  function mountCookieUi() {
    if (byId('cookie-banner') || byId('cookie-modal')) return;

    var root = byId('cookie-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'cookie-root';
      document.body.appendChild(root);
    }

    root.innerHTML =
      '<section id="cookie-banner" class="cookie-banner" aria-live="polite" aria-label="Cookie consent banner">' +
      '  <strong>Cookie preferences</strong>' +
      '  <p>We use essential cookies to run this site. Analytics and marketing cookies are optional and only run after your consent.</p>' +
      '  <div class="cookie-actions">' +
      '    <button class="btn btn-primary" type="button" data-consent="accept">Accept all</button>' +
      '    <button class="btn btn-ghost" type="button" data-consent="reject">Reject optional</button>' +
      '    <button class="btn btn-ghost" type="button" data-consent="customize">Customize</button>' +
      '  </div>' +
      '</section>' +
      '<div id="cookie-modal" class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">' +
      '  <div class="cookie-panel">' +
      '    <h2 id="cookie-modal-title" class="section-title">Cookie settings</h2>' +
      '    <p class="muted">Choose which optional cookies you allow. Essential cookies are always enabled.</p>' +
      '    <article class="cookie-option">' +
      '      <strong>Essential cookies</strong>' +
      '      <p class="small muted">Required for security, navigation, and form submission.</p>' +
      '      <label class="switch"><input type="checkbox" checked disabled /> Always active</label>' +
      '    </article>' +
      '    <article class="cookie-option">' +
      '      <strong>Analytics cookies</strong>' +
      '      <p class="small muted">Help us measure site performance and improve pages.</p>' +
      '      <label class="switch"><input id="consent-analytics" type="checkbox" /> Allow analytics</label>' +
      '    </article>' +
      '    <article class="cookie-option">' +
      '      <strong>Marketing cookies</strong>' +
      '      <p class="small muted">Used for campaign attribution and ad optimization.</p>' +
      '      <label class="switch"><input id="consent-marketing" type="checkbox" /> Allow marketing</label>' +
      '    </article>' +
      '    <div class="cookie-actions">' +
      '      <button class="btn btn-primary" type="button" data-modal="save">Save preferences</button>' +
      '      <button class="btn btn-ghost" type="button" data-modal="close">Cancel</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  function showBanner() {
    var banner = byId('cookie-banner');
    if (banner) banner.classList.add('show');
  }

  function hideBanner() {
    var banner = byId('cookie-banner');
    if (banner) banner.classList.remove('show');
  }

  function openModal() {
    var modal = byId('cookie-modal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    var consent = parseConsent();
    var analytics = byId('consent-analytics');
    var marketing = byId('consent-marketing');
    if (analytics) analytics.checked = !!(consent && consent.analytics);
    if (marketing) marketing.checked = !!(consent && consent.marketing);
  }

  function closeModal() {
    var modal = byId('cookie-modal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function setupConsentEvents() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;

      var action = target.getAttribute('data-consent');
      if (action === 'accept') {
        saveConsent({ analytics: true, marketing: true });
      }
      if (action === 'reject') {
        saveConsent({ analytics: false, marketing: false });
      }
      if (action === 'customize') {
        openModal();
      }

      var modalAction = target.getAttribute('data-modal');
      if (modalAction === 'save') {
        saveConsent({
          analytics: !!(byId('consent-analytics') && byId('consent-analytics').checked),
          marketing: !!(byId('consent-marketing') && byId('consent-marketing').checked)
        });
      }
      if (modalAction === 'close') {
        closeModal();
      }

      if (target.matches('[data-cookie-settings]')) {
        event.preventDefault();
        openModal();
      }

      if (target.id === 'cookie-modal') {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  function setupNav() {
    var button = byId('nav-toggle');
    var nav = byId('site-nav');
    if (!button || !nav) return;

    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setupCurrentNav() {
    var path = window.location.pathname || '/';
    if (!path.endsWith('/')) path = path + '/';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (!href.endsWith('/')) href = href + '/';
      if (href === path) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function setupFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  function setupReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      node.classList.add('in');
    });
  }

  function parseCounterSpec(node) {
    var text = (node.textContent || '').trim();
    var targetAttr = node.getAttribute('data-counter-target');
    var target = targetAttr ? parseFloat(targetAttr) : NaN;
    var match = text.match(/[0-9]+(?:\.[0-9]+)?/);
    if (Number.isNaN(target) && !match) return null;

    var numberText = match ? match[0] : String(target);
    var startIndex = match ? (match.index || 0) : 0;
    var decimalsAttr = node.getAttribute('data-counter-decimals');
    var prefixAttr = node.getAttribute('data-counter-prefix');
    var suffixAttr = node.getAttribute('data-counter-suffix');
    var formatAttr = node.getAttribute('data-counter-format');
    var inferredTarget = parseFloat(numberText);

    if (Number.isNaN(target)) {
      target = inferredTarget;
    }

    var decimals = decimalsAttr !== null
      ? parseInt(decimalsAttr, 10)
      : (numberText.indexOf('.') > -1 ? numberText.split('.')[1].length : 0);

    if (Number.isNaN(decimals) || decimals < 0) decimals = 0;

    return {
      raw: text,
      prefix: prefixAttr !== null ? prefixAttr : text.slice(0, startIndex),
      suffix: suffixAttr !== null ? suffixAttr : text.slice(startIndex + numberText.length),
      target: target,
      decimals: decimals,
      format: formatAttr || 'plain'
    };
  }

  function formatCounterValue(spec, value) {
    if (spec.format === 'compact-k-plus') {
      var scaled = value / 1000;
      var precision = scaled < 10 ? 1 : 0;
      var compact = scaled.toFixed(precision);
      if (compact.endsWith('.0')) compact = compact.slice(0, -2);
      return compact + 'k+';
    }

    var numeric;
    if (spec.decimals > 0) {
      numeric = value.toFixed(spec.decimals);
    } else {
      numeric = String(Math.round(value));
    }
    return spec.prefix + numeric + spec.suffix;
  }

  function setupBannerCounters() {
    var band = document.querySelector('.stat-band');
    if (!band) return;

    var nodes = band.querySelectorAll('.stat-grid strong');
    if (!nodes.length) return;

    var reducedMotion = prefersReducedMotion();

    var counters = [];
    nodes.forEach(function (node) {
      var spec = parseCounterSpec(node);
      if (!spec) return;
      counters.push({ node: node, spec: spec });
      if (!reducedMotion) {
        node.textContent = formatCounterValue(spec, 0);
      }
    });

    if (!counters.length) return;

    counters.forEach(function (counter) {
      counter.node.textContent = reducedMotion
        ? counter.spec.raw
        : formatCounterValue(counter.spec, counter.spec.target);
    });
  }

  function init() {
    mountCookieUi();
    setupConsentEvents();
    setupNav();
    setupCurrentNav();
    setupFaq();
    setupReveal();
    setupBannerCounters();

    var consent = parseConsent();
    updateConsentStatus(consent);
    if (!consent) {
      showBanner();
    } else {
      applyConsent(consent);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();

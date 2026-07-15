/* ==========================================================================
   Clube de Negócios LMA — Landing Page (Dubai / Free Zone)
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP = '971545882588';
  var DEFAULT_MSG = 'Ola! Quero abrir minha empresa em Dubai com o Clube de Negocios LMA.';

  document.documentElement.classList.add('has-js');

  function waUrl(msg) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg || DEFAULT_MSG); }
  function bindWa(el) {
    el.setAttribute('href', waUrl(el.getAttribute('data-msg')));
    if (el.getAttribute('target') !== '_blank') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
  }
  document.querySelectorAll('.js-wa').forEach(bindWa);

  /* ---------- Header + progress ---------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  window.addEventListener('scroll', function () {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }, { passive: true });

  /* ---------- Reveal (fail-safe) ---------- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .scale-in, [data-stagger]'));
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || document.documentElement.clientHeight) * 0.92 && r.bottom > 0;
  }
  function reveal(el) { el.classList.add('in'); }
  function initialPass() { revealEls.forEach(function (el) { if (inView(el)) reveal(el); }); }
  initialPass();
  window.addEventListener('load', initialPass);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  }
  window.addEventListener('scroll', function () {
    for (var i = 0; i < revealEls.length; i++) {
      if (!revealEls[i].classList.contains('in') && inView(revealEls[i])) reveal(revealEls[i]);
    }
  }, { passive: true });
  setTimeout(function () { revealEls.forEach(reveal); }, 3000);

  /* ---------- Count-up ---------- */
  function animateCount(el) {
    var raw = el.getAttribute('data-to') || '0';
    var to = parseFloat(raw) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1300, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counts = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  } else { counts.forEach(animateCount); }

  /* ---------- Hero parallax + Apple-style scroll effects ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroBg = document.querySelector('.hero-bg');
  var heroContent = document.querySelector('.hero .container');
  var pinWrap = document.querySelector('[data-pin]');
  var pinPhrases = pinWrap ? [].slice.call(pinWrap.querySelectorAll('.pin-phrase')) : [];
  var pinDots = pinWrap ? [].slice.call(pinWrap.querySelectorAll('.pin-dot')) : [];
  var parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function onScrollFx() {
    var y = window.scrollY, vh = window.innerHeight;
    // Hero background parallax
    if (heroBg) heroBg.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)';
    // Hero content recedes on scroll (Apple hero)
    if (heroContent) {
      var hp = clamp(y / (vh * 0.85), 0, 1);
      heroContent.style.transform = 'translateY(' + (hp * -60).toFixed(1) + 'px) scale(' + (1 - hp * 0.07).toFixed(3) + ')';
      heroContent.style.opacity = (1 - hp * 0.95).toFixed(3);
    }
    // Pinned scrollytelling sequence
    if (pinWrap && pinPhrases.length) {
      var rect = pinWrap.getBoundingClientRect();
      var total = pinWrap.offsetHeight - vh;
      var p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      var n = pinPhrases.length, seg = 1 / n;
      var activeIdx = clamp(Math.round(p / seg - 0.5), 0, n - 1);
      for (var i = 0; i < n; i++) {
        var c = (i + 0.5) * seg;            // center of this phrase's window
        var dd = (p - c) / seg;             // 0 at center, ±0.5 at segment edges
        var ad = dd < 0 ? -dd : dd;
        var op = clamp(1 - (ad - 0.35) / 0.30, 0, 1);  // full within ±0.35, fades out by ±0.65 (overlaps neighbor)
        pinPhrases[i].style.opacity = op.toFixed(3);
        pinPhrases[i].style.transform = 'translateY(' + (dd * 42).toFixed(1) + 'px)';
      }
      for (var di = 0; di < pinDots.length; di++) pinDots[di].classList.toggle('on', di === activeIdx);
    }
    // Generic parallax
    for (var j = 0; j < parallaxEls.length; j++) {
      var el = parallaxEls[j], sp = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      var r = el.getBoundingClientRect();
      el.style.transform = 'translateY(' + (((r.top + r.height / 2) - vh / 2) * -sp).toFixed(1) + 'px)';
    }
  }
  if (!reduce) {
    var fxTicking = false;
    window.addEventListener('scroll', function () {
      if (!fxTicking) { fxTicking = true; requestAnimationFrame(function () { onScrollFx(); fxTicking = false; }); }
    }, { passive: true });
    window.addEventListener('resize', onScrollFx);
    onScrollFx();
    window.__fx = onScrollFx;
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var ans = item.querySelector('.faq-a');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  });

  /* ---------- Video ---------- */
  var videoWrap = document.getElementById('videoWrap');
  if (videoWrap) {
    videoWrap.addEventListener('click', function () {
      var id = videoWrap.getAttribute('data-video');
      var f = document.createElement('iframe');
      f.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0');
      f.setAttribute('title', 'Vídeo Clube de Negócios LMA');
      f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      f.setAttribute('allowfullscreen', '');
      videoWrap.innerHTML = ''; videoWrap.appendChild(f); videoWrap.style.cursor = 'default';
    });
  }

  /* ---------- Cultural sound synth (Web Audio) ---------- */
  var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  var actx = null, master = null;
  var muted = false;
  try { muted = localStorage.getItem('lma_muted') === '1'; } catch (e) {}
  function ensureAudio() {
    if (!AudioCtxClass) return null;
    if (!actx) { actx = new AudioCtxClass(); master = actx.createGain(); master.gain.value = 0.9; master.connect(actx.destination); }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, start, dur, type, gain, opts) {
    opts = opts || {};
    var t0 = actx.currentTime + start;
    var osc = actx.createOscillator(), g = actx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.glide) osc.frequency.exponentialRampToValueAtTime(opts.glide, t0 + dur);
    var out = g;
    if (opts.lp) { var lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = opts.lp; g.connect(lp); out = lp; }
    if (opts.vibrato) {
      var lfo = actx.createOscillator(), lg = actx.createGain();
      lfo.frequency.value = opts.vibrato; lg.gain.value = opts.vibratoDepth || 6;
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t0); lfo.stop(t0 + dur + 0.05);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain || 0.2, t0 + (opts.attack || 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); out.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.06);
  }
  function noiseHit(start, dur, gain, freq, q) {
    var t0 = actx.currentTime + start;
    var len = Math.max(1, Math.floor(actx.sampleRate * dur));
    var buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    var src = actx.createBufferSource(); src.buffer = buf;
    var bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq || 200; bp.Q.value = q || 1.4;
    var g = actx.createGain(); g.gain.value = gain || 0.3;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }
  function playRegion(key) {
    if (muted || reduce) return;
    if (!ensureAudio()) return;
    switch (key) {
      case 'oriente': // Hijaz scale — Middle Eastern
        [[587.33,0],[622.25,0.16],[739.99,0.32],[783.99,0.46],[739.99,0.62],[622.25,0.78],[587.33,0.94]].forEach(function (n) {
          tone(n[0], n[1], 0.42, 'sawtooth', 0.13, { lp: 2200, vibrato: 6, vibratoDepth: 8 });
        });
        break;
      case 'asia': // Pentatonic — koto-like pluck
        [[659.25,0],[783.99,0.16],[880,0.32],[1046.5,0.5],[880,0.7],[659.25,0.9]].forEach(function (n) {
          tone(n[0], n[1], 0.5, 'triangle', 0.16, { attack: 0.005, lp: 3000 });
        });
        break;
      case 'europa': // Major arpeggio — classical, elegant
        [[523.25,0],[659.25,0.14],[783.99,0.28],[1046.5,0.44]].forEach(function (n) {
          tone(n[0], n[1], 0.6, 'triangle', 0.16, { attack: 0.03 });
        });
        tone(1318.51, 0.6, 0.5, 'sine', 0.08, { attack: 0.05 });
        break;
      case 'africa': // Djembe-like percussion
        [0,0.24,0.4,0.62,0.78,1.0].forEach(function (t, i) { noiseHit(t, 0.22, i % 3 === 0 ? 0.34 : 0.22, i % 3 === 0 ? 110 : 210, 1.2); });
        noiseHit(0.5, 0.14, 0.2, 520, 2); noiseHit(0.9, 0.14, 0.2, 520, 2);
        break;
      case 'americas': // Warm syncopated motif (Latin/blues feel)
        [[440,0],[523.25,0.18],[587.33,0.42],[659.25,0.6],[523.25,0.82],[440,1.0]].forEach(function (n) {
          tone(n[0], n[1], 0.5, 'triangle', 0.15, { attack: 0.02, lp: 2600 });
        });
        tone(220, 0, 1.3, 'sine', 0.1, { attack: 0.04 });
        break;
      case 'oceania': // Didgeridoo drone
        tone(72, 0, 2.6, 'sawtooth', 0.22, { lp: 380, vibrato: 5.5, vibratoDepth: 4, attack: 0.08 });
        tone(108, 0, 2.6, 'sawtooth', 0.08, { lp: 500, vibrato: 5.5, vibratoDepth: 3, attack: 0.1 });
        break;
    }
  }

  /* ---------- Interactive real world map ---------- */
  var REGIONS = {
    oriente: { name: 'Oriente Médio', anchor: 'sa', s1: '~400 mi', s2: '0%', text: 'Mercado consumidor de alto poder aquisitivo, na porta da sua empresa. Acordos regionais facilitam a entrada de produtos e serviços.', countries: ['ae','sa','qa','kw','om','bh','ir','iq','jo','il','lb','sy','ye'] },
    europa:  { name: 'Europa', anchor: 'de', s1: '~740 mi', s2: '0%', text: 'Acesso a um dos maiores blocos consumidores do mundo, com Dubai como ponte logística e comercial estratégica.', countries: ['pt','es','fr','de','it','gb','ie','nl','be','ch','at','pl','se','no','fi','dk','gr','cz','ro','hu','ua','rs','bg','hr','sk'] },
    asia:    { name: 'Ásia', anchor: 'cn', s1: '~4,7 bi', s2: '0%', text: 'A região que mais cresce no planeta. Dubai é o corredor natural entre Ásia, Europa e o mundo árabe.', countries: ['cn','in','jp','kr','kp','id','th','vn','my','ph','pk','bd','kz','uz','mm','lk','np','kh','la','mn','tw','af'] },
    africa:  { name: 'África', anchor: 'ng', s1: '~1,4 bi', s2: '0%', text: 'Mercado emergente com forte demanda por importação. Dubai é o principal hub de reexportação para o continente.', countries: ['za','ng','eg','ke','ma','dz','et','gh','tz','ao','ci','cm','sn','tn','ly','sd','cd','mz','zm','zw','ug','ml'] },
    americas:{ name: 'Américas', anchor: 'br', s1: '~1 bi', s2: '0%', text: 'Da sua base em Dubai, opere com as Américas em moeda forte e com reputação internacional consolidada.', countries: ['us','ca','br','ar','mx','cl','co','pe','ve','ec','bo','py','uy','gt','cu','do'] },
    oceania: { name: 'Oceania', anchor: 'au', s1: '~43 mi', s2: '0%', text: 'Mercados maduros e de alto valor agregado, conectados a Dubai por rotas comerciais premium.', countries: ['au','nz','pg','fj','nc','sb'] }
  };
  var REGION_ORDER = ['oriente','europa','asia','africa','americas','oceania'];
  var SVGNS = 'http://www.w3.org/2000/svg';

  var mapStage = document.getElementById('mapStage');
  if (mapStage) {
    var mapLoaded = false;
    function loadMap() {
      if (mapLoaded) return; mapLoaded = true;
      fetch(mapStage.getAttribute('data-src')).then(function (r) { return r.text(); }).then(function (txt) {
        var holder = document.getElementById('mapReal');
        holder.innerHTML = txt;
        var svg = holder.querySelector('svg');
        if (!svg) throw new Error('no svg');
        buildMap(svg);
      }).catch(function () {
        var l = document.getElementById('mapLoading');
        if (l) l.textContent = 'Não foi possível carregar o mapa aqui. Fale conosco no WhatsApp para ver as rotas.';
      });
    }
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { loadMap(); mio.disconnect(); } });
      }, { rootMargin: '300px' });
      mio.observe(mapStage);
    } else { loadMap(); }
    // Fallback: also load on scroll when near viewport (covers environments where IO doesn't fire)
    window.addEventListener('scroll', function () {
      if (!mapLoaded && mapStage.getBoundingClientRect().top < window.innerHeight * 1.5) loadMap();
    }, { passive: true });
    window.__loadMap = loadMap;
  }

  function buildMap(svg) {
    var overlay = document.getElementById('mapOverlay');
    function center(id) {
      var el = svg.getElementById ? svg.getElementById(id) : svg.querySelector('#' + id);
      if (!el) return null;
      try { var b = el.getBBox(); if (!b.width && !b.height) return null; return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
      catch (e) { return null; }
    }
    var FALLBACK = { hub: { x: 690, y: 300 }, sa: { x: 660, y: 300 }, de: { x: 520, y: 210 }, cn: { x: 800, y: 250 }, ng: { x: 500, y: 360 }, br: { x: 330, y: 430 }, au: { x: 870, y: 470 } };
    var hub = center('ae') || FALLBACK.hub;
    var targets = {};
    REGION_ORDER.forEach(function (k) { targets[k] = center(REGIONS[k].anchor) || FALLBACK[REGIONS[k].anchor] || { x: hub.x, y: hub.y }; });

    // Routes
    REGION_ORDER.forEach(function (k) {
      var t = targets[k];
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('class', 'ov-route'); p.setAttribute('data-r', k);
      var mx = (hub.x + t.x) / 2, my = Math.min(hub.y, t.y) - 46;
      p.setAttribute('d', 'M' + hub.x + ' ' + hub.y + ' Q ' + mx + ' ' + my + ' ' + t.x + ' ' + t.y);
      overlay.appendChild(p);
    });
    // Hub (Dubai)
    var hg = document.createElementNS(SVGNS, 'g'); hg.setAttribute('class', 'ov-hub');
    var ring = document.createElementNS(SVGNS, 'circle'); ring.setAttribute('class', 'hub-ring'); ring.setAttribute('cx', hub.x); ring.setAttribute('cy', hub.y); ring.setAttribute('r', 9);
    var hd = document.createElementNS(SVGNS, 'circle'); hd.setAttribute('class', 'hub-dot'); hd.setAttribute('cx', hub.x); hd.setAttribute('cy', hub.y); hd.setAttribute('r', 4);
    var ht = document.createElementNS(SVGNS, 'text'); ht.setAttribute('x', hub.x); ht.setAttribute('y', hub.y + 20); ht.setAttribute('text-anchor', 'middle'); ht.textContent = 'Dubai';
    hg.appendChild(ring); hg.appendChild(hd); hg.appendChild(ht); overlay.appendChild(hg);
    // Markers
    REGION_ORDER.forEach(function (k) {
      var t = targets[k], r = REGIONS[k];
      var g = document.createElementNS(SVGNS, 'g'); g.setAttribute('class', 'map-marker'); g.setAttribute('data-r', k);
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', r.name);
      var halo = document.createElementNS(SVGNS, 'circle'); halo.setAttribute('class', 'm-halo'); halo.setAttribute('cx', t.x); halo.setAttribute('cy', t.y); halo.setAttribute('r', 10);
      var dot = document.createElementNS(SVGNS, 'circle'); dot.setAttribute('class', 'm-dot'); dot.setAttribute('cx', t.x); dot.setAttribute('cy', t.y); dot.setAttribute('r', 4.5);
      var tx = document.createElementNS(SVGNS, 'text'); tx.setAttribute('x', t.x); tx.setAttribute('y', t.y - 12); tx.setAttribute('text-anchor', 'middle'); tx.textContent = r.name;
      g.appendChild(halo); g.appendChild(dot); g.appendChild(tx); overlay.appendChild(g);
      g.addEventListener('click', function () { selectRegion(k); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRegion(k); } });
    });

    // Country id -> region (click real countries)
    var idToRegion = {};
    REGION_ORDER.forEach(function (k) { REGIONS[k].countries.forEach(function (c) { idToRegion[c] = k; }); });
    svg.addEventListener('click', function (e) {
      var p = e.target.closest ? e.target.closest('path') : null;
      if (p && idToRegion[p.id]) selectRegion(idToRegion[p.id]);
    });

    window.__selectRegion = selectRegion;
    function selectRegion(key, silent) {
      var r = REGIONS[key]; if (!r) return;
      var prev = svg.querySelectorAll('path.rg-active');
      for (var i = 0; i < prev.length; i++) prev[i].classList.remove('rg-active');
      r.countries.forEach(function (c) { var el = svg.getElementById ? svg.getElementById(c) : svg.querySelector('#' + c); if (el) el.classList.add('rg-active'); });
      overlay.querySelectorAll('.ov-route').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-r') === key); });
      overlay.querySelectorAll('.map-marker').forEach(function (m) { m.classList.toggle('active', m.getAttribute('data-r') === key); });
      var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
      set('mapTitle', r.name); set('mapText', r.text); set('mapS1', r.s1); set('mapS2', r.s2);
      if (!silent) playRegion(key);
    }
    selectRegion('oriente', true);
    var loading = document.getElementById('mapLoading'); if (loading) loading.classList.add('hide');
  }

  // Sound mute toggle
  var soundBtn = document.getElementById('mapSound');
  if (soundBtn) {
    function paintSound() { soundBtn.textContent = muted ? '🔇 Som' : '🔊 Som'; soundBtn.classList.toggle('muted', muted); }
    paintSound();
    soundBtn.addEventListener('click', function () {
      muted = !muted; try { localStorage.setItem('lma_muted', muted ? '1' : '0'); } catch (e) {}
      paintSound(); if (!muted) { ensureAudio(); }
    });
  }

  /* ---------- Simulator ---------- */
  var profitInput = document.getElementById('simProfit');
  if (profitInput) {
    var range = document.getElementById('simRange');
    var profitLabel = document.getElementById('simProfitLabel');
    var regimeOpts = document.getElementById('regimeOpts');
    var rate = 0.34;

    function fmt(n) {
      return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
    }
    function parseNum(str) {
      var digits = (str || '').replace(/\D/g, '');
      return digits ? parseInt(digits, 10) : 0;
    }
    function compute() {
      var profit = parseNum(profitInput.value);
      var brTax = profit * rate;
      var uaeTax = 0; // Free Zone qualificada
      var saveYear = brTax - uaeTax;
      document.getElementById('simSavingYear').textContent = fmt(saveYear);
      document.getElementById('simSaving5').textContent = fmt(saveYear * 5);
      document.getElementById('simBrVal').textContent = fmt(brTax);
      document.getElementById('simUaeVal').textContent = fmt(uaeTax);
      document.getElementById('simBrBar').style.width = '100%';
      document.getElementById('simUaeBar').style.width = (brTax > 0 ? Math.max(2, (uaeTax / brTax) * 100) : 2) + '%';
      profitLabel.textContent = fmt(profit);
      // Update CTA message with the numbers
      var cta = document.getElementById('simCta');
      if (cta) {
        var msg = 'Ola! Simulei no site do Clube de Negocios LMA: lucro anual de ' + fmt(profit) +
          ', economia estimada de ' + fmt(saveYear) + ' por ano (' + fmt(saveYear * 5) +
          ' em 5 anos). Quero uma analise detalhada.';
        cta.setAttribute('data-msg', msg); bindWa(cta);
      }
    }
    function setFromNumber(n) {
      n = Math.max(0, n);
      profitInput.value = n.toLocaleString('pt-BR');
      if (range) range.value = Math.min(parseInt(range.max, 10), Math.max(parseInt(range.min, 10), n));
      compute();
    }
    profitInput.addEventListener('input', function () {
      var n = parseNum(profitInput.value);
      profitInput.value = n ? n.toLocaleString('pt-BR') : '';
      if (range) range.value = Math.min(parseInt(range.max, 10), Math.max(parseInt(range.min, 10), n));
      compute();
    });
    if (range) range.addEventListener('input', function () { setFromNumber(parseInt(range.value, 10)); });
    if (regimeOpts) {
      regimeOpts.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          regimeOpts.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          rate = parseFloat(b.getAttribute('data-rate'));
          compute();
        });
      });
    }
    compute();
  }

  /* ---------- Exit-intent popup ---------- */
  var popup = document.getElementById('exitPopup');
  var closedPopup = false;
  function showPopup() {
    if (closedPopup || !popup) return;
    if (sessionStorage.getItem('lma_exit_shown')) return;
    popup.classList.add('show');
    try { sessionStorage.setItem('lma_exit_shown', '1'); } catch (e) {}
  }
  function hidePopup() { if (popup) { popup.classList.remove('show'); closedPopup = true; } }
  if (popup) {
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) showPopup(); });
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (lastY - y > 60 && y > 500) showPopup();
      lastY = y;
    }, { passive: true });
    setTimeout(showPopup, 45000);
    document.getElementById('exitClose').addEventListener('click', hidePopup);
    popup.addEventListener('click', function (e) { if (e.target === popup) hidePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hidePopup(); });
    popup.querySelectorAll('.js-wa').forEach(function (a) { a.addEventListener('click', hidePopup); });
  }

  /* ---------- Cookie banner (LGPD) ---------- */
  var cookie = document.getElementById('cookieBanner');
  if (cookie) {
    var decision = localStorage.getItem('lma_cookie_consent');
    if (!decision) { setTimeout(function () { cookie.classList.add('show'); }, 1200); }
    function setConsent(v) {
      try { localStorage.setItem('lma_cookie_consent', v); } catch (e) {}
      cookie.classList.remove('show');
    }
    var acc = document.getElementById('cookieAccept'); if (acc) acc.addEventListener('click', function () { setConsent('accepted'); });
    var rej = document.getElementById('cookieReject'); if (rej) rej.addEventListener('click', function () { setConsent('rejected'); });
  }

  /* ---------- Year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

})();

/* Caleb Smith — Portfolio v2 */
(function () {
    'use strict';

    var supportsHover = window.matchMedia('(hover: hover)').matches;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Scroll progress + navbar */
    var progressBar = document.getElementById('scrollProgress');
    var navbar = document.getElementById('navbar');
    function onScroll() {
        var s = window.scrollY;
        var d = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.width = (d > 0 ? (s / d) * 100 : 0) + '%';
        if (navbar) navbar.classList.toggle('scrolled', s > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile nav */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        navLinks.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* Reveal on scroll */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var ro = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var el = e.target;
                    var delay = parseInt(el.dataset.delay || '0', 10);
                    setTimeout(function () { el.classList.add('visible'); }, delay);
                    ro.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { ro.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* Active nav on scroll */
    var sections = document.querySelectorAll('main section[id]');
    var navAnchors = document.querySelectorAll('.nav-link');
    if ('IntersectionObserver' in window && sections.length) {
        var no = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    navAnchors.forEach(function (a) {
                        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.4 });
        sections.forEach(function (s) { no.observe(s); });
    }

    /* Stat counters */
    var stats = document.querySelectorAll('.stat-num');
    function count(el) {
        var t = parseInt(el.dataset.target || '0', 10);
        var sf = el.dataset.suffix || '';
        var dur = 1500;
        var start = performance.now();
        function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(t * eased) + sf;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window && stats.length) {
        var so = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { count(e.target); so.unobserve(e.target); }
            });
        }, { threshold: 0.5 });
        stats.forEach(function (el) { so.observe(el); });
    }

    /* Custom cursor */
    if (supportsHover && !reducedMotion) {
        var dot = document.getElementById('cursorDot');
        var ring = document.getElementById('cursorRing');
        if (dot && ring) {
            var mx = 0, my = 0, rx = 0, ry = 0, active = false;
            window.addEventListener('mousemove', function (e) {
                mx = e.clientX; my = e.clientY;
                dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
                if (!active) { dot.classList.add('active'); ring.classList.add('active'); active = true; }
            });
            document.addEventListener('mouseleave', function () {
                dot.classList.remove('active'); ring.classList.remove('active'); active = false;
            });
            (function loop() {
                rx += (mx - rx) * 0.18;
                ry += (my - ry) * 0.18;
                ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
                requestAnimationFrame(loop);
            })();
            var h = document.querySelectorAll('a,button,.project-card,.stack-col,.approach-card,.stat-card');
            h.forEach(function (el) {
                el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
                el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
            });
        }
    }

    /* Magnetic buttons */
    if (supportsHover && !reducedMotion) {
        document.querySelectorAll('.magnetic').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = e.clientX - r.left - r.width / 2;
                var y = e.clientY - r.top - r.height / 2;
                el.style.transform = 'translate(' + (x * 0.22) + 'px,' + (y * 0.22) + 'px)';
            });
            el.addEventListener('mouseleave', function () { el.style.transform = ''; });
        });
    }

    /* Project card tilt */
    if (supportsHover && !reducedMotion) {
        document.querySelectorAll('.project-card').forEach(function (card) {
            var raf = null;
            card.addEventListener('mousemove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    var r = card.getBoundingClientRect();
                    var x = e.clientX - r.left, y = e.clientY - r.top;
                    var rx = ((y - r.height / 2) / (r.height / 2)) * -3;
                    var ry = ((x - r.width / 2) / (r.width / 2)) * 3;
                    card.style.transform = 'translateY(-6px) perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
                    raf = null;
                });
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
    }

    /* Glow parallax */
    if (!reducedMotion) {
        var glows = document.querySelectorAll('.glow');
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var y = window.scrollY;
                    glows.forEach(function (g, i) {
                        g.style.transform = 'translateY(' + (y * (i === 0 ? 0.15 : -0.1)) + 'px)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
})();

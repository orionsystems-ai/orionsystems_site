(function () {
    'use strict';

    var hasMouse = window.matchMedia('(pointer: fine)').matches;

    // --- Header scroll ---
    var header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }, { passive: true });

    // --- Mobile nav ---
    var navToggle = document.getElementById('nav-toggle');
    var nav = navToggle ? navToggle.closest('.nav') : null;
    var navList = document.getElementById('nav-list');
    var navCta = nav ? nav.querySelector('.nav__cta') : null;

    if (navToggle && nav && navList && navCta) {
        var ctaMobileClone = navCta.cloneNode(true);
        ctaMobileClone.classList.add('nav__cta--mobile');
        var ctaLi = document.createElement('li');
        ctaLi.appendChild(ctaMobileClone);
        navList.appendChild(ctaLi);

        navToggle.addEventListener('click', function () {
            nav.classList.toggle('nav--open');
        });
        document.querySelectorAll('.nav__link, .nav__cta--mobile').forEach(function (link) {
            link.addEventListener('click', function () { nav.classList.remove('nav--open'); });
        });
    }

    // --- Accordion ---
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var item = this.closest('.accordion__item');
            var isActive = item.classList.contains('accordion__item--active');

            document.querySelectorAll('.accordion__item--active').forEach(function (ai) {
                ai.classList.remove('accordion__item--active');
                ai.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('accordion__item--active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Reveal on scroll ---
    var reveals = document.querySelectorAll('.reveal-up');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-up--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('reveal-up--visible'); });
    }

    // --- Counter animation ---
    var counters = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }

    function animateCounter(el, target) {
        if (target === 0) { el.textContent = '0'; return; }
        var duration = 3000;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // --- 3D Tilt on cards ---
    if (hasMouse) {
        document.querySelectorAll('.tilt-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -4;
                var rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // --- Particles ---
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer && hasMouse) {
        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.style.cssText = 'position:absolute;width:2px;height:2px;background:rgba(245,166,35,' + (Math.random() * 0.3 + 0.1) + ');border-radius:50%;top:' + Math.random() * 100 + '%;left:' + Math.random() * 100 + '%;animation:particleFloat ' + (Math.random() * 10 + 10) + 's ease-in-out infinite ' + (Math.random() * 5) + 's;';
            particlesContainer.appendChild(particle);
        }

        var style = document.createElement('style');
        style.textContent = '@keyframes particleFloat{0%,100%{transform:translate(0,0);opacity:0.3}25%{transform:translate(' + (Math.random()*30-15) + 'px,' + (Math.random()*-40) + 'px);opacity:0.8}50%{transform:translate(' + (Math.random()*20-10) + 'px,' + (Math.random()*-20) + 'px);opacity:0.4}75%{transform:translate(' + (Math.random()*-30) + 'px,' + (Math.random()*30-15) + 'px);opacity:0.7}}';
        document.head.appendChild(style);
    }

    // --- Flow steps progression ---
    var flowSection = document.getElementById('flow-section');
    if (flowSection) {
        var flowSteps = flowSection.querySelectorAll('.flow__step');
        var flowConnectors = flowSection.querySelectorAll('.flow__connector');
        var flowTriggered = false;

        function lightUpFlow() {
            if (flowTriggered) return;
            flowTriggered = true;

            var animDuration = 2000;

            function resetAll() {
                flowSteps.forEach(function (step) {
                    step.classList.remove('flow__step--lit');
                });
                flowConnectors.forEach(function (c) {
                    c.classList.remove('flow__connector--lit');
                });
            }

            function runSequence() {
                resetAll();

                flowSteps[0].classList.add('flow__step--lit');

                setTimeout(function () {
                    flowConnectors[0].classList.add('flow__connector--lit');
                }, 400);

                setTimeout(function () {
                    flowSteps[1].classList.add('flow__step--lit');
                    flowConnectors[0].classList.remove('flow__connector--lit');
                }, 400 + animDuration);

                setTimeout(function () {
                    flowConnectors[1].classList.add('flow__connector--lit');
                }, 400 + animDuration + 400);

                setTimeout(function () {
                    flowSteps[2].classList.add('flow__step--lit');
                    flowConnectors[1].classList.remove('flow__connector--lit');
                }, 400 + animDuration + 400 + animDuration);

                setTimeout(function () {
                    resetAll();
                }, 400 + animDuration + 400 + animDuration + 1200);

                setTimeout(runSequence, 400 + animDuration + 400 + animDuration + 2000);
            }

            runSequence();
        }

        var flowObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    lightUpFlow();
                    flowObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        flowObserver.observe(flowSection);
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Parallax on orbs ---
    window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        var orbs = document.querySelectorAll('.hero__orb');
        orbs.forEach(function (orb, i) {
            var speed = (i + 1) * 0.03;
            orb.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
        });
    }, { passive: true });

    // --- Modal ---
    var modal = document.getElementById('form-modal');
    var modalClose = document.getElementById('modal-close');

    function showModal(type, title, text) {
        var iconEl = document.getElementById('modal-icon');
        var titleEl = document.getElementById('modal-title');
        var textEl = document.getElementById('modal-text');

        modal.className = 'modal modal--visible modal--' + type;
        titleEl.textContent = title;
        textEl.textContent = text;

        if (type === 'success') {
            iconEl.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        } else {
            iconEl.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        }
    }

    function closeModal() {
        modal.classList.remove('modal--visible');
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
    }

    // --- Contact form → Google Sheets + Gmail ---
    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-I-WeQi1jm5atbx04Zooz-qz5llO3Kt7HZShu7tRh7vzRCnCU4qgPEVZwjtGLBAV8aQ/exec';

    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var isValid = form.checkValidity();
            if (!isValid) { form.reportValidity(); return; }

            var submitBtn = form.querySelector('.form__submit');
            var btnSpan = submitBtn.querySelector('span');
            var btnSvg = submitBtn.querySelector('svg');
            btnSpan.textContent = 'Envoi en cours...';
            btnSvg.style.display = 'none';
            submitBtn.disabled = true;

            var payload = {
                name: form.querySelector('[name="name"]').value,
                entreprise: form.querySelector('[name="entreprise"]').value,
                email: form.querySelector('[name="email"]').value,
                phone: form.querySelector('[name="phone"]').value,
                demande: form.querySelector('[name="demande"]').value,
                message: form.querySelector('[name="message"]').value,
                website: form.querySelector('[name="website"]').value
            };

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    form.reset();
                    btnSpan.textContent = 'Envoyer le message';
                    btnSvg.style.display = '';
                    submitBtn.disabled = false;
                    showModal('success', 'Message envoyé !', 'Votre demande a bien été transmise. Nous vous recontacterons sous 48h.');
                } else {
                    throw new Error('Erreur serveur');
                }
            })
            .catch(function () {
                btnSpan.textContent = 'Envoyer le message';
                btnSvg.style.display = '';
                submitBtn.disabled = false;
                showModal('error', 'Erreur d\'envoi', 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement par email.');
            });
        });
    }


    // --- Video hero : forcer la lecture, et la masquer si impossible (iOS eco) ---
    var heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
        var showV = function () { heroVideo.style.opacity = '0.3'; };
        var hideV = function () { heroVideo.style.opacity = '0'; };
        heroVideo.addEventListener('playing', showV);
        var tryPlay = function () {
            var pr = heroVideo.play();
            if (pr && pr.catch) { pr.catch(hideV); }
        };
        tryPlay();
        // Si toujours en pause peu apres (mode eco iOS), on masque -> on voit l'image de fond, pas le bouton pause.
        setTimeout(function () { if (heroVideo.paused) { hideV(); } }, 700);
        ['touchstart', 'click', 'scroll', 'keydown'].forEach(function (ev) {
            window.addEventListener(ev, tryPlay, { once: true, passive: true });
        });
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) { tryPlay(); }
        });
    }

})();

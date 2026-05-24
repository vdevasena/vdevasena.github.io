(function () {
	'use strict';

	const $ = (sel, ctx) => (ctx || document).querySelector(sel);
	const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

	// Year
	const yearEl = $('#year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	// Nav: scroll state
	const nav = $('#nav');
	const onScroll = () => {
		if (window.scrollY > 30) nav.classList.add('is-scrolled');
		else nav.classList.remove('is-scrolled');
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// Nav: mobile toggle
	const toggle = $('.nav__toggle');
	const links = $('.nav__links');
	if (toggle && links) {
		toggle.addEventListener('click', () => {
			const open = links.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
		links.addEventListener('click', (e) => {
			if (e.target.tagName === 'A') {
				links.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
			}
		});
	}

	// Reveal on scroll
	const revealEls = $$('.reveal');
	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
		);
		revealEls.forEach((el) => io.observe(el));
	} else {
		revealEls.forEach((el) => el.classList.add('is-visible'));
	}

	// Project filters
	const filters = $$('.filter');
	const projects = $$('.project');
	filters.forEach((btn) => {
		btn.addEventListener('click', () => {
			filters.forEach((f) => f.classList.remove('is-active'));
			btn.classList.add('is-active');
			const tag = btn.dataset.filter;
			projects.forEach((p) => {
				const tags = (p.dataset.tags || '').split(/\s+/);
				const show = tag === 'all' || tags.includes(tag);
				p.classList.toggle('is-hidden', !show);
			});
		});
	});

	// Smooth scroll offset for fixed nav (native smooth-scroll handles most;
	// this just nudges focus so #anchors don't hide behind the bar)
	document.addEventListener('click', (e) => {
		const a = e.target.closest('a[href^="#"]');
		if (!a) return;
		const id = a.getAttribute('href');
		if (id === '#' || id.length < 2) return;
		const target = document.querySelector(id);
		if (!target) return;
		e.preventDefault();
		const top = target.getBoundingClientRect().top + window.scrollY - 70;
		window.scrollTo({ top, behavior: 'smooth' });
	});
})();

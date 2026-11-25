// Hamburger menu for small screens
(function () {
	var nav = document.getElementById('site-nav');
	var button = nav && nav.querySelector('.nav-toggle');
	if (!button) return;

	function isOpen() {
		return nav.classList.contains('open');
	}

	function setOpen(open) {
		nav.classList.toggle('open', open);
		button.setAttribute('aria-expanded', String(open));
		button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	}

	button.addEventListener('click', function () {
		setOpen(!isOpen());
	});

	nav.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', function () {
			setOpen(false);
		});
	});

	document.addEventListener('click', function (event) {
		if (isOpen() && !nav.contains(event.target)) setOpen(false);
	});

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' && isOpen()) {
			setOpen(false);
			button.focus();
		}
	});

	// Don't leave the menu "open" when the window grows to the desktop layout
	window.matchMedia('(min-width: 48.01rem)').addEventListener('change', function () {
		setOpen(false);
	});
})();

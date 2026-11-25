/* =====================================================================
   SITE SETTINGS

   Change COLOR_SCHEME to switch the colours of the whole site.
   The available schemes live in styles/colors.css ("orange", "purple", ...).
   Visitors can't change this, they only choose light / dark / follow-device.
   ===================================================================== */
var COLOR_SCHEME = 'purple';


(function () {
	var root = document.documentElement;
	var STORAGE_KEY = 'theme-mode';
	var MODES = ['system', 'light', 'dark'];
	var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	root.classList.add('js');
	root.dataset.scheme = COLOR_SCHEME;

	function readMode() {
		try {
			var saved = localStorage.getItem(STORAGE_KEY);
			return MODES.indexOf(saved) > -1 ? saved : 'system';
		} catch (error) {
			return 'system';
		}
	}

	function saveMode(value) {
		try {
			if (value === 'system') localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, value);
		} catch (error) { /* storage can be blocked, the choice just won't be remembered */ }
	}

	var mode = readMode();

	function apply() {
		var resolved = mode === 'system' ? (darkQuery.matches ? 'dark' : 'light') : mode;
		root.dataset.theme = resolved;
		root.dataset.themeMode = mode;

		// Colour the browser's address bar to match
		var meta = document.querySelector('meta[name="theme-color"]');
		var background = getComputedStyle(root).getPropertyValue('--bg').trim();
		if (meta && background) meta.setAttribute('content', background);

		document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
			button.setAttribute('aria-pressed', String(button.dataset.themeChoice === mode));
		});
	}

	// Apply before the page paints so there's no flash of the wrong theme
	apply();

	darkQuery.addEventListener('change', function () {
		if (mode === 'system') apply();
	});

	// Keep other open tabs in sync
	window.addEventListener('storage', function (event) {
		if (event.key !== STORAGE_KEY) return;
		mode = readMode();
		apply();
	});

	var ICONS = {
		system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
		light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
		dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
	};
	var LABELS = {
		system: 'Match my device',
		light: 'Light theme',
		dark: 'Dark theme'
	};

	document.addEventListener('DOMContentLoaded', function () {
		var tools = document.querySelector('.header-tools');
		if (!tools) return;

		var group = document.createElement('div');
		group.className = 'theme-switch';
		group.setAttribute('role', 'group');
		group.setAttribute('aria-label', 'Colour theme');

		MODES.forEach(function (choice) {
			var button = document.createElement('button');
			button.type = 'button';
			button.dataset.themeChoice = choice;
			button.setAttribute('aria-label', LABELS[choice]);
			button.title = LABELS[choice];
			button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[choice] + '</svg>';

			button.addEventListener('click', function () {
				mode = choice;
				saveMode(choice);
				if (!reduceMotion.matches) {
					root.classList.add('theme-transition');
					setTimeout(function () { root.classList.remove('theme-transition'); }, 400);
				}
				apply();
			});

			group.appendChild(button);
		});

		tools.appendChild(group);
		apply();
	});
})();

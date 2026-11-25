// Easter egg: click the "Cat" in "Catnatsuki" to chase a laser pointer
(function () {
	var trigger = document.querySelector('.cat-trigger');
	var hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	if (!trigger || !hasMouse) return;

	var STORAGE_KEY = 'cat-mode';
	var CATCH_RADIUS = 36;
	var MIN_JUMP = 260;
	var EDGE = 40;

	// 16x12 pixel cat face: d = outline, o = fur, e = eyes, p = nose
	var PIXELS = [
		'.d............d.',
		'.dd..........dd.',
		'.dod........dod.',
		'.dooddddddddood.',
		'.dooooooooooood.',
		'.dooeeooooeeood.',
		'.dooeeooooeeood.',
		'.dooooooooooood.',
		'.dooooopppooood.',
		'.dooodoooodoood.',
		'.dooooooooooood.',
		'..dddddddddddd..'
	];

	// Fur and outline follow the current colour scheme
	function colors() {
		var styles = getComputedStyle(document.documentElement);
		return {
			d: styles.getPropertyValue('--ink').trim() || '#725a42',
			o: styles.getPropertyValue('--accent').trim() || '#F39519',
			e: '#3b2a1a',
			p: '#f27a9c'
		};
	}

	function cursorValue() {
		var palette = colors();
		var rects = '';
		PIXELS.forEach(function (row, y) {
			row.split('').forEach(function (cell, x) {
				if (palette[cell]) {
					rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + palette[cell] + '"/>';
				}
			});
		});
		var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 16 12" shape-rendering="crispEdges">' + rects + '</svg>';
		return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 16 12, auto';
	}

	var style = document.createElement('style');
	document.head.appendChild(style);

	function paintCursor() {
		style.textContent = 'html.cat-mode, html.cat-mode * { cursor: ' + cursorValue() + ' !important; }';
	}

	paintCursor();
	new MutationObserver(paintCursor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-scheme'] });

	var laser = document.createElement('div');
	laser.className = 'cat-laser';
	laser.setAttribute('aria-hidden', 'true');
	laser.hidden = true;
	document.body.appendChild(laser);

	var active = false;
	var last = { x: -1000, y: -1000 };

	function distanceToSegment(px, py, ax, ay, bx, by) {
		var dx = bx - ax;
		var dy = by - ay;
		var lengthSquared = dx * dx + dy * dy;
		var t = lengthSquared ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared)) : 0;
		return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
	}

	function place(x, y) {
		laser.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
		laser.dataset.x = x;
		laser.dataset.y = y;
		// Restart the little pop animation
		laser.classList.remove('pop');
		void laser.offsetWidth;
		laser.classList.add('pop');
	}

	// Pick a spot well away from the cursor, so it never respawns under it
	function respawn() {
		var width = window.innerWidth - EDGE * 2;
		var height = window.innerHeight - EDGE * 2;
		var best = null;
		var bestDistance = -1;

		for (var i = 0; i < 25; i++) {
			var x = EDGE + Math.random() * Math.max(width, 1);
			var y = EDGE + Math.random() * Math.max(height, 1);
			var distance = Math.hypot(x - last.x, y - last.y);
			if (distance > bestDistance) {
				best = { x: x, y: y };
				bestDistance = distance;
			}
			if (distance >= MIN_JUMP) break;
		}
		place(best.x, best.y);
	}

	function onMove(event) {
		var from = last;
		last = { x: event.clientX, y: event.clientY };
		if (!active || laser.hidden) return;

		var x = parseFloat(laser.dataset.x);
		var y = parseFloat(laser.dataset.y);
		if (distanceToSegment(x, y, from.x, from.y, last.x, last.y) < CATCH_RADIUS) respawn();
	}

	function onResize() {
		var x = parseFloat(laser.dataset.x);
		var y = parseFloat(laser.dataset.y);
		if (x > window.innerWidth - EDGE || y > window.innerHeight - EDGE) respawn();
	}

	function setActive(on) {
		active = on;
		document.documentElement.classList.toggle('cat-mode', on);
		laser.hidden = !on;
		if (on) {
			respawn();
			document.addEventListener('mousemove', onMove);
			window.addEventListener('resize', onResize);
		} else {
			document.removeEventListener('mousemove', onMove);
			window.removeEventListener('resize', onResize);
		}
		try {
			sessionStorage.setItem(STORAGE_KEY, on ? '1' : '');
		} catch (error) { /* storage can be blocked, the egg still works */ }
	}

	trigger.addEventListener('click', function (event) {
		event.preventDefault();
		last = { x: event.clientX, y: event.clientY };
		setActive(!active);
	});

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' && active) setActive(false);
	});

	// Keep the cat around while the visitor moves between pages
	try {
		if (sessionStorage.getItem(STORAGE_KEY)) setActive(true);
	} catch (error) { /* ignore */ }
})();

// Gallery carousels
(function () {
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	document.querySelectorAll('.carousel').forEach(function (element) {
		new Flickity(element, {
			cellAlign: 'center',
			wrapAround: true,
			setGallerySize: false,
			selectedAttraction: 0.03,
			friction: 0.2,
			autoPlay: reduceMotion ? false : 6000,
			pauseAutoPlayOnHover: true,
		});
	});
})();

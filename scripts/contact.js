// Turns the contact form into a pre-filled email in the visitor's own mail app
(function () {
	var form = document.getElementById('contact-form');
	if (!form) return;

	var status = document.getElementById('form-status');
	var address = form.dataset.address;

	function say(message) {
		if (status) status.textContent = message;
	}

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		var name = form.elements.name.value.trim();
		var subject = form.elements.subject.value.trim() || 'Hello from your website :D';
		var message = form.elements.body.value.trim();

		var body = message;
		if (name) body += '\n\n' + name;

		var url = 'mailto:' + address +
			'?subject=' + encodeURIComponent(subject) +
			'&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n'));

		window.location.href = url;
		say('Opening your email app… If nothing happened, copy my address and write to me from wherever you like!');
	});

	var copy = document.getElementById('copy-email');
	if (!copy) return;

	copy.addEventListener('click', function () {
		if (!navigator.clipboard) {
			say('Copying isn\'t available here, but my address is ' + address + '.');
			return;
		}

		navigator.clipboard.writeText(address).then(function () {
			say('Copied ' + address + ' to your clipboard!');
		}, function () {
			say('Couldn\'t copy automatically, my address is ' + address + '.');
		});
	});
})();

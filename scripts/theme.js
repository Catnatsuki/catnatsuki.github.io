var contrast = 'lav';
function toggle_contrast() {
	if(contrast == 'lav') {
		document.body.classList.remove('lav');
		document.body.classList.add('mint');
		contrast = 'mint';
	}
	else {
		document.body.classList.remove('mint');
		document.body.classList.add('lav');
		contrast = 'lav';
	}
}

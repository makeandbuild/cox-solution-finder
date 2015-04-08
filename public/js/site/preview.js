console.log('PREVIEW MODE ACTIVATION!');
$('body').on('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log('STOPPED IT?!')
	return false;
});

$('body.showroom').addClass('preview');
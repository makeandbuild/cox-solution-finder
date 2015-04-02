	$(function () {
  		$('[data-toggle="tooltip"]').tooltip();
	});

	$('input[type=file]').on('change', function(e) {
		console.log(e);
		console.log(this);
		file = e.target.files[0];
		reader = new FileReader();

		$(reader).on('load', function(event) {
			$('.img-responsive').attr('src', event.target.result);
		});

  		reader.readAsDataURL(file);

		
	});

	$('.preview').on('click', function(e) {
		$(this).parents('form').find('input[name="action"]').val('preview');
		$(this).parents('form').submit();
	});
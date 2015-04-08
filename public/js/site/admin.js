	$('input[type=file]').on('change', function(e) {
		file = e.target.files[0];
		reader = new FileReader();
		console.log(e.target.files);
		$(reader).on('load', function(event) {
			$('.img-responsive').attr('src', event.target.result);
		});

  		reader.readAsDataURL(file);

  		$(e.target).siblings('input:text').val(e.target.files[0]['name']);
  		$(e.target).siblings('input[name$="_newfile"]').val(true);

		
	});

	$('.preview').on('click', function(e) {
		previewLink = this;

		$(this).parents('form').find('input[name="action"]').val('preview');
		
		previewModeInput = $('<input type="hidden" name="previewMode">').val($(previewLink).data('mode'));
		$(this).parents('form').append(previewModeInput);

		$(this).parents('form').submit();

	});

	$('.s3button').on('click', function(e) {
		e.preventDefault();
		$(this).siblings('input:file').click();
		console.log('CLICK THE S3');
	});

	$('.icon-choices li').on('click', function(e) {
		if(!$(e.currentTarget).hasClass('selected')) {
			choice = $(e.currentTarget).data('value');
			$(e.currentTarget).parent().siblings('.icon-selector').val(choice);
			$(e.currentTarget).siblings().removeClass('selected');
			$(e.currentTarget).addClass('selected');
		}

	});

	$('.delete-resource').on('click', function(e) {
		$(e.target).parents('.resource').find(':input').each(function(index, input) {
			$(input).val('');
			$(input).attr('checked', false);
		});
		$(e.target).parents('.resource').find('ul.icon-choices li').removeClass('selected');
		$(e.target).parents('.resource').slideUp(function() {
			if($('.resources').siblings('.resource:hidden').length > 0) {
				console.log(11);
				$('.resources').find('.add-resource').attr('disabled', false);
			}			
		});
	});

	$('.add-resource').on('click', function(e) {
		console.log($(e.target).parents('.resources').find('.resource:hidden'));
		$(e.target).parents('.resources').siblings('.resource:hidden').first().slideDown();
		if($(e.target).parents('.resources').siblings('.resource:hidden').length == 0) {
			$(e.target).attr('disabled', true);
		}
	});

	$(function(){
		$('.resource').find('input.text-field').each(function(index, input) {
			if($(input).val().trim() == '') {
				$(input).parents('.resource').hide();
			}
		});

		if($('.resources').siblings('.resource:hidden').length == 0) {
			$('.resources').find('.add-resource').attr('disabled', true);
		}

		$('.multi-select').each(function(index, select) {
			$(select).multiSelect();
			$('.multi-select').siblings('.ms-container').find('.ms-selectable').prepend('<h5>Industries</h5>');
			$('.multi-select').siblings('.ms-container').find('.ms-selection').prepend('<h5>Selected Industries</h5>');
		});
	});
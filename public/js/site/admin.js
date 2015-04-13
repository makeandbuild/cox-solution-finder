	// Submit a preview
	$('.preview').on('click', function(e) {
		previewLink = this;

		$(this).parents('form').find('input[name="action"]').val('preview');
		
		previewModeInput = $('<input type="hidden" name="previewMode">').val($(previewLink).data('mode'));
		$(this).parents('form').append(previewModeInput);

		$(this).parents('form').submit();

	});

	// S3 File Chooser Functions
	$('input[type=file]').on('change', function(e) {
		file = e.target.files[0];
		reader = new FileReader();
		console.log(e.target.files);

		if(file.type.indexOf('image') >= 0) {
			console.log('image');
			$(reader).on('load', function(event) {
				image = $(e.target).parents('.row').siblings('.thumbnail-row').find('img');
				if(image.length > 0) {
					$(image).attr('src', event.target.result);
				} else {
			  		$(e.target).parents('.row').siblings('.thumbnail-row').children().first().append('<img class="img-responsive img-thumbnail" />')
	  		  		$(e.target).parents('.row').siblings('.thumbnail-row').find('img').attr('src', event.target.result);
				}
			});
		}

		if(file.type.indexOf('video') >=0) {
			console.log('video');
			$(reader).on('load', function(event) {
				video = $(e.target).parents('.row').siblings('.thumbnail-row').find('video');
				if(video.length > 0) {
					$(video).remove();
				}
		  		$(e.target).parents('.row').siblings('.thumbnail-row').children().first().append('<video controls preload="auto"><source src="' + event.target.result + '" type="' + file.type + '" /></video>');
			});			
		}

  		reader.readAsDataURL(file);

  		$(e.target).siblings('input:text').val(e.target.files[0]['name']);
  		$(e.target).siblings('input[name$="_newfile"]').val(true);
		
	});

	$('.s3button').on('click', function(e) {
		e.preventDefault();
		$(this).siblings('input:file').click();
	});

	// SVG Icon Chooser
	$('.icon-choices li').on('click', function(e) {
		if(!$(e.currentTarget).hasClass('selected')) {
			choice = $(e.currentTarget).data('value');
			$(e.currentTarget).parent().siblings('.icon-selector').val(choice);
			$(e.currentTarget).siblings().removeClass('selected');
			$(e.currentTarget).addClass('selected');
		}

	});

	// Add/Remove Resource Panels
	$('.delete-resource').on('click', function(e) {
		$(e.target).parents('.resource').find(':input').each(function(index, input) {
			$(input).val('');
			$(input).attr('checked', false);
		});
		$(e.target).parents('.resource').find('ul.icon-choices li').removeClass('selected');
		$(e.target).parents('.resource').slideUp(function() {
			if($('.resources').siblings('.resource:hidden').length > 0) {
				$('.resources').find('.add-resource').attr('disabled', false);
			}			
		});
	});

	$('.add-resource').on('click', function(e) {
		$(e.target).parents('.resources').siblings('.resource:hidden').first().slideDown();
		if($(e.target).parents('.resources').siblings('.resource:hidden').length == 0) {
			$(e.target).attr('disabled', true);
		}
	});

	// Media Buffet Tabs
	$('.mb-tabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})


	// Media Buffet Type Selector Functions
	function mediaBuffetTypeSelector(selectField) {
		var val = '.' + $(selectField).val().toLowerCase();

		$(selectField).parent().siblings().not('.no-hide').hide();
		$(selectField).parent().siblings(val).show();

	}
	if($('.mb-select').length > 0) {
		$('.mb-select').on('change', function(e){ mediaBuffetTypeSelector(e.target) });
		mediaBuffetTypeSelector($('.mb-select'));
	}

	// Media Buffet Title Handlers
	$('.mb-title').find('input:visible').on('keyup', function(e) {
		var plain = $(e.target).parents('.mb-title').find('.mb-title-plain').val();
		var bold = $(e.target).parents('.mb-title').find('.mb-title-bold').val();
		var formatted = '<p>' + plain + '<strong>' + bold + '</strong></p>';

		$(e.target).parents('.mb-title').find('.mb-title-formatted').val(formatted);
		$(e.target).parents('.mb-title').find('.mb-title-preview .preview-area').html(formatted);


	});

	$(function() {
		$('.mb-title').each(function() {
			var formatted = $(this).find('input:hidden').val()
			formatted = formatted.replace('<p>', '');
			formatted = formatted.replace('</p>', '')

			var plain = formatted.substr(0, formatted.indexOf('<'));
			$(this).find('.mb-title-plain').val(plain);

			var bold = formatted.replace(plain, '');
			bold = bold.replace('<strong>', '');
			bold = bold.replace('</strong>', '');
			bold = bold.replace('<b>', '');
			bold = bold.replace('</b>', '');
			$(this).find('.mb-title-bold').val(bold);

		});
	});

	if($('.relationship').length > 0) {
		$('.relationship').each(function() {
			var parent = this;
			// Relationship Field Drag/Drop Sortable
			var group = $(parent).find($(parent).data('target-class')).sortable({
										group: $(parent).data('target-class'),
										isValidTarget: function  (item, container) {
											if($(container.target).hasClass('selected') && container.items.length < $(parent).data('limit') || $(parent).data('limit') == 0) {
												return true;
											} else if ($(container.target).hasClass('unselected')) {
												return true;
											} else {
												return item.parent("ol")[0] == container.el[0];
											}
										},
										onDrop: function (item, container, _super) {
												var data = group.sortable("serialize").get();
											    var jsonString = JSON.stringify(data, null, ' ');

											    $(parent).find('select').html('');
											    for(i=0;i<data[1].length;i++) {
											    	id = data[1][i]['id'];
											    	name = data[1][i]['name'];
											    	$(parent).find('select').append('<option value="' + id + '" selected="selected">' + id + '</option>');
											    }



											    console.log($(parent).find('select').html());
			    								_super(item, container)
		  								},
										tolerance: 6,
										distance: 10
			})

		});
	}

	// On page load functions.
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
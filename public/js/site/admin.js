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

		if(file.type.indexOf('image') >= 0) {
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
			$(input).addClass('ignore');
			$(input).removeClass('error');
			$(input).attr('aria-invalid', false);
			$(input).parents('.form-group').removeClass('has-error');
			$('.help-block.errors').hide();
			$('.error-fields').hide();
		});
		$(e.target).parents('.resource').find('ul.icon-choices li').removeClass('selected');
		$(e.target).parents('.resource').slideUp(function() {
			if($('.resources').siblings('.resource:hidden').length > 0) {
				$('.resources').find('.add-resource').attr('disabled', false);
			}			
		});
	});

	$('.add-resource').on('click', function(e) {
		$(e.target).parents('.resources').siblings('.resource:hidden').first().find(':input').removeClass('ignore');
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
		$(selectField).parent().siblings(val).find('.validate').removeClass('ignore');
		$(selectField).parent().siblings().not(val).not('.no-hide').find('.validate').addClass('ignore');
		$(selectField).parent().siblings(val).show();

	}
	if($('.mb-select').length > 0) {
		$('.mb-select').on('change', function(e){ mediaBuffetTypeSelector(e.target) });
		$('.mb-select').each(function() {
			mediaBuffetTypeSelector(this);	
		});
	}

	// Media Buffet Title Handlers
	$('.mb-title').find('input[type="text"]').on('keyup', function(e) {
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
											} else if ($(container.target).hasClass('unselected') && $(container.target).parents('.row').find('.selected').children('li').not('.placeholder').length > 1) {
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

			    								_super(item, container)
		  								},
										tolerance: 6,
										distance: 10
			})

		});
	}

	if($('.table-product-list').length > 0) {
		$('button.reorder').on('click', function(e) {
			$('button').hide();
			$(this).parents('.product-list').find('.glyphicon-move').show();
			$(this).siblings('button.save').show();
			$(this).siblings('button.cancel').show();
		})

		$('button.cancel').on('click', function(e) {
			$('button').hide();
			$('.glyphicon-move').hide();
			$('button.save').hide();
			$('button.reorder').show();
		})

		$('.table-product-list').each(function() {
			parent = this;

			var group = $(this).sortable({
			  group: $(parent).data('target-class'),
			  handle: 'span.glyphicon.glyphicon-move',
		   	  containerSelector: 'table',
			  itemPath: '> tbody',
			  itemSelector: 'tr',
			  placeholder: '<tr class="placeholder"><td></td><td></td><td></td></tr>',
		  	onDrop: function (item, container, _super) {
											var data = group.sortable("serialize").get();
										    var jsonString = JSON.stringify(data, null, ' ');

										    $(group).parents('.product-list').find('select').html('');
										    for(i=0;i<data[0].length;i++) {
										    	id = data[0][i]['id'];
										    	$(group).parents('.product-list').find('select').append('<option value="' + id + '" selected="selected">' + id + '</option>');
										    }

		    								_super(item, container)
	  								}
			})

		})
	}

	$('.summernote').summernote({
		height:150,
		toolbar: [
					['style', ['bold', 'italic']],
					['misc', ['codeview']]
				],
		iconPrefix: 'glyphicon glyphicon-',
	    onpaste: function (e) {
	        var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
	        e.preventDefault();

	        document.execCommand('insertText', false, bufferText);
	    }
	});


	// On page load functions.
	$(function(){
		$('.resource').find('input.text-field').each(function(index, input) {
			if($(input).val().trim() == '') {
				$(input).parents('.resource').hide();
				$(input).parents('.resource').find(':input').addClass('ignore');
			}
		});

		if($('.resources').siblings('.resource:hidden').length == 0) {
			$('.resources').find('.add-resource').attr('disabled', true);
		}

	});
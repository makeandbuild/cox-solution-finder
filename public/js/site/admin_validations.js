// CUSTOM RULES
jQuery.validator.addMethod("twoFieldHtmlMax", function(value, element, limit) {

	bold = $(element).parents('.form-group').find('.mb-title-bold').val();
	plain = $(element).parents('.form-group').find('.mb-title-plain').val();
	str = plain + bold;

  	return 1 <= str.length && limit >= str.length;
}, 'Please enter a value between 1 and {0} characters long.');

jQuery.validator.addMethod("htmlField", function(value, element, limit) {

	str = $(element).siblings('.note-editor').find('.note-editable').text();

  	return limit[0] <= str.length && limit[1] >= str.length;
}, 'Please enter a value between {0} and {1} characters long.');

jQuery.validator.addMethod("markdownLimit", function(value, element, limit) {
  	return limit[0] <= value.length && limit[1] >= value.length;
}, 'Please enter a value between {0} and {1} characters long.');


// REMOVE ALL OTHER FORMS
// IGNORE STUFF THAT ISN'T NECESSARY
$('.note-modal-form').ready(function() {
	$('.note-modal-form').remove();
	$('textarea.note-codable').addClass('ignore');
});

function ignoreBasedOnCheckbox(checkbox) {

	var splitnames = $(checkbox).attr('name').split('.');
	var namespace = '';
	for(i=0;i < splitnames.length-1; i++) {
		namespace += splitnames[i] + '.';
	}
	console.log(namespace);
	if(namespace.indexOf('resource') < 0) {
		console.log(namespace);

		$(':input[name^="' + namespace + '"]').each(function() {

			if($(this).hasClass('validate')) {
				if($(checkbox).is(':checked')) {
					console.log('checked');
					$(this).removeClass('ignore');
				} else {
					$(this).addClass('ignore');
					stripErrors(this);
				}
			}
		});
	}
}

function stripErrors(input) {
	$(input).removeClass('error');
	$(input).attr('aria-invalid', false);
	$(input).parents('.form-group').removeClass('has-error');
	$(input).parents('.form-group').find('label.error').hide();
}

// VALIDATIONS
$(function(){

	$('input[type="checkbox"]').on('change', function(e) {
		ignoreBasedOnCheckbox(this);
	});

	$('input[type="checkbox"]').each(function(){
		console.log('CHECKBOX');
		ignoreBasedOnCheckbox(this);
	});


	$('.markdown textarea').each(function(){
		var textarea = this;
		$(textarea).markdown({
			onBlur: function(e) {
				$(textarea).text(e.getContent());
			}
		})
	});

	var rules = {};
	$('form').find('.validate').each(function(index) {

		var ruleObj = $(this).data('rules');
		var name = $(this).attr('name');
		if(ruleObj) {
			rules[name] = ruleObj;
		}

	});

	if(rules) {
		$('form').validate({
		    	debug: true,
				rules: rules,
				ignore: '.ignore',
				
				errorPlacement: function(error, element) {
			    	error.insertAfter(element);
			      	$(element).parent('.form-group').addClass('has-error');
				},
				highlight: function(element) {   // <-- fires when element has error
					$(element).parent('.form-group').addClass('has-error');
					$(element).addClass('error');
					errorID = $(element).parents('.tab-pane').attr('id');
					console.log(errorID);
					$('a[href="#' + errorID +'"]').addClass('error');
				},
				unhighlight: function(element) {   // <-- fires when element has error
					$(element).parent('.form-group').removeClass('has-error');
					$(element).removeClass('error');
					errorID = $(element).parents('.tab-pane').attr('id');
					console.log(errorID);
					$('a[href="#' + errorID +'"]').removeClass('error');
				},
				invalidHandler: function(event, validator) {
				    var errors = validator.numberOfInvalids();
				    var errorMessage = '';
				    $(this).find('.help-block.errors, .error-fields').hide();

			    	$(this).find('ul.error-fields').html('');

				    for(x in validator.errorList) {
				    	element = validator.errorList[x].element;

				    	label = $(element).parents('.form-group').find('label').first();
				    	$(this).find('ul.error-fields').append('<li>' + $(label).text().replace('|', '') + '</li>');
				    }

				    if(errors == 1) {
						errorMessage = 'The following field is invalid:';
				    } else {
				    	errorMessage = 'The following ' + errors + ' fields are invalid:';
				    }

				    $(this).find('.help-block.errors').text(errorMessage);
				    $(this).find('.help-block.errors, .error-fields').show();
				},
				submitHandler: function(form) {
					console.log('submit');
					$('form').find('.publish').attr('disabled', 'disabled');
					$('form').find('.publish').text('');
					$('form').find('.publish').addClass('loading');
				}

			});
	}

});
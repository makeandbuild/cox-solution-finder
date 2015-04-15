jQuery.validator.addMethod("twoFieldHtmlMax", function(value, element, limit) {

	bold = $(element).parents('.form-group').find('.mb-title-bold').val();
	plain = $(element).parents('.form-group').find('.mb-title-plain').val();
	str = plain + bold;
	console.log(str);
  	return 1 <= str.length && limit >= str.length;
}, 'Please enter a value between 1 and {0} characters long.');

jQuery.validator.addMethod("htmlField", function(value, element, limit) {

	str = $(element).siblings('.note-editor').find('.note-editable').text();

  	return limit[0] <= str.length && limit[1] >= str.length;
}, 'Please enter a value between {0} and {1} characters long.');


$(function(){
	console.log('LET THE VALIDATIONS BEGIN!');
	// REMOVE ALL OTHER FORMS
	// IGNORE STUFF THAT ISN'T NECESSARY
	$('.note-modal-form').ready(function() {
		$('.note-modal-form').remove();
		$('textarea.note-codable').addClass('ignore');
	});

	var rules = {};
	var messages = {};
	$('form').find('.validate').each(function(index) {

		var ruleObj = $(this).data('rules');
		var name = $(this).attr('name');		
		if(ruleObj) {
			rules[name] = ruleObj;
		}

	});
	console.log(rules);

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
				},
				unhighlight: function(element) {   // <-- fires when element has error
					$(element).parent('.form-group').removeClass('has-error');
					$(element).removeClass('error');
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
				}

			});
	}

});



// messages : {
// 				'name.full' : 'Please enter your first and last name.',
// 				'email' : 'Please enter a valid Email address.',
// 				'zipcode' : 'Please enter a valid ZIP Code'
// 			},
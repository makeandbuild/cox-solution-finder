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
		var url = '/admin/preview';
		var data = $(this).parents('form').serializeObject();
		data.action = 'preview';
		data.mode = 'showroom';
		var dataType = 'json';
		var slug = data.slug;
		var pathname = '/admin/preview' + data.pathname;

		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: dataType
		}).done(function(response) {
			console.log('OPEN IT UP!!!');
			console.log(response);
			if(response.success) {
				window.open(pathname, '_blank', 'resizeable=no,titlebar=no,toolbar=no,height=1080,width=1920');
			}
		});

		// $(this).parents('form').submit();
	});

	$.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	           o[this.name] = this.value || '';
	       }
	   });
	   return o;
	};
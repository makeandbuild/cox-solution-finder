// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Global Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
function initGlobal(){
	console.log('initGlobal Called');
	
	navigationModal();
	
	videoClose();
	modalContent();
	formValidation();
	initCheckbox();
	initDropdownSelect();

	// Removes dragging images.
	$('img, a, .coxicon, main, :active, :focus, :visited, :hover, div, p, li, section, ul, body').on('dragstart', function(event) { event.preventDefault(); });

	//VideoJS inits.
	videojs.options.flash.swf = "'/js/lib/videojs/video-js.swf";

	// Sets the blur to work with modal's.
	$('.modal').on('show.bs.modal', function (e) {
		$('.the-looking-glass').addClass('active');
		$('.my-solutions-link').addClass('active');
	});
	$('.modal').on('hide.bs.modal', function (e) {
		$('.the-looking-glass').removeClass('active');
		$('.my-solutions-link').removeClass('active');
		$('video').each(function(){
			$(this).load();
		});
	});
}

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Window Resizing
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
$(window).resize(function(){
	if($('body').hasClass('showroom')){

	}
	if($('body').hasClass('companion-site')){
		if(document.documentElement.clientWidth <= config.breakpoints.site.mobile) {
			setMobileNavHeight();
		}
		equalHeights($('.contains-equal-heights'), $('.equal-heights'));
	}
});


// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Document Ready
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
$(function() {

	// Inits
	initGlobal();
	if($('body').hasClass('showroom'))
		initShowroom();
	if($('body').hasClass('companion-site'))
		initCompanion();

});
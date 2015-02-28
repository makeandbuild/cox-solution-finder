// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Showroom Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
function initShowroom(){
	console.log('initShowroom Called');
	sidebarNavigation();
	homeStageTransitions();
	mySolutionsFavoritesInteraction();
	allServices();
	itemNavigation($('.map-overlay-navitem'), $('.map-overlay'));
	factoidGeneral();
	if ($('.keyboard-container')[0]){
		jsKeyboard.init("virtualKeyboard");
		connectKeyboard();
	}

	attractLoop_Init();


	// Allows for Touchscreen Scrolling on Hover for the Products area of Services Views.
	$('.product-showroom-scroll').on('mouseover',function(){
		var parent = $(this).parent();
		var target = $(this);
		if(parent.hasClass('scrolled')){
			customScrollTo(parent, 0, 1000);
			
			target.fadeOut('300', function(){
				parent.removeClass('scrolled');
				target.fadeIn('300');
			});
		} else {
			customScrollTo(parent, parent.children('.row').last().offset().top, 1000);
			
			target.fadeOut('300', function(){
				parent.addClass('scrolled');
				target.fadeIn('300');
			});
		}
	});

	
}
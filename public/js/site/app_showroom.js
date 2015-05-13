// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Showroom Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
function initShowroom(){
	console.log('initShowroom Called');
	sidebarNavigation();

	allServices();
	itemNavigation($('.map-type'), $('.map-type-container'));
	itemNavigation($('.map-overlay-navitem'), $('.map-overlay'));
	itemNavigationAlternate($('.product-navigation-item'), $('.product-container'));
	factoidGeneral();
	if ($('.keyboard-container')[0]){
		// jsKeyboard.init("virtualKeyboard");
		connectKeyboard();
		
	}
	inputClear();

	mySolutionsSessionInit();
	mySolutionsFavoritesInits();
	mySolutionsFavoritesInteraction();

	mapRelatedProducts();
	mapTypeInits();

	mySolutionsFormSubmission();

	if ($('.home-stage')[0]) {
		homeStageTransitions();
		attractLoop_Init();
	}

	settingsInits();
	settingsActions();
	settingsPageInits();

	$( document ).ajaxSuccess(function( event, xhr, settings ) {
	    //console.log(xhr.responseText);
	});


	$('.product-item-container').scroll(function(){
		if ($(this).scrollTop() < 50){
			$(this).children('.product-showroom-scroll').addClass('active');
		} else {
			$(this).children('.product-showroom-scroll').removeClass('active');
		}
	})
	// Allows for Touchscreen Scrolling on Hover for the Products area of Services Views.
	// $('.product-showroom-scroll').on('mouseover',function(){
	// 	var parent = $(this).parent();
	// 	var target = $(this);
	// 	if(parent.hasClass('scrolled')){
	// 		customScrollTo(parent, 0, 1000);

	// 		target.fadeOut('300', function(){
	// 			parent.removeClass('scrolled');
	// 			target.fadeIn('300');
	// 		});
	// 	} else {
	// 		customScrollTo(parent, parent.children('.row').last().offset().top, 1000);

	// 		target.fadeOut('300', function(){
	// 			parent.addClass('scrolled');
	// 			target.fadeIn('300');
	// 		});
	// 	}
	// });

	// TV TABLE TRANSFER INIT CALL
	tvTabletTransferInit();
}
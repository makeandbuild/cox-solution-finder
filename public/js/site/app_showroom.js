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

	$('.product-item-container').scroll(function(){
		if ($(this).scrollTop() < 50){
			$(this).children('.product-showroom-scroll').addClass('active');
		} else {
			$(this).children('.product-showroom-scroll').removeClass('active');
		}
	});

	// TV TABLE TRANSFER INIT CALL
	tvTabletTransferInit();
}
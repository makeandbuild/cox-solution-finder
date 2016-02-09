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

  var gradientOn = true;

	$('.product-item-container').scroll(function(){
		if ($(this).scrollTop() < 50){
			$(this).children('.product-showroom-scroll').addClass('active');
		} else {
			$(this).children('.product-showroom-scroll').removeClass('active');
		}

    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
      $('.product-fade-bottom').animate({opacity: 0}, 50);
      gradientOn = false;
    } else if (gradientOn === false) {
      gradientOn = true;
      $('.product-fade-bottom').animate({opacity: 1}, 50);
    }
	});

	// TV TABLE TRANSFER INIT CALL
	tvTabletTransferInit();
}


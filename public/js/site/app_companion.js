// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Companion Site Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
function initCompanion(){
	console.log('initCompanion Called');

	// Yes, Yes, we are doing this.
	var ieVer = ieVersion();
	if (ieVer != 0){
		$('html').addClass('ie'+ieVer);
	}

	itemNavigation($('.product-navigation-item-container'), $('.product-container'));
	mobileNavigation();
	setMobileNavHeight();
	customHomeNameAdjust();
	piwikCompanionActions();
	customHomeReset();
	equalHeights($('.contains-equal-heights'), $('.equal-heights'));
	compensateForFooter($('.connect-page'), [$('header'), $('main')], $('html'));

	$('.product-navigation-item-container').on('click',function(){
		customScrollTo($('body, html'), $('.product-container').offset().top, 1000);
	});

	if($('.connect-thanks:visible').length) {
		console.log("Scroll It");
		window.scrollTo(0, $('.connect-thanks').offset().top);
	}
	
}
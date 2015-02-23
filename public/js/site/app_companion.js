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

	mobileNavigation();
	setMobileNavHeight();
	customHomeNameAdjust();	
	equalHeights($('.contains-equal-heights'), $('.equal-heights'));
}
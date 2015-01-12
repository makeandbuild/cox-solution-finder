// --------------------------------
// Development Functions
function initDevelopment(){

}


// --------------------------------
// Global Functions
function initGlobal(){

}


// --------------------------------
// Showroom Functions
function initShowroom(){

}


// --------------------------------
// Companion Site Functions
function initCompanion(){

}



$(function() {
	// --------------------------------
	// Inits
	initGlobal();
	if($('html').hasClass('showroom'))
		initShowroom();
	if($('html').hasClass('companion'))
		initCompanion();

	//Development Only
	initDevelopment();



});
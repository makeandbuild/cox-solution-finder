// --------------------------------
// Global Variables
var config = {
  "breakpoints" : {
  	"site" : {
  		"mobile" : 992,
  	},
  	"showroom" : {
  		"tablet" : 1024,
  		"touch" : 1920
  	}
  }
}


// --------------------------------
// Development Functions
function initDevelopment(){
	console.log('initDevelopment Called');
	// if(document.documentElement.clientWidth <= config.breakpoints.phone) {

	// }
}


// --------------------------------
// Global Functions
function initGlobal(){
	console.log('initGlobal Called');

}


// --------------------------------
// Showroom Functions
function initShowroom(){
	console.log('initShowroom Called');

	//Make me better
	if($('body').width() <= config.breakpoints.showroom.tablet) {
		$('.navigation-toggle').on('click', function(){
			$('#side-navigation').toggleClass('active');
		});
		$(document).on('click', function(e){
			if(!$(e.target).hasClass('navigation-toggle') && $(this).parents('#body')){
				$('#side-navigation').removeClass('active');
			}
		});
	}
}


// --------------------------------
// Companion Site Functions
function initCompanion(){
	console.log('initCompanion Called');

}



$(function() {
	// --------------------------------
	// Inits
	initGlobal();
	if($('body').hasClass('showroom'))
		initShowroom();
	if($('body').hasClass('companion'))
		initCompanion();

	//Development Only
	initDevelopment();



});
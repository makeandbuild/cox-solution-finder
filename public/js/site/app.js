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
	itemNavigation($('.product-navigation-item-container'), $('.product-container'));

}

/*  
	Standard Global Item Navigation within a view. (i.e. Product Navigation in Services)
	
	To use, set the argument `navigationItem` to the jQuery nav item to be clicked,
	and set the arguement `item` to the jQuery item that should appear.

	In the HTML set `data-navigationitem` and `data-item` as the same string.

	Both should use the active class to denote selection, with
	CSS creating any animations.
*/
function itemNavigation(navigationItem, item){
	navigationItem.on('click',function(){
		var keystone_id = $(this).data('navigationitem');
		var theItem = item.filter("[data-item='" + keystone_id + "']");
		$(this).addClass('active').siblings().removeClass('active');
		theItem.addClass('active').siblings().removeClass('active');
	});
}

function scrollTo(toBeScrolled, whereToScroll, time){
	if(typeof(time)==='undefined') time = 200;
	toBeScrolled.animate({
        scrollTop: whereToScroll
    }, time);
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

	$('.product-showroom-scroll').on('click',function(){
		var parent = $(this).parent();
		if(parent.hasClass('scrolled')){
			scrollTo(parent, 0, 1000);
			parent.removeClass('scrolled');
		} else {
			scrollTo(parent, parent.children('.row').last().offset().top, 1000);
			parent.addClass('scrolled');
		}
	});

	//scrollTo($('.product-item-container'), $('.product-item-container').)
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
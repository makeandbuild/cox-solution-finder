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
	navigationModal();
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


function navigationModal(){
	$('.navigation-modal-item').on('click',function(){

		$scope = {};
		$scope.$tiles = $('.navigation-modal-tiles');
		$scope.$glass = $('.the-looking-glass');
		$scope.glassActive = $scope.$glass.hasClass('active');
		$scope.$navItem = $(this);
		$scope.$selector = $(this).data('navigation-modal-item');
		$scope.$target = $scope.$tiles.filter("[data-navigation-modal='" + $scope.$selector + "']");
		$scope.tilesActive = $scope.$tiles.hasClass('active');
		$scope.$allTiles = $('.navigation-modal-tile');


		if(!$scope.$target.hasClass('active')){
			$scope.$glass.removeClass('active');
			$scope.$tiles.removeClass('active');
			$scope.$allTiles.removeClass('active');

			$scope.$glass.toggleClass('active');
			setTimeout(function(){
				$scope.$target.toggleClass('active');
				$scope.$target.find('.navigation-modal-tile').toggleClass('active');
			},150);
		} else {
			setTimeout(function(){
				$scope.$target.find('.navigation-modal-tile').toggleClass('active');
			},0);
			setTimeout(function(){
				$scope.$glass.toggleClass('active');
			},150);
			$scope.$target.toggleClass('active');
		}
		
	
	});
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
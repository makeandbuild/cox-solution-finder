// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Showroom Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


//Connect Keyboard Functions
function connectKeyboard(){
	$('input').on('focus',function(){
		if($(this).attr('type', 'text') || $(this).attr('type', 'email')){
			jsKeyboard.currentElement = $(this);
			jsKeyboard.currentElementCursorPosition = 0;
		}
	});
	// var $firstInput = $('.form-group').first().find('input').focus();
	// jsKeyboard.currentElement = $firstInput;
	// jsKeyboard.currentElementCursorPosition = 0;
	// jsKeyboard.changeToSmallLetter();
}


/*

	The below functions are mainly used interchangably
	for the DidYouKnow Section of the Showroom App. They
	mainly toggle a series of classes back and forth to
	create animations. These functions should be combined
	with classes with transitions and transforms on them
	for the animations to work. Though they've been built
	to function more generically so they can be used elsewhere.

*/
function quickClassToggle(item, toggledClass, time){
	item.addClass(toggledClass);
	setTimeout(function(){
		item.removeClass(toggledClass);
	},time);
}
function oneClassToggle(item, class1, interval, count, ease){
	var theCount = count;
	var theInterval = interval;
	theCount--;
	if (theCount == 0){ return; }
	if (ease) {
		theInterval -= interval/count;
	}
	item.addClass(class1);
	setTimeout(function(){
		item.removeClass(class1);
		twoClassToggle(item, class1, theInterval, theCount, ease);
	},theInterval);
}
function twoClassToggle(item, class1, class2, interval, count, ease){
	var theCount = count;
	var theInterval = interval;
	theCount--;
	if (theCount == 0){ return; }
	if (ease) {
		theInterval -= interval/count;
	}
	item.addClass(class1);
	setTimeout(function(){
		item.removeClass(class1);
		item.addClass(class2);
		setTimeout(function(){
			item.removeClass(class2);
			twoClassToggle(item, class1, class2, theInterval, theCount, ease);
		},theInterval)
	},theInterval);
}
function fourClassToggle(item, class1, class2, class3, class4, interval, count, ease){
	var theCount = count;
	var theInterval = interval;
	theCount--;
	if (theCount == 0){ return; }
	if (ease) {
		theInterval -= interval/count;
	}
	item.addClass(class1);
	setTimeout(function(){
		item.removeClass(class1);
		item.addClass(class2);
		setTimeout(function(){
			item.removeClass(class2);
			item.addClass(class3);
			setTimeout(function(){
				item.removeClass(class3);
				item.addClass(class4);
				setTimeout(function(){
					item.removeClass(class4);
					fourClassToggle(item, class1, class2, class3, class4, theInterval, theCount, ease);
				},theInterval);
			},theInterval);
		},theInterval);
	},theInterval);
}

function factoidGeneral(){
	$('.factoid').on('click',function(){
		$(this).toggleClass('flipped').siblings().removeClass('flipped');
	});
	$('.factoid-close').on('click',function(){
		$('.factoid').removeClass('flipped');
	})
}

function factoidTransition(set, toggledClass, type, numToCount){
	//twoClassToggle(set.eq(currentCount), 'factoid-jiggle', 'factoid-jiggle2', 100, 10);
	if (type == 'remove') {
		set.addClass(toggledClass);
	} else {
		var currentCount = numToCount;
		if(type == 'unveil'){
			set.eq(currentCount).toggleClass(toggledClass);
		} else if (type == 'jiggle') {
			twoClassToggle(set.eq(currentCount), 'factoid-jiggle1', 'factoid-jiggle2', 80, 8, true);
		}
		
		currentCount++;
		if(currentCount >= set.length){
			currentCount = 0;
			return;
		}
		if(currentCount == set.length-1){
			setTimeout(function(){
				factoidTransition(set, toggledClass, type, currentCount);
			},300);
		} else {
			setTimeout(function(){
				factoidTransition(set, toggledClass, type, currentCount);
			},200);
		}
	}	
}


// Used on Industries page to trigger the Services Navigation to Open
function allServices(){
	$('.industry-services-all-services, .map-overlay-all-services').on('click',function(e){
		e.stopPropagation();
		$('.navigation-toggle').trigger('click');
		$('.navigation-modal-item').filter("[data-navigation-modal-item='services']").trigger('click');
	});
}

/*  
	Adjusts the links on the navigation modals
	using an onclick call. Readjusts them if the
	normal navigation is used.
*/
var alteredLinks = false;
function alterNavigationModalLinks(type, slug, remove){
	if (remove == true && alteredLinks == true){
		if (type == 'services'){
			var tiles = $('.navigation-modal-tiles').filter("[data-navigation-modal='services']").find('.navigation-modal-tile').not('.fake-tile');
			tiles.each(function(e){
				$(this).attr('href', $(this).attr('href').substr(0, $(this).attr('href').lastIndexOf("/")));
			});
		}
		alteredLinks = false;
	} else if (remove == false) {
		if (type == 'services'){
			var tiles = $('.navigation-modal-tiles').filter("[data-navigation-modal='services']").find('.navigation-modal-tile').not('.fake-tile');
			tiles.each(function(e){
				$(this).attr('href', $(this).attr('href')+'/'+slug);
			});
			setTimeout(function(){
				//Adjust for race conditions
				alteredLinks = true;
			},100)
		}
	}
}


// Tablet Sidebar Navigation
function sidebarNavigation(){
	$('.navigation-toggle').on('click', function(){
		$('#side-navigation').toggleClass('active');
	});
	$('#body').on('click', function(e){
		$('#side-navigation').removeClass('active');
	});
}

//Regular Transitions Functionality for Home Staging Area.
function homeStageTransitions(){
	$('.home-stage .scene').on('click',function(){
		var clicked = $(this);
		var selector = clicked.data('scene');
		var target = $('.home-stage .act').filter("[data-act='"+selector+"']");

		if (clicked.hasClass('scene-active')){
			$('.home-stage .scene, .home-stage .act')
			.removeClass('scene-active')
			.removeClass('scene-inactive')
			.removeClass('scene-in-focus')
			.removeClass('active');
		}
		else if (clicked.hasClass('scene-inactive')){
			alert("you shouldn't see this lol, go slack Nick if you see this haha");
		}
		else {
			clicked.addClass('scene-active').siblings().addClass('scene-inactive').removeClass('scene-active');
			setTimeout(function(){
				if (clicked.hasClass('scene-active')){
					clicked.addClass('scene-in-focus');
					target.addClass('active').siblings().removeClass('active');
				}				
			},1000);
			setTimeout(function(){
				if (selector == 'Coverage'){
					$('.stage-background-overlay').addClass('inactive');
					$('.stage-background-shadow').addClass('inactive');
				}
			},1100);
			
			if (selector == 'Did you know?'){
				setTimeout(function(){
					factoidTransition($('.factoid'), 'inactive-factoid', 'unveil', 0);
				},1000);
				setTimeout(function(){
					factoidTransition($('.factoid'), 'inactive-factoid', 'jiggle', 0);
				},1400);
			}
			
		}

	});
	$('.home-stage .act .act-close').on('click', function(){
		$('.home-stage .scene, .home-stage .act')
		.removeClass('scene-active')
		.removeClass('scene-inactive')
		.removeClass('scene-in-focus')
		.removeClass('active');
		factoidTransition($('.factoid'), 'inactive-factoid', 'remove', 0);
		$('.stage-background-overlay').removeClass('inactive');
		$('.stage-background-shadow').removeClass('inactive');
	});
}


// My Solutions Functions
function mySolutionsFavoritesInteraction(){

	$('.can-favorite').on('click',function(e){

		//Inits
		var isAddition = false;
		var countObject = $('.my-solutions-count-number');
		var currentCount = parseInt(countObject.html());
		var solutionsItem = $(this).data('solutions-slug');

		// Which type of Item was clicked?
		if($(this).hasClass('solution-page-title')){
			var theStar = $(this).find('.coxicon');
			if (theStar.hasClass('active')){
				isAddition = false
			} else {
				isAddition = true;	
			} 
			theStar.toggleClass('active');
		}
		if($(this).hasClass('solution-service-item')){
			e.preventDefault();
			var theStar = $(this).find('.coxicon');
			if (theStar.hasClass('active')){
				isAddition = false
			} else {
				isAddition = true;	
			} 
			theStar.toggleClass('active');
		}


		// Add or Subtract
		if (isAddition) { currentCount++; } else { currentCount--; }
		countObject.html(currentCount);
		if (currentCount > 0) {
			countObject.siblings('.coxicon').addClass('active');
		} else {
			countObject.siblings('.coxicon').removeClass('active');
		}

		// Update the Session
		mySolutionsSessionUpdate(solutionsItem, isAddition);

	});
}

function mySolutionsSessionUpdate(slug, isAddition){
	if (isAddition){
		console.log("Adding Item: "+slug);
	} else {
		console.log("Removing Item: "+slug);
	}
}
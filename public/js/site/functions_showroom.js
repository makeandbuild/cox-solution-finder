// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Showroom Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// The below inits are used in the Attract Loop Functions

var time_Init,
	attractLoopStarted,
	timeToNextAction,
	time_duration_very_long,
	time_duration_long,
	time_duration_medium,
	time_duration_short,
	factoid_order,
	map_current,
	video_muted,
	video_playing,
	video_ready_to_complete,
	video_saved_volume,
	attractLoopPause,
	randomizedScenes,
	sceneOrder,
	lastSceneUsed;

time_Init = new Date(); 	     // Init Time
attractLoopStarted = false;      // Bool for allowing attractloop actions to be performed.
timeToNextAction = 0;            // Init the countdown timer for each action.
factoid_order = [0,1,2,3,4];     // Init Factoid order to be randomized.
map_current = 0; 			     // Init Map order.
video_muted = true;		         // Mute video if true.
video_playing = false;		     // Used to check if Video is playing.
video_ready_to_complete = false; // Used to check if Video is ok to finish on next action.
attractLoopPause = true;        // Set to true to pause the Attract Loop.
sceneOrder = true;				 // Scene order for inside the isHome action in the Attract Loop
lastSceneUsed = 'undefined';     // Var to hold last scene used, to prevent repeats.
randomizedScenes = false;	     // Bool to set if scenes should be randomized.

// The 3 Vars for Timing Events
time_duration_very_long = 5;
time_duration_long = 10;
time_duration_medium = 10;
time_duration_short = 5;
time_duration_very_short = 1;

function attractLoop_Init(){
	console.log('`attractLoop_Init()` called');

	// Every Second check for actions needed to be made. This is your ticker.
	setInterval(function(){
		if (!attractLoopPause){
			var time_Now = new Date();

			/*
				On page load or after a mouse interaction,
				start the countdown until the attract loop begins.
			*/
			if ( ( (time_Now - time_Init) > time_duration_very_long*1000 ) && !attractLoopStarted ) {
				console.log('      Starting Attract Loop');

				// The Attract loop has started. 
				attractLoopStarted = true;
			}

			/*
				The initial Attract Loop must have started to call
				`attractLoop_Action()`. The var `timeToNextAction`
				must be counted down to 0 and next action ready to begin.
			*/
			if (attractLoopStarted && ( timeToNextAction == 0 ) ) {

				// Call the next Attract Loop Action, passing current state.
				attractLoop_Action( attractLoop_data() );
			}

			// Count down the var `timeToNextAction` each tick of SetInterval until its at 0.
			if (timeToNextAction > 0){
				timeToNextAction--;
				console.log('      '+timeToNextAction+' Sec To Next Action.');
			}
		}
		

	},1000);

	// Clear Time Init on mouse move.
	$('body').mousemove(function() {
	    time_Init = new Date();
	    attractLoopStarted = false;
	    factoid_order = [0,1,2,3,4];
	});
}


/*
	When called, this function executes an action
	based on the current location on the home view.
	Current Location data is gathered by `attractLoop_data()`.

	When an action occurs, it will reset the var `timeToNextAction`
	to the specified amount and this function will not be called
	until that var has counted down to zero.

*/
function attractLoop_Action(data){

	// If at Home screen, go to the next ordered scene.
	if(data.isHome){
		console.log('LOCATION: HOME');

		/*
			Code below for randomized scenes could be
			simpler, but in case of changes or future
			requests for custom orders or anything else,
			I left them as two independant paths.
		*/

		// Randomized Scenes
		if (randomizedScenes){

			if (sceneOrder) {

				//Randomize Scenes.
				sceneOrder = shuffle([data.scene_1, data.scene_2, data.scene_3]);

				var rand = Math.random() * 3 | 0;

				// Next Scene to be used is the first item in the array.
				var nextScene = sceneOrder[rand];

				// Toggle the scene.
				nextScene.trigger('click');
				
			}

		// Non-Randomized Scenes
		} else {
			sceneOrder = [data.scene_1, data.scene_2, data.scene_3];

			// First Scene, set lastScene.
			if (lastSceneUsed == 'undefined'){
				sceneOrder[0].trigger('click');
				lastSceneUsed = 0;

			// On to the next scene.
			} else {
				lastSceneUsed++;
				if (lastSceneUsed > 2){
					lastSceneUsed = 0;
				}
				sceneOrder[lastSceneUsed].trigger('click');
				
				
			}
		}
		
		// Set the counddown to the first action of the newly accessed scene.
		timeToNextAction = time_duration_short;
	}

	// If inside an act, start custom actions for that act.
	if(data.currentAct){

		// Loops thru the Factoids before going onto the next scene.
		if(data.currentAct.type == 'factoid'){
			console.log('LOCATION: '+data.currentAct.type);
			
			if (factoid_order) {

				// Randomize the Order.
				factoid_order = shuffle(factoid_order);

				// Next Factoid to be used is the first item in the array.
				var nextFactoid = factoid_order[0];

				// Remove the first item in the array so its not used again.
				factoid_order.shift();

				// Toggle the factoid.
				data.currentAct.selectors.eq(nextFactoid).trigger('click');
				
				// If the last factoid was toggled extend the coundown before leaving the scene.
				if (factoid_order.length <= 0) {
					factoid_order = false;
					timeToNextAction = time_duration_medium;
				} else {

					// Reset countdown till the next factoid.
					timeToNextAction = time_duration_short;
				}
			} else {

				// Leave the scene and reset the factoid order array.
				data.currentAct.close.trigger('click');
				factoid_order = [0,1,2,3,4];
				timeToNextAction = time_duration_long;
			}



		// Plays thru the video before going onto the next scene.
		} else if (data.currentAct.type == 'video') {
			console.log('LOCATION: '+data.currentAct.type);

			if (video_playing) {
				timeToNextAction = Math.floor(data.currentAct.selectors.duration - data.currentAct.selectors.currentTime)+3;
				video_ready_to_complete = true;
				video_playing = false;
			} else if (video_ready_to_complete) {
				data.currentAct.close.trigger('click');
				data.currentAct.selectors.volume = video_saved_volume ? video_saved_volume : 1;
				data.currentAct.selectors.load();
				timeToNextAction = time_duration_long;
				video_ready_to_complete = false;
			} else {
				video_saved_volume = data.currentAct.selectors.volume;
				data.currentAct.selectors.volume = 0;
				data.currentAct.selectors.play();
				video_playing = true;
				timeToNextAction = 1;
			}
			



		// Loops thru the Maps before going onto the next scene.
		} else if (data.currentAct.type == 'map') {
			console.log('LOCATION: '+data.currentAct.type);

			if (map_current >= data.currentAct.selectors.length) {

				// Leave the scene and reset the map number.
				data.currentAct.close.trigger('click');
				data.currentAct.selectors.eq(0).trigger('click');
				map_current = 0;
				timeToNextAction = time_duration_long;
			} else {
				map_current++;
				data.currentAct.selectors.eq(map_current).trigger('click');
				

				// Reset countdown till the next map.
				timeToNextAction = time_duration_short;
			}

		}
	}
}


/*
	This checks the current state of the Showroom
	home screen and returns data to be used in the
	`attractLoop_Action()` function.
*/
function attractLoop_data() {
	if ($('.home-stage')[0]) {
		var  array, isHome, currentScene, currentAct, isFactoids, isVideo, isMap, selectors;

		/*
			Init our objects to be added to the array.
			Generally, set objects to false if no data.
		*/
		isHome = $('.scene-in-focus')[0] == null ? true : false;
		currentScene = isHome ? false : $('.scene-in-focus');
		currentAct = isHome ? false : $('.act.active');
		if (currentAct) {
			isFactoids = currentAct.hasClass('act-factoid') == true ? 'factoid' : false;
			isVideo = currentAct.hasClass('act-video') == true ? 'video' : false;
			isMap = currentAct.hasClass('act-map') == true ? 'map' : false;
		}
		if (isFactoids) {
			selectors = currentAct.find('.factoid');
		} else if (isVideo) {
			selectors = currentAct.find('video').first()[0];
		} else if (isMap) {
			selectors = currentAct.find('.map-overlay-navitem');
		}
		
		// Create our data object to be used in actions.
		array = {
			"isHome" : isHome,
			"scene_1" : isHome == true ? $('.scene_location_1') : false,
			"scene_2" : isHome == true ? $('.scene_location_2') : false,
			"scene_3" : isHome == true ? $('.scene_location_3') : false,
			"currentScene" : currentScene,
			"currentAct" : isHome == true ? false : {
				"act": currentAct,
				"close" : currentAct ? currentAct.children('.act-close') : false,
				"type" : isFactoids || isVideo || isMap || false,
				"selectors" :  selectors
			},
			"durations": {
				"long": time_duration_long,
				"medium": time_duration_medium,
				"short": time_duration_short
			}
		}
		return array;
	} else { return false; }
}


//Connect Keyboard Functions
function connectKeyboard(){
	$('input').on('focus',function(){
		if($(this).attr('type', 'text') || $(this).attr('type', 'email')){
			jsKeyboard.currentElement = $(this);
			jsKeyboard.currentElementCursorPosition = 0;
		}
	});
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
		}
		else {
			clicked.addClass('scene-active').siblings().addClass('scene-inactive').removeClass('scene-active');
			setTimeout(function(){
				if (clicked.hasClass('scene-active')){
					clicked.addClass('scene-in-focus');
					target.addClass('active').siblings().removeClass('active');
					$('.my-solutions-link').addClass('inactive');
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
		$('.my-solutions-link').removeClass('inactive');
		$('video').first()[0].load();
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

function mySolutionsScrolling(){
	$('.solutions-navigation-arrow.arrow-up').on('click',function(){
		$('.solutions-navigation-arrow.arrow-down').removeClass('active');
		var clicked = $(this);
		var container = $(this).parent().parent().parent();
		var amountToScroll = container.scrollTop();
		amountToScroll = amountToScroll - 300;
		customScrollTo(container, amountToScroll, 500);
		setTimeout(function(){
			if (container.scrollTop() <= 0){
				clicked.addClass('active');
			}
		},500)
	});
	$('.solutions-navigation-arrow.arrow-down').on('click',function(){
		$('.solutions-navigation-arrow.arrow-up').removeClass('active');
		var clicked = $(this);
		var container = $(this).parent().parent().parent();
		var amountToScroll = container.scrollTop();
		amountToScroll = amountToScroll + 300;
		customScrollTo(container, amountToScroll, 500);
		console.log($('.solutions-favorites-container').height() - container.height());
		console.log(container.scrollTop());
		setTimeout(function(){
			if ( ( $('.solutions-favorites-container').height() - container.height() ) <= container.scrollTop() ) {
				clicked.addClass('active');
				console.log('what');
			}
		},500)
	});
}



//Super Quick Copy'n'Paste Shuffle Array off Stack Overflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Showroom Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

// Showroom Cookie Inits

var solutions_cookieName,
	solutions_cookieExp,
	solutions_cookiePath,
	settings_cookieName,
	settings_cookieExp,
	settings_cookiePath,
	settings_post_location;

solutions_cookieName = 'csf_showroom_favorites';
solutions_cookieExp = 1;
solutions_cookiePath = '/';
settings_cookieName = 'csf_showroom_settings';
settings_cookieExp = 1;
settings_cookiePath = '/';

settings_post_location = "/stats/settings.json";




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
attractLoopPause = false;        // Set to true to pause the Attract Loop.
sceneOrder = true;				 // Scene order for inside the isHome action in the Attract Loop
lastSceneUsed = undefined;     // Var to hold last scene used, to prevent repeats.
randomizedScenes = false;	     // Bool to set if scenes should be randomized.

// The 3 Vars for Timing Events
time_duration_very_long = 60;
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
			if (lastSceneUsed == undefined){
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
				$(this).attr('href', $(this).attr('href')+'.html');
			});
		}
		alteredLinks = false;
	} else if (remove == false) {
		if (type == 'services'){
			var tiles = $('.navigation-modal-tiles').filter("[data-navigation-modal='services']").find('.navigation-modal-tile').not('.fake-tile');
			tiles.each(function(e){
				$(this).attr('href', $(this).attr('href').replace('.html','/'+slug+'.html'));
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
		var selectorLocation = clicked.data('scene-location');
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
				if (selectorLocation == 'scene_location_3'){
					$('.stage-background-overlay').addClass('inactive');
					$('.stage-background-shadow').addClass('inactive');
				}
			},1100);
			
			if (selectorLocation == 'scene_location_1'){
				setTimeout(function(){
					factoidTransition($('.factoid'), 'inactive-factoid', 'unveil', 0);
				},1000);
				// setTimeout(function(){
				// 	factoidTransition($('.factoid'), 'inactive-factoid', 'jiggle', 0);
				// },1400);
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

function mapRelatedProducts(){
	if ($('.home-stage')[0]){
		var services = $('.navigation-modal-tiles').filter("[data-navigation-modal='services']").find('.navigation-modal-tile').not('.fake-tile');
		$('.related-product-item').each(function(e){
			var relatedProduct = $(this);
			if ($(this).data('related-service')[0]){
				var relatedProductService = $(this).data('related-service').split('"')[1];
				services.each(function(){
					if (relatedProductService == $(this).data('tile-id')){
						relatedProduct.attr('href', $(this).attr('href'));
					}
				});
			}
		});
	}
	$('.related-product-item').on('click',function(e){
		var productId = $(this).data('product-id');
		$.cookie('tmp_rel_prod', JSON.stringify({related_service_id: productId}), { expires: solutions_cookieExp, path: solutions_cookiePath });
	});
	if ($.cookie('tmp_rel_prod') && $('.service-container')[0]){
		var productId = JSON.parse($.cookie('tmp_rel_prod'));
		var selectedProduct = $('.product-navigation-item').filter("[data-navigationitem='"+productId.related_service_id+"']");
		selectedProduct.trigger('click');
		$.removeCookie('tmp_rel_prod', { expires: solutions_cookieExp, path: solutions_cookiePath });
	
	}
}

function mySolutionsFavoritesInits(){

	var countObject,
	currentData,
	canFavoriteSet;

	if ($.cookie(solutions_cookieName) != undefined){

		countObject = $('.my-solutions-count-number');
		currentData = JSON.parse($.cookie(solutions_cookieName));
		canFavorite = $('.can-favorite');

		canFavorite.each(function(i,e){
			var slug = $(this).data('solutions-slug');
			var type = $(this).data('solutions-type');
			if ( currentData[type].indexOf(slug) != -1 ) {
				$(this).find('.coxicon').addClass('active');
			} 
		});
		if (currentData.count > 0) {
			countObject.html(currentData.count);
			countObject.siblings('.coxicon').addClass('active');
		} else {
			$('.solutions-no-solutions').addClass('active');
		}

		if ($('.connect-page-my-solutions')[0]) {
			if(currentData.industries.length) {
				for (var i = 0; i < currentData.industries.length; i++) {
					$('.solutions-industries').children().filter("[data-solutions-slug='"+currentData.industries[i]+"']").addClass('active');
				}
				$('.solutions-industries-title').addClass('active');
			}
			if(currentData.services.length) {
				for (var i = 0; i < currentData.services.length; i++) {
					$('.solutions-services').children().filter("[data-solutions-slug='"+currentData.services[i]+"']").addClass('active');
				}
				$('.solutions-services-title').addClass('active');
			}
			if(currentData.partners.length) {
				for (var i = 0; i < currentData.partners.length; i++) {
					$('.solutions-partners').children().filter("[data-solutions-slug='"+currentData.partners[i]+"']").addClass('active');
				}
				$('.solutions-partners-title').addClass('active');
			}
			if(currentData.products.length) {
				for (var i = 0; i < currentData.products.length; i++) {
					$('.solutions-products').children().filter("[data-solutions-slug='"+currentData.products[i]+"']").addClass('active');
				}
				$('.solutions-products-title').addClass('active');
			}
			

			
		}

	} else {
		if ($('.connect-page-my-solutions')[0]) {
			$('.solutions-no-solutions').addClass('active');
		}
	}
	
}

// My Solutions Functions
function mySolutionsFavoritesInteraction(){

	$('.solutions-favorite-close').on('click',function(e){
		e.preventDefault();
		var parent;
		if ($(this).parent().hasClass('solutions-product-item')){
			parent = $(this).parent().parent();
		} else {
			parent = $(this).parent();
		}
		mySolutionsSessionUpdate(parent.data('solutions-slug'), parent.data('solutions-type'), false);
		parent.removeClass('active');
	})

	$('.solutions-clear_all, .navigation-restart').on('click',function(){
		$.removeCookie(solutions_cookieName, { path: solutions_cookiePath });
		if ($('.connect-page-my-solutions')[0]) {
			$('.solutions-container').children().removeClass('active');
			$('.solutions-section-title').removeClass('active');
			$('.solutions-no-solutions').addClass('active');
		}
	});

	$('.can-favorite').on('click',function(e){

		//Inits
		var isAddition = false;
		var countObject = $('.my-solutions-count-number');
		var currentCount = parseInt(countObject.html());
		var slug = $(this).data('solutions-slug');
		var type = $(this).data('solutions-type');

		e.preventDefault();
		var theStar = $(this).find('.coxicon');
		if (theStar.hasClass('active')){
			isAddition = false;
		} else {
			isAddition = true;	
		} 
		//theStar.toggleClass('active');
		$('.can-favorite').filter("[data-solutions-type='"+type+"']").filter("[data-solutions-slug='"+slug+"']").find('.coxicon').toggleClass('active');

		// Add or Subtract
		if (isAddition) { currentCount++; } else { currentCount--; }
		countObject.html(currentCount);
		if (currentCount > 0) {
			countObject.siblings('.coxicon').addClass('active');
		} else {
			countObject.siblings('.coxicon').removeClass('active');
		}

		// Update the Session
		mySolutionsSessionUpdate(slug, type, isAddition);

	});
}

/*
	This function, which is called on the front end when
	a favorite is clicked, alters or creates the cookie.
*/
function mySolutionsSessionUpdate(slug, type, isAddition){
	var default_json_data,
		currentData,
		currentType;

	default_json_data = {'industries': [],'services': [],'products': [],'partners': [],'count': 0};
	default_json_data = JSON.stringify(default_json_data);

	/*
		Cookie Use
		$.cookie(solutions_cookieName, default_json_string, { expires: solutions_cookieExp, path: solutions_cookiePath });
		$.cookie('csf_showroom_favorites', '{"industries":[],"services":[],"products":[], "count":0}', { expires: 1, path: '/' });
	*/
	

	if ($.cookie(solutions_cookieName) == undefined){
		$.cookie(solutions_cookieName, default_json_data, { expires: solutions_cookieExp, path: solutions_cookiePath });
	}
	currentData = JSON.parse($.cookie(solutions_cookieName));

	if (isAddition){
		if ( currentData[type].indexOf(slug) == -1 ){
			currentData[type] == false ? currentData[type] = [slug] : currentData[type].push(slug);
			currentData.count++;
			$.cookie(solutions_cookieName, JSON.stringify(currentData), { expires: solutions_cookieExp, path: solutions_cookiePath });
		}
	} else {
		if ( currentData[type].indexOf(slug) != -1 ) {
			currentData[type].splice(currentData[type].indexOf(slug), 1);
			currentData.count--;
			$.cookie(solutions_cookieName, JSON.stringify(currentData), { expires: solutions_cookieExp, path: solutions_cookiePath });
		}
	}
}

function mySolutionsSessionInit(){
	var default_json_data;

	default_json_data = {'industries': [],'services': [],'products': [],'partners': [],'count': 0};
	default_json_data = JSON.stringify(default_json_data);

	if ($.cookie(solutions_cookieName) == undefined){
		$.cookie(solutions_cookieName, default_json_data, { expires: solutions_cookieExp, path: solutions_cookiePath });
	}
}


function mySolutionsFormSubmission(){
	$('#showroom-form').on('submit',function(e){
		e.preventDefault();

		var currentData, formData;

		formData = $('#showroom-form').serializeObject();
		if ($.cookie(solutions_cookieName) != undefined){
			currentData = JSON.parse($.cookie(solutions_cookieName));
			formData.industries = currentData.industries.toString();
			formData.services = currentData.services.toString();
			formData.products = currentData.products.toString();
			formData.partners = currentData.partners.toString();
			formData.favorites_count = currentData.count;
		} else {
			currentData = false;
		}
		formData.is_showroom = true;
		formData.is_notified = false;
		formData.is_customer = formData.is_customer == undefined ? "No" : formData.is_customer;

		var data = {
			type: 'enquiry',
			formData: formData
		};

		$.ajax({
		    type: "POST",
		    url: "/stats/record.json",
		    contentType: 'application/json',
		    data: JSON.stringify(data)
		}).fail(function() {
		    console.log( "mySolutionsFormSubmission Fail" );
		}).success(function() {
			$('.connect-thanks-container').addClass('active');
			$('.connect-form-ready').addClass('inactive');
			$.removeCookie(solutions_cookieName, { path: solutions_cookiePath });
			if ($('.connect-page-my-solutions')[0]) {
				$('.solutions-container').children().removeClass('active');
				$('.solutions-section-title').removeClass('active');
				$('.solutions-no-solutions').addClass('active');
			}
		});
	});
}



function mySolutionsScrolling(){
	$('.solutions-navigation-arrow.arrow-up').on('mouseover',function(){
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
	$('.solutions-navigation-arrow.arrow-down').on('mouseover',function(){
		$('.solutions-navigation-arrow.arrow-up').removeClass('active');
		var clicked = $(this);
		var container = $(this).parent().parent().parent();
		var amountToScroll = container.scrollTop();
		amountToScroll = amountToScroll + 300;
		customScrollTo(container, amountToScroll, 500);
		setTimeout(function(){
			if ( ( $('.solutions-favorites-container').height() - container.height() ) <= container.scrollTop() ) {
				clicked.addClass('active');
			}
		},500)
	});
}



/*
	This is called on form submission on Settings page.

	It checks that an industry is chosen, and then saves
	the fields and the industry to /stats/settings.json
	for Network wide use, and it also creates a cookie for
	the local session.

	Currently Partners is not part of settings, however should it be added,
	there is some partial functionality below. However it is not complete.

*/

function settingsActions(){
	// init vars
	var currentData,
		currentType,
		slug,
		formData,
		type,
		settings_filter;

	$('.settings-filter-item-container').on('click',function(){
		$(this).addClass('active').siblings().removeClass('active');
	});

	// On Submit, Set Settings, and Create the Cookie or Override it.
	$('#settings-form').on('submit',function(e){
		e.preventDefault();
		$('.settings-warning-text').removeClass('active');
		$('.settings-success-text').removeClass('active');

		// Check that a setting has been selected
		if (!$('.settings-filter-item-container.active')[0] || $('.trade-show-name').val() == '' ){
			$('.settings-warning-text').addClass('active');
			return;
		} else {
			
			// Current Selected Setting
			settings_filter = $('.settings-filter-item-container.active').first();
			slug = settings_filter.data('settings-filter-slug');
			type = settings_filter.data('settings-filter-type');

			// Build or Get currentData from Cookie
			if ($.cookie(settings_cookieName) != undefined){
				currentData = JSON.parse($.cookie(settings_cookieName));
			} else {
				currentData = {
					'industry': '',
					'partner': '',
					'showname': ''
				}
			}
			if(type = 'industry'){
				currentData.industry = slug;
			} else if (type = 'partner'){
				currentData.partner = slug;
			}


			// Set formData and add to currentData.
			formData = $('#settings-form').serializeObject();
			currentData.showname = formData.showname;

			// Create the Cookie
			$.cookie(settings_cookieName, JSON.stringify(currentData), { expires: settings_cookieExp, path: settings_cookiePath });

			// Add Settings to formData
			formData.industry = currentData.industry;
			formData.partner = currentData.partner;

			// Setup the Ajax Post Request
			var data = {
				type: 'settings',
				formData: formData
			};

			$.ajax({
			    type: "POST",
			    url: settings_post_location,
			    contentType: 'application/json',
			    data: JSON.stringify(data)
			}).fail(function() {
			    console.log( "Settings Action Error" );
			}).success(function() {
				console.log( "Settings Action Success!" );
				$('.settings-success-text').addClass('active');
			});

		}
	});
}

// Solely used to setup current cookie/settings data when on the settings page, or if on the home screen.
function settingsPageInits(){
	var currentData;

	if ($.cookie(settings_cookieName) != undefined){
		currentData = JSON.parse($.cookie(settings_cookieName));
		if($('.settings-page')[0]){
			$('.settings-filter-industry').filter("[data-settings-filter-slug='"+currentData.industry+"']").addClass('active');
			$('.settings-filter-partner').filter("[data-settings-filter-slug='"+currentData.partner+"']").addClass('active');

			$('.trade-show-name').val(currentData.showname);
		}
		
		if($('.home-menu')[0]){
			$('.media_buffet_home_section').filter("[data-home-media-buffet='"+currentData.industry+"']").addClass('active');
		}

		if($('.connect-showname')[0]){
			$('.connect-showname').val(currentData.showname);
		}
	}
}


// Checks that Settings have been configured. If not take them to the Settings page.
function settingsInits(){
	var currentData;
	console.log('SettingsInits Called');
	$.get( settings_post_location, function( data ) {
		if(data.status != "error") {
  			currentData = JSON.parse(data.data);

  			console.log(currentData);

  			if (currentData.formData.industry == '' || currentData.formData.showroom == ''){
  				if (!$('.settings-page')[0]){
  					window.location.replace("/settings.html");
  				}
  			} else {
  				// Override the cookie with latest data in case it changes on another device.
  				$.cookie(settings_cookieName, JSON.stringify(currentData.formData), { expires: settings_cookieExp, path: settings_cookiePath });
  			}
  		} else {
  			console.log('data.status == "error"');
  			console.log(data);
  		}
  		
	}).fail(function() {
	    console.log( "SettingsInit Failure!" );
	}).success(function(){
		console.log( "SettingsInit Get Success! ");
	});
}


// Manual clearing of settings for development purposes.
function settingsClearIt(){
	$.removeCookie('csf_showroom_settings');
	var currentData = {
		'industry': '',
		'partner': '',
		'showname': ''

	}
	var data = {
		type: 'settings',
		formData: currentData
	};

	$.ajax({
	    type: "POST",
	    url: settings_post_location,
	    contentType: 'application/json',

	    data: JSON.stringify(data)
	}).fail(function() {
	    console.log( "settingsClearIt Fail" );
	}).success(function(){
		console.log( "settingsClearIt Success");
	});
}




// TV TABLET TRANSFER CODE
function tvTabletTransferInit() {
    var socket = io();
    var requester = false;
    socket.emit('TEST!');
	if(document.documentElement.clientWidth >= config.breakpoints.showroom.touch) {
    	socket.on('request', function(msg){
    		var response;
	    	var cookie = $.cookie(solutions_cookieName);
	    	var currentPage = location.pathname;

	    	response = {"cookie" : cookie, "currentPage" : currentPage};
	    	console.log("REQUESTED");
	    	socket.emit('response', response);
			$.removeCookie(solutions_cookieName, { path: solutions_cookiePath });
	    	console.log("REPLY SENT");
	    	if(!requester) {
	    		location.pathname = '/';
	    	}
	    });
    }

    $('#settings-transfer-start').on('click', function(e) {
    	console.log('CLICK!');
    	socket.emit('request');
    	requester = true;
    });

    socket.on('response', function(data) {
    	console.log("RECIEVED");
    	if(requester) {
			$.cookie(solutions_cookieName, data.cookie, { expires: solutions_cookieExp, path: solutions_cookiePath });
			requester = false;
			$('.settings-section-title.cart-transfer-success').fadeIn();
			setTimeout(function() {
				location.pathname = data.currentPage;
			}, 1000)
    	}
    	
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

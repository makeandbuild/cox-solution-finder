// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Global Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

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
function itemNavigationAlternate(navigationItem, item){
	navigationItem.on('click',function(){
		var keystone_id = $(this).data('navigationitem');
		var theItem = item.filter("[data-item='" + keystone_id + "']");
		navigationItem.removeClass('active');
		$(this).addClass('active');
		theItem.addClass('active').siblings().removeClass('active');
	});
}

// Simple ScrollTo Function
function customScrollTo(toBeScrolled, whereToScroll, time){
	if(typeof(time)==='undefined') time = 200;
	toBeScrolled.animate({
        scrollTop: whereToScroll
    }, time);
}

// Take a set of elements and euqal their heights.
function equalHeights(parent, selector){
	if (selector[0] && parent[0]){
		parent.each(function(parentI, parentE){
			var parent = $(this);
			var itemSet = $(this).find(selector);
			var newHeight = 0;
			itemSet.each(function(itemIndex, e){
				if ($(this).height() > newHeight){
					newHeight = $(this).height();
				}
			});
			itemSet.each(function(e, i){
				$(this).height(newHeight);
			});
		})

	}
}

function inputClear(){
	$('.form-group').on('click',function(){
		if ($(this).children('input').attr('type', 'text')){
			$('.has-form-empty').removeClass('has-form-empty');
			$(this).addClass('has-form-empty');
		}
	});
	$('.form-empty').on('click',function(){
		$(this).siblings('input').val('').focus();
	});
	$('#body').not($('input')).on('click',function(e){
		if (!$(e.target).hasClass('form-control') && !$(e.target).parents('.has-form-empty')[0] && !$(e.target).parents('.keyboard-container')[0]){
			$('.has-form-empty').removeClass('has-form-empty');
		}
	});
}

// The main navigation function for showing the blocks and blurring background.
function navigationModal(){

	$('.navigation-item-list li.active').addClass('current');

	$('.navigation-modal-item').on('click',function(){


		$scope = {};
		$scope.$tiles = $('.navigation-modal-tiles');
		$scope.$glass = $('.the-looking-glass');
		$scope.$solutions = $('.my-solutions-link');
		$scope.glassActive = $scope.$glass.hasClass('active');
		$scope.$navItems = $('.navigation-modal-item');
		$scope.$navItem = $(this);
		$scope.$selector = $(this).data('navigation-modal-item');
		$scope.$target = $scope.$tiles.filter("[data-navigation-modal='" + $scope.$selector + "']");
		$scope.tilesActive = $scope.$tiles.hasClass('active');
		$scope.$allTiles = $('.navigation-modal-tile');
		$scope.$activePage = $('.navigation-item-list li.current');


		if(!$scope.$target.hasClass('active')){
			$scope.$glass.removeClass('active');
			$scope.$solutions.removeClass('active');
			$scope.$tiles.removeClass('active');
			$scope.$allTiles.removeClass('active');
			$scope.$navItems.removeClass('viewing');

			$scope.$glass.toggleClass('active');
			$scope.$solutions.toggleClass('active');
			setTimeout(function(){
				$scope.$target.toggleClass('active');
				$scope.$target.find('.navigation-modal-tile').toggleClass('active');
				$scope.$navItem.toggleClass('viewing');
				$scope.$activePage.removeClass('active');
			},150);
		} else {
			setTimeout(function(){
				$scope.$target.find('.navigation-modal-tile').toggleClass('active');
			},0);
			setTimeout(function(){
				$scope.$glass.toggleClass('active');
				$scope.$solutions.toggleClass('active');
			},150);
			$scope.$target.toggleClass('active');
			$scope.$navItem.toggleClass('viewing');
			$scope.$activePage.addClass('active');
		}


	});
	$('#body, .navigation-modal-tiles').not('.navigation-modal-tile').on('click', function(e){
		if (!$(e.target).hasClass('video-link') && !$(e.target).hasClass('modal') && !$(e.target).hasClass('story-link') && !$(e.target).hasClass('vjs-big-play-button') && !$(e.target).hasClass('vjs-tech')){
			$('.the-looking-glass, .navigation-modal-tiles, .navigation-modal-tile, .my-solutions-link').removeClass('active');
			$('.navigation-modal-item').removeClass('active');
			$('.navigation-modal-item').removeClass('viewing');
			$('.navigation-item-list li.current').addClass('active');
		}
	});
}


function initCheckbox(){
	var checkboxSet = $('.input-checkbox-group');
	if (checkboxSet[0]){
		checkboxSet.each(function(){
			var input = $('#'+$(this).data('checkbox-input'));
			$(this).children('.input-checkbox-value').append('<span>'+input.data('checkbox-value')+'</span>');
			if (input.attr('checked')){
				$(this).addClass('active');
			}
		})
	}

	// if($('body').hasClass('showroom')){
	// 	var waitForMe = false;
	// 	$('.input-checkbox-group').on('mouseover',function(e){
	// 		if(!waitForMe){
	// 			waitForMe = true;
	// 			var input = $('#'+$(this).data('checkbox-input'));
	// 			if ($(this).hasClass('active')){
	// 				$(this).removeClass('active');
	// 				input.removeAttr('checked');
	// 			} else {
	// 				$(this).addClass('active');
	// 				input.attr('checked', 'checked');
	// 			}
	// 			setTimeout(function(){
	// 				waitForMe = false;
	// 				e.stopPropagation();
	// 			},1000);
	// 		}
	// 	});
	// }

	$('.input-checkbox-group').on('click',function(){
		var input = $('#'+$(this).data('checkbox-input'));
		if ($(this).hasClass('active')){
			$(this).removeClass('active');
			input.removeAttr('checked');
		} else {
			$(this).addClass('active');
			input.attr('checked', 'checked');
		}
	});




}

function initDropdownSelect(){
	$('.dropdown-select-item').on('click',function(){
		var value = $(this).data('value');
		var label = $(this).data('label');
		var dropdown = $(this).parents('.dropdown-select');

		dropdown.find('.dropdown-select-current').html(label);
		dropdown.siblings('select')
		.children().filter("[value='" + value + "']")
		.attr('selected', true)
		.siblings()
		.removeAttr('selected');
	})
}



// Video Functions

// Reload Video
function reloadVideo(videoID){
	var player = videojs(videoID);
	player.load();
}

// Add this class for easy closing of videos.
function videoClose(){
	$('.csf-content-close').on('click',function(){
		if ($(this).parent().hasClass('csf-video-modal')){
			var selector = $(this).data('video-close');
			reloadVideo(selector);
			$('.vjs-big-play-button').removeClass('csf-active');
		}

	});
}


// Initiate the link for the modal the normal bootstrap approach.
// On the link add the data attribute: `data-video-data` and pass the keystone video array.
function modalContent(){
	$('.video-link, .story-link, .image-link').on('click',function(){
		// Inits
		var modalTitle = $(this).data('title');

		if ($(this).hasClass('video-link')){
			var videoData = $(this).data('video-data');
			var video = $('.modal.csf-video-modal video');
			if (videoData.background && videoData.background.url) {
				video.attr('poster', videoData.background.url);
			} else if (videoData.poster && videoData.poster.url) {
				video.attr('poster', videoData.poster.url);
			}

			//Checks if Firefox 34 and loads webm as videojs src.
			if($('.ie50')[0] && videoData.video_webm.url){
				if(videoData.video_webm.url) {
					if ( /^\/\//.test(videoData.video_webm.url) ) {
						video.attr('src', "http:"+videoData.video_webm.url);
					} else {
						video.attr('src', videoData.video_webm.url);
					}
				}
			} else {
				if(videoData.video.url){
					if ( /^\/\//.test(videoData.video.url) ) {
						video.attr('src', "http:"+videoData.video.url);
					} else {
						video.attr('src', videoData.video.url);
					}
				}
			}

			//Loads MP4 and WEBM
			if(videoData.video.url){
				if ( /^\/\//.test(videoData.video.url) ) {
					video.children('source').first().attr('src', "http:"+videoData.video.url);
				} else {
					video.children('source').first().attr('src', videoData.video.url);
				}
			}
			if(videoData.video_webm.url){
				if ( /^\/\//.test(videoData.video_webm.url) ) {
					video.children('source').last().attr('src', "http:"+videoData.video_webm.url);
				} else {
					video.children('source').last().attr('src', videoData.video_webm.url);
				}
			}


			$('.modal.csf-video-modal .video-title').html(modalTitle);
			$('.modal.csf-video-modal .video-title').appendTo($('.modal.csf-video-modal .video-js'));
		}
		if ($(this).hasClass('story-link')){
			var storyData = $(this).data('story-data');
			var storyContent = storyData.content.html;
			var storyImageURL = storyData.featured_image.url;

			$('.modal .story-content').html(storyContent);
			$('.modal .story-container .story-title').html(modalTitle);
			if (storyImageURL){
				$('.modal .story-featured-image').css('background-image', 'url('+storyImageURL+')');
			}

		}

		if ($(this).hasClass('image-link')){
			var imageURL = $(this).data('image-data');

			$('.modal .image-container .image-title').html(modalTitle);
			if (imageURL){
				//$('.modal .imageModal-featured-image').css('background-image', 'url('+imageURL+')');
				$('.modal .image-wrapper img').attr('src', imageURL);
			}

		}

		// if($('body').hasClass('companion-site')){
		// 	if(document.documentElement.clientWidth >= config.breakpoints.site.mobile) {
		// 	    if ($(window).scrollTop() == 0){
		// 	    	$('.csf-content-close').css('top', '96px');
		// 	    } else if ($(window).scrollTop() > 0 && $(window).scrollTop() < 96){
		// 	    	$('.csf-content-close').css('top', (96-$(window).scrollTop())+'px');
		// 	    } else {
		// 	    	$('.csf-content-close').css('top', '0');
		// 	    }
		// 	} else {
		// 		$('.csf-content-close').css('top', '0');
		// 	}
		// }


	});

	$.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	           o[this.name] = this.value || '';
	       }
	   });
	   return o;
	};
}


//Adds regex for first name / last name
jQuery.validator.addMethod("firstandlast", function(value, element) {
  return this.optional(element) || /(\w{2,}) (\w{2,})(( )?(\-)?(\w{1,}))?/g.test(value);
}, "Please specify the correct domain for your documents");

function formValidation() {
	if($('.connect-form').length) {
		$('.connect-form').validate({
	    	debug: false,
			rules: {
				'name.full': {
					required: true,
					firstandlast: true
				},
				'email' : {
					required: true,
					email: true
				},
				'zipcode' : {
					required: true,
					minlength: 5,
					maxlength: 5,
					number: true
				}
			},
			messages : {
				'name.full' : 'Please enter your first and last name.',
				'email' : 'Please enter a valid Email address.',
				'zipcode' : 'Please enter a valid ZIP Code'
			},
			errorPlacement: function(error, element) {
		    	error.insertAfter(element);
		      	$(element).parent('.form-group').addClass('has-error');
			},
			highlight: function(element) {   // <-- fires when element has error
				$(element).parent('.form-group').addClass('has-error');
				$(element).addClass('error');
			},
			unhighlight: function(element) {   // <-- fires when element has error
				$(element).parent('.form-group').removeClass('has-error');
				$(element).removeClass('error');
			}

		});
	}
}

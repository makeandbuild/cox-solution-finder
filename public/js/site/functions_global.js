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
	$('.video-link, .story-link').on('click',function(){
		// Inits
		if ($(this).hasClass('video-link')){
			var videoData = $(this).data('video-data');
			var video = $('.modal.csf-video-modal video');
			video.attr('poster', videoData.background.url);

			//Checks if Firefox 34 and loads webm as videojs src.
			if($('.ie50')[0] && videoData.video_webm.url){
				if(videoData.video_webm.url){
					video.attr('src', "http:"+videoData.video_webm.url);
				}
			} else {
				if(videoData.video.url){
					video.attr('src', "http:"+videoData.video.url);
				}
			}
			
			//Loads MP4 and WEBM
			if(videoData.video.url){
				video.children('source').first().attr('src', "http:"+videoData.video.url);
			}
			if(videoData.video_webm.url){
				video.children('source').last().attr('src', "http:"+videoData.video_webm.url);
			}
			

			$('.modal.csf-video-modal .video-title').html(videoData.title);
			$('.modal.csf-video-modal .video-title').appendTo($('.modal.csf-video-modal .video-js'));
		}
		if ($(this).hasClass('story-link')){
			var storyData = $(this).data('story-data');
			var storyContent = storyData.content.html;
			var storyTitle = storyData.title;
			var storyImage = storyData.featured_image.url;

			$('.modal .story-content').html(storyContent);
			$('.modal .story-container .story-title').html(storyTitle);
			if (storyImage){
				$('.modal .story-featured-image').css('background-image', 'url('+storyImage+')');
			}
			
		}
	

		if($('body').hasClass('companion-site')){
			if(document.documentElement.clientWidth >= config.breakpoints.site.mobile) {
			    if ($(window).scrollTop() == 0){
			    	$('.csf-content-close').css('top', '96px');
			    } else if ($(window).scrollTop() > 0 && $(window).scrollTop() < 96){
			    	$('.csf-content-close').css('top', (96-$(window).scrollTop())+'px');
			    } else {
			    	$('.csf-content-close').css('top', '0');
			    }
			} else {
				$('.csf-content-close').css('top', '0');
			}
		}
		
		
	});
}

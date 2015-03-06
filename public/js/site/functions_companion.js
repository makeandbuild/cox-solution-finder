// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Companion Site Functions
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

// Returns IE Version Number
function ieVersion() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0)
        return 11;
    else if (ua.indexOf("Trident/6.0") > 0)
        return 10;
    else if (ua.indexOf("Trident/5.0") > 0)
        return 9;
   	else if (ua.indexOf("Firefox/34") > 0){
   		console.log('FIREFOX!');
   		return 50;
   	} else
        return 0;  // not IE9, 10 or 11
} 


// Tablet Sidebar Navigation
function mobileNavigation(){
	$('.navigation-toggle').on('click', function(){
		if($(this).hasClass('active')){
			$('.navigation-mobile-sub-menu').removeClass('active');
			$('.navigation-item.has-menu').removeClass('viewing');
			$('.navigation-mobile ul').children().removeClass('viewing').children().removeClass('active');
			$('.navigation-mobile ul').children().children('.navigation-mobile-sub-menu').slideUp();
			$('.navigation-mobile-body-background').removeClass('active');
		} else {
			$('.navigation-mobile-body-background').addClass('active');
		}
		$(this).toggleClass('active');
		$('.navigation-mobile').toggleClass('active');

	});
	$('.navigation-item.has-menu').on('click', function(){
		$(this).parent().siblings().removeClass('viewing').children().removeClass('active');
		$(this).parent().siblings().children('.navigation-mobile-sub-menu').slideUp();
		$(this).parent().toggleClass('viewing');
		$(this).siblings('.navigation-mobile-sub-menu').slideToggle();
	})
	$('#body, .navigation-mobile-body-background').on('click', function(e){
		$('.navigation-mobile, .navigation-toggle, .navigation-mobile-sub-menu').removeClass('active');
		$('.navigation-item.has-menu').removeClass('viewing');
		$('.navigation-mobile ul').children().removeClass('viewing').children().removeClass('active');
		$('.navigation-mobile ul').children().children('.navigation-mobile-sub-menu').slideUp();
		$('.navigation-mobile-body-background').removeClass('active');
	});
}


function setMobileNavHeight(){
	$('.navigation-mobile').css('max-height', document.documentElement.clientHeight - 50 + 'px');
}

function customHomeNameAdjust(){
	if ($('.hero-custom-name')[0]){
		var target = $('.hero-custom-name');
		var length = target[0].innerHTML.length;
		if (length > 9 && length < 16){
			target.css('font-size', '3em');
		} else if (length > 15 && length < 21){
			target.css('font-size', '2em');
		} else if (length > 20){
			target.css('font-size', '1.5em');
			target.css('font-weight', 'normal');
		}
	}
}

function compensateForFooter(toChange, elementArray, totalHeightElement){
	if(toChange[0]){
		var height = 0;
		for (var i = 0; i < elementArray.length; i++){
			height += parseInt(elementArray[i].height());
		}
		if (parseInt(totalHeightElement.height()) >= height){
			height = (parseInt(totalHeightElement.height()) - height) + toChange.height();
			toChange.css('height',height+'px');
		}
	
	}
}

function piwikCompanionActions() {
	if(_paq) {

		$('.pi-switch').on('click', function(e) {
			_paq.push(['trackEvent', 'User', 'Switch User']);
		});

		$('.pi-resource').on('click', function(e) {
			_paq.push(['trackEvent', 'Resource', 'Click', $(e.currentTarget).attr('href')]);
		});

		$('.pi-products').on('click', function(e) {
			var label = 'unknown';
			if($(e.currentTarget).is('a.product-navigation-item')) {
				label = $(e.currentTarget).find('span').text();
			}
			if($(e.currentTarget).is('.product-navigation-item-container')) {
				label = $(e.currentTarget).find('article > span').text();
			}
			_paq.push(['trackEvent', 'Product', 'Click', label]);
		});
	}
}
$(function () {

	var resolutions = {
						'companion' : 'width=1920,height=1080,scrollbars=1',
						'showroom-tv' : 'width=1920,height=1080,scrollbars=0',
						'showroom-tablet' : 'width=1024,height=768,scrollbars=0'
					};
	if(!pathname) {
		pathname = '/admin/preview' + $('.preview').parents('form').find('input[name="pathname"]').val();
	}
	
	var modequery = '?mode=companion';
	if(mode == 'showroom-tv' || mode == 'showroom-tablet') {
		modequery = '?mode=showroom';
	}
	slugQuery = '&originalSlug=' + $('input[name="slug"]').val();
	window.open(pathname + modequery + slugQuery, '_blank', resolutions[mode] + 'resizeable=0,titlebar=0,toolbar=0');
});
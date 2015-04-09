$(function () {

	var resolutions = {
						'companion' : 'width=' + window.width + ',height=' + window.height,
						'showroom-tv' : 'width=1920,height=1080,',
						'showroom-tablet' : 'width=1024,height=768,'
					};
	if(!pathname) {
		pathname = '/admin/preview' + $('.preview').parents('form').find('input[name="pathname"]').val();
	}
	
	var modequery = '?mode=companion';
	if(mode == 'showroom-tv' || mode == 'showroom-tablet') {
		modequery = '?mode=showroom';
	}
	slugQuery = '&originalSlug=' + $('input[name="slug"]').val();
	window.open(pathname + modequery + slugQuery, '_blank', resolutions[mode] + 'resizeable=no,titlebar=no,toolbar=no');
});
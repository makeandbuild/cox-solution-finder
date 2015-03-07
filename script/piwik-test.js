require('dotenv').load();

var piwik = require('piwik').setup(process.env.PIWIK_URI, process.env.PIWIK_TOKEN)
	, moment = require('moment')

piwik.track({
			idsite: 1,
			url: 'http://nuc.coxsolutionfinder.com/andytest',
			cdt: moment().subtract(1,'day').format('YYYY-MM-DD HH:mm:ss')
		}, console.log
)

var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Variables = require('./variables');

exports.resource = function () {

	return {
		title: { type: String, label: "Resource Title" },
		svg_icon: {
			type: Types.Select,
			label: "Icon",
			options: Variables.svg_icons()
		},
		resource_type: { type: Types.Boolean, default: false, label: "Is this resource an external link?", note: "Check this box if this is an external link. Do not check the box if the link below is a PDF for download."},
		resource_link: { type: String, initial:false, label: "Resource Linked File", note: "Enter the full url for the item to download. (Example: 'http:/www.example.com/my_file.pdf')" },
		description: { type: Types.Textarea, height: 100, label: "Resource Description" }
	}

};

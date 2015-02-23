var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Homepage Model
 * =============
 */

var Homepage = new keystone.List('Homepage', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});

var scene = {
	title: {
		type: Types.Text,
		label: "Showroom Stage: Scene Name"
	},
	featured_image: {
		type: Types.S3File,
		label: 'Featured Image',
		note: "Upload a 2x image. This image will display as the clicked on navigation item on the Showrooom Stage Main View",
		s3path: 'uploads/images'
	}
}
var scene_with_text = {
	title: {
		type: Types.Text,
		label: "Showroom Stage: Scene Name",
		note: "Scene will use text from the Companion Site Hero section, and the act displayed will be the Hero Video used globally."
	},
}

var map = {
	map_overlay_enable: {
		type: Types.Boolean,
		label: "Enable the following map overlay? If unchecked, map will not show.",
		default: "false"
	},
	title: {
		type: Types.Text,
		label: "Map Overlay Name"
	},
	map: {
		type: Types.S3File,
		label: 'Media Video: Preview Image',
		note: "Upload a 3400px by 1300px image to be the map overlay image. Image should be the map, with text and overlay, with a blurred white background.",
		s3path: 'uploads/images/map_overlays'
	}
}

var factoid = {
	factoid_enable: {
		type: Types.Boolean,
		label: "Enable the following factoid? If unchecked, factoid will not show.",
		default: "false"
	},
	title: {
		type: Types.Text,
		label: "Factoid Name"
	},
	front_image: {
		type: Types.S3File,
		label: 'Front factoid image',
		note: "",
		s3path: 'uploads/images/factoids'
	},
	back_image: {
		type: Types.S3File,
		label: 'Back factoid image',
		note: "",
		s3path: 'uploads/images/factoids'
	}
}

Homepage.add({
	name: { type: String, required: true, index: true, noedit: true },

	//Hero Area
	hero: {
		greeting: {
			type: Types.Text,
			label: "Greeting",
			note: "The word before the name of the customer when on the customized home view. For example you would enter 'Hi' and the text would read 'Hi Mark'."
		},
		business_count: { type: Types.Text, label: "Default Home Number of Business's Powered by COX Business", note: "The number that will appear on the default home page." },
		video: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Hero Video: Title",
				note: "1-2 Words"
			},
			video_choice: {
				type: Types.Boolean,
				label: "Enable Video?",
				note: "If not checked, the text for SEE WHY and the play icon will not show.",
				default: "false"
			},
			video: {
				type: Types.S3File,
				label: 'Hero Video: File',
				note: 'MP4 Only. IMPORTANT: This will be the default video for all all industries/partners if no video is chosen.',
				allowedTypes: ['video/mp4'],
				s3path: 'uploads/videos'
			},
			background: {
				type: Types.S3File,
				label: 'Hero Video: Preview Image',
				note: "Upload a 2X Image to be preview image for the video.",
				s3path: 'uploads/images'
			}
		},
		background: {
			type: Types.S3File,
			label: 'Hero Background',
			note: "Upload a normal RESOLUTION SIZE image at least. Image will have a blue overlay",
			s3path: 'uploads/images'
		},
		content: { type: Types.Html, wysiwyg: true, height:200, label: "Custom Home: Content" }
	},

	default_heading: { type: Types.Textarea, height: 200, label: "Default Heading" },
	default_content: { type: Types.Textarea, height: 200, label: "Default Content" },
	media_buffet: {
		video: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Video: Title",
				note: "1-2 Words"
			},
			video_choice: {
				type: Types.Boolean,
				label: "Enable Video?",
				note: "If not checked, no video will show and the image associated will show without the play icon.",
				default: "false"
			},
			video: {
				type: Types.S3File,
				label: 'Media Video: File',
				note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
				allowedTypes: ['video/mp4'],
				s3path: 'uploads/videos'
			},
			background: {
				type: Types.S3File,
				label: 'Media Video: Preview Image',
				note: "Upload a 2X Image to be preview image for the video.",
				s3path: 'uploads/images'
			}
		},
		values: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Values: Title",
				note: "1-2 Words"
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Media Values: Content",
				note: "Limit to around 150 characters for optimal size."
			}
		},
		story: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Story: Title",
				note: "1-2 Words"
			},
			content: { type: Types.Markdown,
				wysiwyg: true,
				height:1000,
				label: "Media Story: Content",
				note: "No set limit for characters. Overflowed content will not be shown. All headers will be dark blue."
			},
			featured_image: {
				type: Types.S3File,
				label: 'Media Story: Featured Image',
				note: "Upload a 2X Image to be the vertically cropped preview image for the article. This image will also display in full in the article modal.",
				s3path: 'uploads/images'
			}

		},
		facts: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Facts: Title",
				note: "1-2 Words"
			},
			content_choice: {
				type: Types.Boolean,
				label: "Media Facts: Use an image instead of content?",
				default: "false"
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:400,
				// dependsOn: { content_choice: false },
				label: "Media Facts: Content",
				note: "1 Sentence. Bold content that will use large text, and it will change font size, color, and stay on its own line."
			},
			featured_image: {
				type: Types.S3File,
				// dependsOn: { content_choice: true },
				label: 'Media Facts: Featured Image',
				note: "Upload a 2X Image to be the featured image for a fact in place of content.",
				s3path: 'uploads/images'
			}
		}
	},
	connect_background: {
		type: Types.S3File,
		label: 'Connect Background',
		note: "Upload a normal RESOLUTION SIZE image at least. Right side of the image will have a blue overlay",
		s3path: 'uploads/images'
	},
	stage_background: {
		type: Types.S3File,
		label: 'Showroom Stage: Background',
		note: "Upload a 2x image. Image will have a white overlay",
		s3path: 'uploads/images'
	},
	stage: {
		scene_one: scene,
		scene_two: scene_with_text,
		scene_three: scene
	},
	act: {
		act_one: {
			factoid_one: factoid,
			factoid_two: factoid,
			factoid_three: factoid,
			factoid_four: factoid,
			factoid_five: factoid,
		},
		act_three: {
			map_one: map,
			map_two: map,
			map_three: map,
			map_four: map,
			map_five: map,
			map_six: map
		},
	}
});

Homepage.register();

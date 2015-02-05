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
	content_choice: {
		type: Types.Boolean,
		label: "Use the Business Count Box using the data in the Companion Hero Section?",
		default: false
	},
	featured_image: {
		type: Types.S3File,
		label: 'Featured Image',
		note: "Upload a 2x image. This image will display as the clicked on navigation item on the Showrooom Stage Main View",
		s3path: 'uploads/images'
	}
}


Homepage.add({
	name: { type: String, required: true, index: true, noedit: true },

	//Hero Area
	hero: {
		business_count: { type: Types.Text, label: "Default Home Number of Business's Powered by COX Business", note: "The number that will appear on the default home page." },
		video: {
			type: Types.S3File,
			label: 'Default Home: Hero Video',
			note: 'MP4 Only',
			allowedTypes: ['video/mp4'],
			s3path: 'uploads/videos'
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
			video: {
				type: Types.S3File,
				label: 'Media Video: File',
				note: 'MP4 Only',
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
			content: { type: Types.Html,
				wysiwyg: true,
				height:1000,
				label: "Media Values: Content",
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
		scene_two: scene,
		scene_three: scene
	}
});

Homepage.register();

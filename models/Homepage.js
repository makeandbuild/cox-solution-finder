var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');

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
		label: "Showroom Stage: Scene Name",
		m_cms: { 
			validations: {
				required: true,
				rangelength: [1,25]
			}, 
			showroom: true, 
			companion: false 
		} 
	},
	featured_image: {
		type: Types.S3File,
		label: 'Featured Image',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "Upload a 2x image. This image will display as the clicked on navigation item on the Showrooom Stage Main View",
		s3path: 'uploads/images',
		m_cms: { showroom: true, companion: true }
	}
}
var scene_with_text = {
	title: {
		type: Types.Text,
		label: "Showroom Stage: Scene Name",
		note: "Scene will use text from the Companion Site Hero section, and the act displayed will be the Hero Video used globally.",
		m_cms: {
 			validations: {
				required: true,
				rangelength: [1,25]
			}, 
			showroom: true, 
			companion: false 
		} 
	},
}

var map = {
	map_overlay_enable: {
		type: Types.Boolean,
		label: "Enable the following map overlay? If unchecked, map will not show.",
		default: "false",
		m_cms: {showroom: true, companion: false }

	},
	title: {
		type: Types.Text,
		label: "Map Overlay Name",
		m_cms: { 
 			validations: {
				required: true,
				rangelength: [1,50]
			}, 
			showroom: true, 
			companion: false 
		}
	},
	map: {
		type: Types.S3File,
		label: 'Map Image',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "Upload a 3400px by 1300px image to be the map overlay image. Image should be the map, with text and overlay, with a blurred white background.",
		s3path: 'uploads/images/map_overlays',
		m_cms: { showroom: true, companion: false }
	},
	products: { 
		type: Types.Relationship, 
		label: "Related Products", 
		note: "Choose 3 Products to show up next to the Map Overlay. Showroom only.", 
		ref: 'Product', 
		many: true, 
		initial: false,
		m_cms: { limit: 3, showroom: true, companion: false }
	},
}

var factoid = {
	factoid_enable: {
		type: Types.Boolean,
		label: "Enable the following factoid? If unchecked, factoid will not show.",
		default: "false",
		m_cms: { showroom: true, companion: false }
	},
	title: {
		type: Types.Text,
		label: "Factoid Name",
		m_cms: {
			validations: {
				required: true,
				rangelength: [1,25]
			}, 
			showroom: true, 
			companion: false 
		}
	},
	front_image: {
		type: Types.S3File,
		label: 'Front factoid image',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "",
		s3path: 'uploads/images/factoids',
		m_cms: { showroom: true, companion: false }
	},
	back_image: {
		type: Types.S3File,
		label: 'Back factoid image',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "",
		s3path: 'uploads/images/factoids',
		m_cms: { showroom: true, companion: false }
	}
}

Homepage.add(
	{
		name: {
			type: String,
			required: true,
			index: true,
			noedit: true
		},
		editor: {
			type: Types.Relationship, 
			ref: 'User'
		},
		checkoutTime: {
			type: Types.Datetime,
			default: Date.now()
		},
		lastEditAt: {
			type: Types.Datetime,
			required:false
		},
		hero: {
			greeting: {
				type: Types.Text,
				label: "Greeting",
				note: "The word before the name of the customer when on the customized home view. For example you would enter 'Hi' and the text would read 'Hi Mark'.",
				m_cms: { 
		 			validations: {
						required: true,
						rangelength: [1,10]
					}, 
					showroom: false, 
					companion: true 
				}
			},
			business_count: {
				type: Types.Text,
				label: "Default Home Number of Business's Powered by COX Business",
				note: "The number that will appear on the default home page.",
				m_cms: { 
					validations: {
						required: true,
						rangelength: [1,15]
					}, 
					showroom: false, 
					companion: true 
				}
			},
			video: {
				title: { type: Types.Html,
					wysiwyg: true,
					height:40,
					label: "Hero Video: Title",
					note: "1-2 Words",
					m_cms: { 
						htmlEditor: false,
						validations: {
							required: true,
							twoFieldHtmlMax: 15
						}, 
						showroom: false, 
						companion: true 
					}
				},
				video_choice: {
					type: Types.Boolean,
					label: "Enable Video?",
					note: "If not checked, the text for SEE WHY and the play icon will not show.",
					default: "false",
					m_cms: { showroom: false, companion: false }
				},
				video: {
					type: Types.S3File,
					label: 'Hero Video: MP4',
					note: 'MP4 Only. IMPORTANT: This will be the default video for all all industries/partners if no video is chosen.',
					allowedTypes: ['video/mp4'],
					s3path: 'uploads/videos',
					m_cms: { showroom: true, companion: true }
				},
				video_webm: {
					type: Types.S3File,
					label: 'Hero Video: WebM',
					note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
					allowedTypes: ['video/webm'],
					s3path: 'uploads/videos',
					m_cms: { showroom: true, companion: true }
				},
				background: {
					type: Types.S3File,
					label: 'Hero Video: Preview Image',
					allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
					note: "Upload a 2X Image to be preview image for the video.",
					s3path: 'uploads/images',
					m_cms: { showroom: true, companion: true }
				}
			},
			background: {
				type: Types.S3File,
				label: 'Hero Background',
				allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
				note: "Upload a normal RESOLUTION SIZE image at least. Image will have a blue overlay",
				s3path: 'uploads/images',
				m_cms: { showroom: true, companion: true }
			},
			content: {
				type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Custom Home: Content",
				m_cms: { 
					htmlEditor: true, 
					validations: {
						required: true,
						htmlField: [1,300]
					},
					showroom: false, companion: true 
				}
			}
		},

		default_heading: {
			type: Types.Textarea,
			height: 200,
			label: "Default Heading",
			m_cms: { 
				validations: {
					required: true,
					rangelength: [1,150]
				}, 
				showroom: true, 
				companion: true 
			}
		},
		default_content: {
			type: Types.Textarea,
			height: 200,
			label: "Default Content",
			m_cms: { 
				validations: {
					required: true,
					rangelength: [1,300]
				}, 
				showroom: true, 
				companion: true 
			}

		},
		media_buffet: Fields.media_buffet(),

		connect_background: {
			type: Types.S3File,
			label: 'Connect Background',
			allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
			note: "Upload a normal RESOLUTION SIZE image at least. Right side of the image will have a blue overlay",
			s3path: 'uploads/images',
			m_cms: { showroom: false, companion: false }
		},
		stage_background: {
			type: Types.S3File,
			label: 'Showroom Stage: Background',
			allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
			note: "Upload a 2x image. Image will have a white overlay",
			s3path: 'uploads/images',
			m_cms: { showroom: true, companion: false }
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
	}
);

Homepage.schema.methods.updateableFields = function() {
	return 'name, hero.greeting, hero.business_count, hero.video.title, hero.video.video_choice, hero.video.video, hero.video.video_webm, hero.video.background, hero.background, hero.content, default_heading, default_content, media_buffet.media_section_one.title, media_buffet.media_section_one.type, media_buffet.media_section_one.thumbnail, media_buffet.media_section_one.video.video, media_buffet.media_section_one.video.video_webm, media_buffet.media_section_one.video.poster, media_buffet.media_section_one.image, media_buffet.media_section_one.story.content, media_buffet.media_section_one.story.featured_image, media_buffet.values.title, media_buffet.values.content, media_buffet.facts.title, media_buffet.facts.featured_image, media_buffet.media_section_two.title, media_buffet.media_section_two.type, media_buffet.media_section_two.thumbnail, media_buffet.media_section_two.video.video, media_buffet.media_section_two.video.video_webm, media_buffet.media_section_two.video.poster, media_buffet.media_section_two.image, media_buffet.media_section_two.story.content, media_buffet.media_section_two.story.featured_image, connect_background, stage_background, stage.scene_one.title, stage.scene_one.featured_image, stage.scene_two.title, stage.scene_three.title, stage.scene_three.featured_image, act.act_one.factoid_one.factoid_enable, act.act_one.factoid_one.title, act.act_one.factoid_one.front_image, act.act_one.factoid_one.back_image, act.act_one.factoid_two.factoid_enable, act.act_one.factoid_two.title, act.act_one.factoid_two.front_image, act.act_one.factoid_two.back_image, act.act_one.factoid_three.factoid_enable, act.act_one.factoid_three.title, act.act_one.factoid_three.front_image, act.act_one.factoid_three.back_image, act.act_one.factoid_four.factoid_enable, act.act_one.factoid_four.title, act.act_one.factoid_four.front_image, act.act_one.factoid_four.back_image, act.act_one.factoid_five.factoid_enable, act.act_one.factoid_five.title, act.act_one.factoid_five.front_image, act.act_one.factoid_five.back_image, act.act_three.map_one.map_overlay_enable, act.act_three.map_one.title, act.act_three.map_one.map, act.act_three.map_one.products, act.act_three.map_two.map_overlay_enable, act.act_three.map_two.title, act.act_three.map_two.map, act.act_three.map_two.products, act.act_three.map_three.map_overlay_enable, act.act_three.map_three.title, act.act_three.map_three.map, act.act_three.map_three.products, act.act_three.map_four.map_overlay_enable, act.act_three.map_four.title, act.act_three.map_four.map, act.act_three.map_four.products, act.act_three.map_five.map_overlay_enable, act.act_three.map_five.title, act.act_three.map_five.map, act.act_three.map_five.products, act.act_three.map_six.map_overlay_enable, act.act_three.map_six.title, act.act_three.map_six.map, act.act_three.map_six.products, lastEditAt';
}

Homepage.register();

import Vue from 'vue';
import Storage from './storage';

function render (options) {
	const container = options.element;
	const flickrData = options.data;
	const imageStore = new Storage();
	const selectedImages = imageStore.load();
	const model = {
		loading: false,
		errorMessage: null,
		images: null
	};

	if (!flickrData || !flickrData.items) {
		// I'm not sure what's the error format for flickr api
		model.errorMessage = 'Cannot load images from flickr. Try refreshing the page maybe?';
	} else if (flickrData.items.length === 0) {
		model.errorMessage = 'Couldn\'t find any image with that tag.';
	} else {
		model.images = flickrData.items.map(item => {
			return {
				src: item.media.m,
				alt: item.title,
				key: item.link,
				selected: selectedImages.indexOf(item.link) !== -1
			};
		});
	}

	new Vue({
		el: container,
		data: model,
		methods: {
			selectImage: function (index) {
				const item = this.images[index];
				const action = item.selected ? 'remove' : 'add';
				this.images.$set(index, Object.assign({}, item, {
					selected: !item.selected
				}));
				imageStore[action](item.key);
			}
		}
	});
}

export { render };

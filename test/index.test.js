import {render} from '../src/index';
import mockData from './sample-data.fixture.json!';

describe('Select images', function () {
	it('remembers toggled images', function (done) {
		render({
			data: mockData,
			element: testElement(),
			ready: pageLoaded,
			destroyed: onDestroy
		});

		function pageLoaded () {
			expect(document.querySelectorAll('.imageElement').length).toBe(20);

			var secondImage = document.querySelectorAll('.imageElement')[1];
			click(secondImage);

			expect(secondImage.classList.contains('selected'));

			// reload
			dispose(this);
		}

		function onDestroy () {
			render({
				data: mockData,
				element: testElement(),
				ready: pageReload,
				destroyed: done
			});
		}

		function pageReload () {
			var secondImage = document.querySelectorAll('.imageElement')[1];
			expect(secondImage.classList.contains('selected'));

			dispose(this);
		}
	});

	it('handles errors from flickr', function (done) {
		render({
			data: {},
			element: testElement(),
			ready: pageLoaded,
			destroyed: done
		});

		function pageLoaded () {
			var errorMessage = document.querySelector('.error').innerText.trim();
			expect(errorMessage).toMatch(/cannot load/i);

			dispose(this);
		}
	});
});

function testElement () {
	var element = document.createElement('div');
	document.body.appendChild(element);
	return element;
}

function click (element) {
	var evt = document.createEvent('Events');
	evt.initEvent('click', true, false);
	element.dispatchEvent(evt);
}

function dispose (vue) {
	setTimeout(function () {
		// make sure this is asynchronous
		vue.$destroy(true);
	}, 10);
}
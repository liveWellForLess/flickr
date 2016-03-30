function Storage (storageKey = 'flickr-selected-images') {
	this.key = storageKey;
}

Storage.prototype.load = function () {
	try {
		return JSON.parse(localStorage.getItem(this.key)) || [];
	} catch (ex) {
		// Either local storage is not available,
		// or the JSON string is corrupted
		write(this.key, []);
		return [];
	}
};

Storage.prototype.add = function (id) {
	// Don't keep a cache of element because local storage
	// can be modified in other tabs
	const elements = this.load();
	if (elements.indexOf(id) === -1) {
		elements.push(id);
	}

	write(this.key, elements);
};

Storage.prototype.remove = function (id) {
	const elements = this.load();
	const previousIndex = elements.indexOf(id);
	// Assuming that there are no duplicate...
	if (previousIndex !== -1) {
		elements.splice(previousIndex, 1);
	}

	write(this.key, elements);
};

function write (key, json) {
	try {
		localStorage.setItem(key, JSON.stringify(json));
	} catch (ex) {
		// Ignore local storage errors
	}
}

export default Storage;
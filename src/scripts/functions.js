export function preload(src) {
	return new Promise(function (resolve) {
		let img = new Image();
		img.onload = resolve;
		img.src = src;
	});
}

export function previewImageParser(s) {
	if (!s.includes('preview.redd.it')) return s;

	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = s;
	[...htmlDoc.querySelectorAll('a')].forEach((e) => {
		if (e.href.includes('preview.redd.it')) {
			const cleanUrl = e.href.replace('/preview.redd.it', '/i.redd.it').split('?')[0];
			e.innerHTML = `<img src="${cleanUrl}" style="max-height:400px"/>`;
		}
	});

	return htmlDoc.innerHTML;
}

export function previewImageParser(s) {
	if (!s.includes('preview.redd.it')) return s;

	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = s;
	[...htmlDoc.querySelectorAll('a')].forEach((ele) => {
		if (ele.href.includes('preview.redd.it')) {
			const cleanUrl = ele.href.replace('/preview.redd.it', '/i.redd.it').split('?')[0];
			ele.outerHTML = `<img alt="" loading="lazy" src="${cleanUrl}" style="max-height:400px" ondblclick="this.dispatchEvent(new CustomEvent('fullImg', { detail: { target: this },bubbles: true, cancelable: true, composed: false }));"/>`;
		}
	});

	return htmlDoc.querySelector('body').innerHTML;
}

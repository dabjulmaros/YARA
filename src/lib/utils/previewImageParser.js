export function previewImageParser(s) {
	if (!(s.includes('preview.redd.it') || s.includes('i.redd.it'))) return s;

	const htmlDoc = document.createElement('html');
	htmlDoc.innerHTML = s;
	[...htmlDoc.querySelectorAll('a')].forEach((ele) => {
		if (
			ele.href.includes('preview.redd.it') ||
			decodeURIComponent(ele.href).includes('//www.reddit.com/media?url=https://i.redd.it/')
		) {
			let parsedEle = ele.href;
			if (
				decodeURIComponent(ele.href).includes(
					'//www.reddit.com/media?url=https://i.redd.it/',
				)
			) {
				parsedEle = decodeURIComponent(ele.href).split('url=')[1];
			}
			const cleanUrl = parsedEle.replace('/preview.redd.it', '/i.redd.it').split('?')[0];
			ele.outerHTML = `<img alt="" loading="lazy" src="${cleanUrl}" style="max-height:400px;display:block" ondblclick="this.dispatchEvent(new CustomEvent('fullImg', { detail: { target: this },bubbles: true, cancelable: true, composed: false }));"/>${
				ele.innerText.includes('preview.redd.it') || ele.innerText.includes('i.redd.it')
					? ''
					: `${ele.innerText}`
			}`;
		} else if (ele.href.includes('i.redd.it')) {
			const cleanUrl = ele.href;
			ele.outerHTML = `<img alt="" loading="lazy" src="${cleanUrl}" style="max-height:400px;display:block" ondblclick="this.dispatchEvent(new CustomEvent('fullImg', { detail: { target: this },bubbles: true, cancelable: true, composed: false }));"/>${
				ele.innerText.includes('preview.redd.it') || ele.innerText.includes('i.redd.it')
					? ''
					: `${ele.innerText}`
			}`;
		}
	});

	return htmlDoc.querySelector('body').innerHTML;
}

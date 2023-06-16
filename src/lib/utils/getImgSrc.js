import { htmlDecode } from '$lib/utils/htmlDecode';
export function getImgSrc(expando) {
	const imgSrcArr = [];
	if (expando.includes('gif')) {
    const match = expando.match(/href="([^"]+)"/);
    imgSrcArr.push(match[1]);
	} else {
		const expandoMatchAll = expando.matchAll(/src="([^"]+)"/g);

		for (const match of expandoMatchAll) {
			const parsed = htmlDecode(match[1]).replace('/preview.redd.it', '/i.redd.it');

			if (!imgSrcArr.includes(parsed.split('?')[0]) && parsed.includes('i.redd.it'))
				imgSrcArr.push(parsed.split('?')[0]);
			else if (!imgSrcArr.includes(parsed) && parsed.includes('external'))
				imgSrcArr.push(parsed);
		}
	}

	return imgSrcArr;
}

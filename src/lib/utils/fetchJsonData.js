export async function fetchJsonData(url) {
	const params = JSON.stringify({
		url: url,
		over18: localStorage.over18,
	});
	const json = await electron.request(params).then((r) => {
		return JSON.parse(r);
	});
	if (json.response == undefined) {
		console.error(json);
		return { error: 'bad stuff happened' };
	}
	if (json.url.includes('com/over18')) {
		return notOver18();
	}
	return json;
}

function notOver18() {
	const retunrObj = {
		status: 403,
		message: [
			'Forbidden',
			'The content on this page is for adults only',
			['You can enable this content by right clicking allowing Over 18 Content'],
		],
	};
	return retunrObj;
}

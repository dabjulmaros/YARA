export async function fetchRedditCommunityImage(subName) {
	if (localStorage.communityProfiles != undefined) {
		const localProfiles = JSON.parse(localStorage.communityProfiles);

		if (localProfiles[subName] != undefined) return localProfiles[subName];
	} else {
		localStorage.communityProfiles = '{}';
	}

	const params = JSON.stringify({
		url: `https://www.reddit.com/${subName}/wiki/index`,
		over18: localStorage.over18,
	});
	const json = await electron.request(params).then((r) => {
		return JSON.parse(r);
	});
	if (json.response == undefined || json.status !== 200) {
		console.error(json);
		return { error: 'Image could not be retrieved' };
	} else return parseImages(json.response, subName);
}

function parseImages(html, subName) {
	const returnArr = { profile: '', banner: '' };
	const profile = html.match(/faceplate-img\n.+src="(.+)"/);
	const banner = html.match(/url\('(.+bannerBackgroundImage.+)'\)/);
	if (profile) {
		if (profile[1]) returnArr.profile = profile[1].split('?')[0];
	}
	if (banner)
		if (banner[1]) {
			returnArr.banner = banner[1].split('?')[0];
		}
	if (returnArr.banner !== '' || returnArr.profile !== '') {
		const localProfiles = JSON.parse(localStorage.communityProfiles);
		localProfiles[subName] = returnArr;
		localStorage.communityProfiles = JSON.stringify(localProfiles);
	}

	return returnArr;
}

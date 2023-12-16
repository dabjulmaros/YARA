export function recentCommunities(community = '') {
	const recentCommunities = [];
	if (localStorage.recentCommunities) {
		const storedArray = JSON.parse(localStorage.recentCommunities);
		recentCommunities.push(...storedArray);
	}

	if (community !== '') {
		if (recentCommunities.includes(community)) {
			const index = recentCommunities.indexOf(community);
			recentCommunities.splice(index, 1);
		}

		recentCommunities.unshift(community);

		recentCommunities.splice(10);

		localStorage.recentCommunities = JSON.stringify(recentCommunities);
	}

	return recentCommunities;
}

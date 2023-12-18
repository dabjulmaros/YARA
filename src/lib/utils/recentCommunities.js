export function recentCommunities(community = '', remove = false) {
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

		if (!remove) {
			recentCommunities.unshift(community);

			recentCommunities.splice(20);
		}

		localStorage.recentCommunities = JSON.stringify(recentCommunities);
	}

	return recentCommunities;
}

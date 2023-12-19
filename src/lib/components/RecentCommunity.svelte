<script>
	import AncherNoreferrer from './AncherNoreferrer.svelte';

	import { fetchRedditCommunityImage } from '$lib/utils/fetchRedditCommunityImage';
	import { recentCommunities } from '$lib/utils/recentCommunities';

	const recentCommunitiesArr = recentCommunities();

	async function getProfile(community) {
		const profile = await fetchRedditCommunityImage(community);
		if (profile.profile == '') {
			throw new Error(`No ${community} Community pfp`);
		}
		return profile.profile;
	}
	function removeRecent(e) {
		e.preventDefault();
		const recent = recentCommunities(e.target.dataset.remove, true);
		recentCommunitiesArr.length = 0;
		recentCommunitiesArr.push(...recent);
	}
</script>

{#if recentCommunitiesArr.length}
	<article>
		<header>
			<h5>Recently Visited Communities</h5>
		</header>
		<body>
			{#each recentCommunitiesArr as data, index}
				{#if index < 6}
					<div class="gridItems">
						<a
							href="#close"
							aria-label="Close"
							class="close"
							on:click={removeRecent}
							data-remove={data}
							title={`Remove ${data} from Recent`}
						/>
						<AncherNoreferrer
							link={'/' + data}
							content={data}
							style="display: flex;flex-direction: column;align-items: center;justify-content: center;"
						>
							{#await getProfile(data)}
								<span class="profileImg background pending" />
							{:then src}
								<img {src} alt="decorative" loading="lazy" />
							{:catch error}
								<span class="profileImg background noImage" data={error} />
							{/await}
							<span class="communityName">
								{data}
							</span>
						</AncherNoreferrer>
					</div>
				{/if}
			{/each}
		</body>
	</article>
{/if}

<style>
	header {
		padding-top: 0.7rem;
		padding-bottom: 0.7rem;
		margin-bottom: 1rem;
	}
	h5 {
		margin: 0;
	}
	body {
		display: grid;
		grid-gap: 0.5rem;
		justify-items: center;
		grid-template-columns: repeat(3, minmax(100px, 3fr));
	}
	.gridItems {
		width: 100%;
		position: relative;
	}
	img,
	.profileImg {
		margin-right: 0.5rem;
		border-radius: 2rem;
		width: 4rem;
		height: 4rem;
		display: inline-block;
	}
	.background {
		background-size: 70%;
		background-position: center;
		background-color: #11191f;
	}
	.communityName {
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.gridItems:hover .close {
		opacity: 0.5;
	}
	.close {
		position: absolute;
		top: 0;
		right: 0;
		width: 1rem;
		height: 1rem;
		background-image: var(--icon-close);
		background-position: center;
		background-size: auto 1rem;
		background-repeat: no-repeat;
		opacity: 0;
		transition: opacity var(--transition);
	}
	.gridItems:hover .close:hover {
		opacity: 1;
	}
</style>

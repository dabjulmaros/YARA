<script>
	import { shortNum } from '$lib/utils/shortNum';
	import AncherNoreferrer from './AncherNoreferrer.svelte';
	import { fetchRedditCommunityImage } from '$lib/utils/fetchRedditCommunityImage.js';

	export let items;

	async function getProfile(community) {
		const profile = await fetchRedditCommunityImage(`r/${community}`);
		if (profile.profile == '') {
			throw new Error(`No r/${community} Community pfp`);
		}
		return profile.profile;
	}
</script>

<div class="grid">
	{#each items as data}
		<!-- filters out users -->
		{#if data.title !== '' && data.members !== ''}
			<article>
				<div class="body">
					<h2>
						{#await getProfile(data.community)}
							<span class="profileImg background pending" />
						{:then src}
							<img {src} alt="decorative" loading="lazy" />
						{:catch error}
							<span class="profileImg background noImage" data={error} />
						{/await}
						<AncherNoreferrer
							style="flex:1;word-break: break-all;"
							link={`${data.link}`}
							content={`View ${data.title}`}
						/>
					</h2>
					<small>{data.community} · {shortNum(null, data.members)} subscribers</small>
					<p>{data.description}</p>
				</div>
			</article>
		{/if}
	{/each}
</div>

<style>
	div.grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 0.5rem;
		grid-row-gap: 0.5rem;
		margin: 1rem auto;
	}
	article {
		width: calc(100% - 1rem);
		margin: 0.5rem 0.5rem;
	}
	div.body {
		display: flex;
		flex-direction: column;
	}
	h2 {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
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

	@media (min-width: 801px) {
		div.grid {
			grid-template-columns: repeat(2, 1fr);
			max-width: 1500px;
		}
	}
</style>

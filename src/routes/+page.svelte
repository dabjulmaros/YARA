<script>
	import { browser } from '$app/environment';

	// let desktop: string;

	// if (window.electron && browser) {
	// 	window.electron.receive('from-main', (data: any) => {
	// 		desktop = `Received Message "${data}" from Electron`;
	// 		console.log(desktop);
	// 	});
	// }

	// const agent = window.electron ? 'Electron' : 'Browser';

	//custom changes
	import Search from '$lib/components/Search.svelte';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	import { localStore } from '$lib/utils/storable';
	import { recentCommunities } from '$lib/utils/recentCommunities';
	import { fetchRedditCommunityImage } from '$lib/utils/fetchRedditCommunityImage';

	const recentCommunitiesArr = recentCommunities();

	let componentSearch;

	function sendSearch() {
		componentSearch();
	}
	async function getProfile(community) {
		console.log(community);
		const profile = await fetchRedditCommunityImage(community);
		if (profile.profile == '') {
			throw new Error(`No ${community} Community pfp`);
		}
		return profile.profile;
	}
</script>

<!-- <main> -->
<!-- <Logo />

	<h1>Hello {agent}!</h1>

	<Counter id="0" {agent} />

	{#if desktop}
		<br />
		<br />
		{desktop}
	{/if} -->

<form on:submit|preventDefault={sendSearch} class="flex">
	{#if browser}
		<h3>Where to</h3>
		<Search bind:submitSearch={componentSearch} noMargin={false} inputField="" />
		<div class="flex">
			<input
				type="checkbox"
				id="switch"
				name="switch"
				role="switch"
				bind:checked={$localStore.method}
			/>
			<label for="switch">
				{$localStore.method ? 'Scrape' : 'API'}
			</label>
			<button>Go</button>
		</div>
	{/if}
	<article>
		<header>
			<h5>Recently Visited Communities</h5>
		</header>
		<body>
			{#each recentCommunitiesArr as data, index}
				{#if index < 6}
					<div class="gridItems">
						<AncherNoreferrer
							link={'/' + data}
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
</form>

<!-- </main> -->

<style>
	.flex {
		display: flex;
	}
	form {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;

		height: 100vh;
		overflow: hidden;
		flex-direction: column;
		justify-content: center;
	}
	h3 {
		margin-bottom: 1rem;
	}
	div {
		align-items: center;
	}
	label {
		min-width: 7ch;
		text-align: center;
		margin: 0 2rem 0 0;
	}
	button {
		flex: 1;
		margin: 0;
		padding: 0.4rem;
	}
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
		max-width: calc(100%);
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
</style>

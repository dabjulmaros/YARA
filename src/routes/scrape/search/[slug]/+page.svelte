<script>
	import { afterUpdate, onMount } from 'svelte';

	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import SearchPosts from '$lib/components/SearchPosts.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	//request
	import { fetchRedditData } from '$lib/utils/fetchRedditData.js';

	export let data;

	let loadButton;
	let postsSuccess = true;
	let status = 200;
	let posts = [];
	let hasMore = true;

	let nextSet = '';
	let scrollElement;

	const search = data.slug;

	onMount(() => {
		// load first batch onMount
		load();
	});

	async function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		const data = await fetchRedditData(
			`search?type=sr&q=${search}`, //type sr forces search to communities only
			`${localStorage.over18 == 'true' ? '&include_over_18=on' : ''}${
				nextSet == '' ? '' : '&after=' + nextSet
			}`,
		);
		if (data.error || data.length == 0) {
			console.log(data);
			if (posts.length > 0) hasMore = false;
			else postsSuccess = false;
			return;
		}
		if (data.status == 403 || data.status == 404) {
			console.log(data);
			hasMore = false;
			if (posts.length > 0) {
				return;
			} else postsSuccess = false;
			status = 403;
			posts.push(...data.message);
			return;
		}

		if (data.type) {
			if (data.type == 'search') {
				posts.push(...data.items);
				nextSet = data.items[data.items.length - 1].thingID;
			}
		}

		postsSuccess = true;

		posts = posts;
		loadButton.setAttribute('aria-busy', false);
		loadButton.disabled = false;
	}
</script>

<div bind:this={scrollElement} class="scroll">
	<Navbar subNameField={`search/${search}`} />
	{#if postsSuccess}
		<SearchPosts items={posts} />
		<InfiniteScroll hasMore threshold={750} elementScroll={scrollElement} on:loadMore={load} />
		{#if hasMore}
			<button style="margin: 2rem auto;" bind:this={loadButton} on:click={load}>
				Load More
			</button>
		{/if}
	{:else if status !== 200}
		<ErrorMessage message={posts} />
	{:else}
		<div class="container">There was an error loading the post data</div>
	{/if}
</div>

<style>
	div.scroll {
		overflow-y: overlay;
		overflow-x: hidden;
		height: calc(100vh - 33px);
		margin-top: 33px;
	}
	button {
		margin: 0 auto;
		width: fit-content;
	}
</style>

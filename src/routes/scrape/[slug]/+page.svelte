<!--/*
  TODO
  Make videos lighter
  find a way to stop rendering collapsed posts
  Move the script module to a different file
*/-->

<script>
	import { afterUpdate, onMount } from 'svelte';

	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Header from '$lib/components/Header.svelte';
	import PostDetails from '$lib/components/PostDetails.svelte';
	import MediaElement from '$lib/components/MediaElement.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import FullScreenImg from '$lib/components/FullScreenImg.svelte';
	import FullScreenComments from '$lib/components/FullScreenComments.svelte';
	import InlineComments from '$lib/components/InlineComments.svelte';
	import SearchPosts from '$lib/components/SearchPosts.svelte';

	//tools
	import { getMe } from '$lib/utils/getMe.js';
	import { shortNum } from '$lib/utils/shortNum.js';
	import { recentCommunities } from '$lib/utils/recentCommunities.js';

	//request
	import { fetchRedditData } from '$lib/utils/fetchRedditData.js';
	import { fetchJsonData } from '$lib/utils/fetchJsonData.js';

	let posts = [];
	let nextSet = '';
	let viewComments = false;
	let viewInlineComments = false;
	let comments = [];
	let lastComments;
	let inlineCommentsID = '';

	let viewImage = false;
	let imageSrc;
	let postTitle;
	let postLink;

	let scrollElement;

	let postsSuccess = true;
	let status = 200;
	let hasMore = true;
	let type = '';

	export let data;

	const subName = data.slug;

	let loadButton;

	let scroll = false;
	let elementToScroll;
	let getCommunity = true;

	onMount(() => {
		// load first batch onMount
		load();
	});

	afterUpdate(() => {
		if (scroll) {
			elementToScroll.scrollIntoView({ block: 'center' });

			scroll = false;
		}
	});

	async function getFullScreenComments(event, id) {
		if (id == lastComments) {
			viewComments = true;
			return;
		}
		event.target.setAttribute('aria-busy', true);
		event.target.disabled = true;
		await getComments(id);
		viewComments = true;
		event.target.setAttribute('aria-busy', false);
		event.target.disabled = false;
	}

	async function getInlineComments(event, id) {
		if (id == lastComments) {
			viewInlineComments = true;
			inlineCommentsID = id;
			return;
		}
		event.target.setAttribute('aria-busy', true);
		event.target.disabled = true;
		await getComments(id);

		viewInlineComments = true;
		inlineCommentsID = id;

		event.target.setAttribute('aria-busy', false);
		event.target.disabled = false;
	}

	async function getComments(id) {
		const data = await fetchJsonData(`${id}.json`);
		status = data.status;
		if (data.response === undefined || data.status !== 200) comments = [];
		else {
			comments = data.response;
			lastComments = id;
		}
	}
	function viewInlineCommentsEvent(e) {
		viewInlineComments = e.detail.value;

		scroll = true;
		elementToScroll = getMe(e.detail.target, 'body', true);
	}

	async function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		const data = await fetchRedditData(
			`r/${subName}`,
			`?${nextSet == '' ? '' : 'after=' + nextSet}`,
		);
		if (data.error || data.length == 0) {
			console.error(data);
			if (posts.length > 0) hasMore = false;
			else postsSuccess = false;
			return;
		}
		if (data.status == 403 || data.status == 404) {
			console.error(data);
			if (posts.length > 0) {
				hasMore = false;
				return;
			} else postsSuccess = false;
			status = 403;
			posts.push(...data.message);
			return;
		}

		if (data.type) {
			if (data.type == 'search') {
				type = 'search';
				posts.push(...data.items);
				nextSet = data.items[data.items.length - 1].thingID;
			}
		} else {
			// get community name with proper spelling
			if (getCommunity) {
				recentCommunities(data[0].subreddit);
				getCommunity = false;
			}
			posts.push(...data);
			nextSet = data[data.length - 1].thingID;
		}

		postsSuccess = true;

		posts = posts;
		loadButton.setAttribute('aria-busy', false);
		loadButton.disabled = false;
	}

	function fullHeightImage(event) {
		let element = event.detail.target;
		// element.classList.toggle("fullHeight");
		// element.scrollIntoView({ block: "center" });
		const title = getMe(element, 'article').querySelector('header h2 a');
		imageSrc = element.src;
		postTitle = title.text;
		postLink = title.href;
		viewImage = true;
	}

	function collapsePost(e) {
		const article = getMe(e.target, 'article');
		article.classList.toggle('collapse');
		const body = article.querySelector('.body');

		if (article.classList.contains('collapse')) {
			body.style.display = 'none';
			article.scrollIntoView({ block: 'center' });
		} else body.style.display = '';
	}
</script>

<div bind:this={scrollElement} class="scroll">
	{#if viewComments === true}
		<FullScreenComments
			on:fullImg={fullHeightImage}
			{comments}
			on:viewComments={(e) => (viewComments = e.detail.value)}
		/>
	{/if}
	{#if viewImage == true}
		<FullScreenImg
			data={{ postLink, postTitle, imageSrc }}
			on:viewImage={(e) => (viewImage = e.detail.value)}
		/>
	{/if}
	<Navbar subNameField={subName} />
	{#if postsSuccess && type !== 'search'}
		<div>
			{#each posts as data}
				<!-- <div class="posts"> -->
				<article class={'thing ' + data.thingID} id="article">
					<Header
						postData={data}
						on:collapsePost={(event) => collapsePost(event.detail)}
					/>
					<div
						class={`body ${
							viewInlineComments === true && data.href == inlineCommentsID
								? 'comments'
								: ''
						}`}
					>
						<MediaElement {data} on:fullImg={fullHeightImage} />
						<MediaQuery query="(min-width: 801px)" let:matches>
							{#if matches}
								<div class="details">
									<PostDetails postData={data} />
									<div class="comments">
										{#if viewInlineComments === true && data.href == inlineCommentsID}
											<InlineComments
												{comments}
												on:fullImg={fullHeightImage}
												on:viewInlineComments={viewInlineCommentsEvent}
											/>
										{:else}
											<button
												on:click={(event) =>
													getInlineComments(event, data.href)}
											>
												view {shortNum(null, data.comments.split(' ')[0])} comments
											</button>
										{/if}
									</div>
								</div>
							{/if}
						</MediaQuery>
					</div>
					<MediaQuery query="(max-width: 800px)" let:matches>
						{#if matches}
							<footer class="footer">
								<button
									on:click={(event) => getFullScreenComments(event, data.href)}
								>
									view {data.comments}
								</button>
							</footer>
						{/if}
					</MediaQuery>
					<!-- </div> -->
				</article>
			{/each}
			<InfiniteScroll
				hasMore
				threshold={750}
				elementScroll={scrollElement}
				on:loadMore={load}
			/>
			{#if hasMore}
				<button style="margin: 2rem auto;" bind:this={loadButton} on:click={load}>
					Load More
				</button>
			{/if}
		</div>
	{:else if postsSuccess && type === 'search'}
		<SearchPosts items={posts} />
	{:else if status !== 200}
		<ErrorMessage message={posts} />
	{:else}
		<div class="container">There was an error loading the post data</div>
	{/if}
</div>

<style>
	article {
		max-width: 1500px;
		margin: 1rem auto;
	}

	.details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: calc(40% - var(--block-spacing-horizontal));
		padding: 2rem 0;
		padding-left: var(--block-spacing-horizontal);
		border-left: solid 1px var(--accordion-border-color);
		background: var(--card-sectionning-background-color);
		margin: -1rem calc(-1 * var(--block-spacing-horizontal)) -2rem;
	}
	.footer {
		margin-top: 0;
	}

	:global(.collapse .togglePost) {
		transform: rotate(90deg) !important;
	}
	:global(article.collapse) {
		padding-bottom: 0;
	}

	:global(.collapse .body, .collapse footer) {
		display: none;
	}

	.togglePost {
		--icon-size: 1.5rem;
		position: absolute;
		top: calc(50% - 0.8rem);
		right: 1rem;
		transform: rotate(0deg);
		cursor: pointer;
		transition: transform ease-in-out 0.3s;
		padding: 0;
		border: none;
		height: var(--icon-size);
		width: var(--icon-size);
		background-image: var(--togglePost);
		background-size: var(--icon-size);
	}

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
	.toggleCode {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
		opacity: 0;
		cursor: pointer;
		padding: 0;
		border: none;
	}
	.toggleCode:hover {
		opacity: 1;
	}

	@media (min-width: 801px) {
		div.body {
			display: flex;
			flex-direction: row;
			min-height: 30vh;
			margin-top: 1rem;
		}
	}
</style>

<!--/*
  TODO
  Make videos lighter
  find a way to stop rendering collapsed posts
  Move the script module to a different file
*/-->

<script>
	import { onMount } from 'svelte';

	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Header from '$lib/components/Header.svelte';
	import PostDetails from '$lib/components/PostDetails.svelte';
	import MediaElement from '$lib/components/MediaElement.svelte';

	//tools
	import { getMe } from '$lib/utils/getMe.js';

	//request
	import { fetchRedditData } from '$lib/utils/fetchRedditData.js';

	let status = 200;
	let posts = [];
	let nextSet = '';
	let viewComments = false;
	let comments = [];
	let lastComments;

	let viewImage = false;
	let imageSrc;
	let postTitle;
	let postLink;

	let scrollElement;

	let postsSuccess = true;
	let hasMore = true;

	export let data;

	const subName = data.slug;

	let loadButton;

	onMount(() => {
		// load first batch onMount
		load();
	});

	function getComments(event, id) {
		if (id == lastComments) {
			viewComments = true;
			return;
		}
		event.target.setAttribute('aria-busy', true);
		event.target.disabled = true;
		fetch(`${id}.json`)
			.then((res) => {
				if (res.ok) return res.json();
			})
			.then((json) => {
				viewComments = true;
				comments = json;
				lastComments = id;
				event.target.setAttribute('aria-busy', false);
				event.target.disabled = false;
			});
	}

	async function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		const data = await fetchRedditData(
			`${subName == '""' ? '' : 'user/' + subName}`,
			`${nextSet == '' ? '' : 'after=' + nextSet}`,
		);
		if (data.error || data.length == 0) {
			console.log(data);
			if (posts.length > 0) hasMore = false;
			else postsSuccess = false;
			return;
		}
		if (data.status == 403 || data.status == 404) {
			console.log(data);
			if (posts.length > 0) {
				hasMore = false;
				return;
			} else postsSuccess = false;
			status = 403;
			posts.push(...data.message);
			return;
		}
		postsSuccess = true;
		posts.push(...data);
		nextSet = data[data.length - 1].thingID;
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
		if (article.classList.contains('collapse')) body.style.display = 'none';
		else body.style.display = '';
	}

	function mouseEnter(e) {
		e.target.classList.toggle('linkEllipsis');
	}
	function mouseOut(e) {
		e.target.classList.toggle('linkEllipsis');
	}
</script>

<div bind:this={scrollElement} class="scroll">
	{#if viewComments === true}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<dialog
			open
			on:click={(event) => {
				if (event.target.tagName == 'DIALOG') viewComments = false;
			}}
		>
			<article class="comments">
				<header style="margin-bottom:0.5rem">
					<span
						aria-label="Close"
						class="close"
						on:click={() => (viewComments = false)}
					/>
					<!-- still using the reddit api -->
					<div
						class="linkEllipsis"
						on:mouseenter={(e) => mouseEnter(e)}
						on:mouseleave={(e) => mouseOut(e)}
					>
						<AncherNoreferrer
							style=""
							link={'https://old.reddit.com' +
								comments[0].data.children[0].data.permalink}
							content={comments[0].data.children[0].data.title}
						/>
					</div>
				</header>
				<p>
					<Comments commentsArr={comments[1].data.children} />
				</p>
			</article>
		</dialog>
	{/if}
	{#if viewImage == true}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<dialog
			open
			on:click={(event) => {
				if (event.target.tagName == 'DIALOG') viewImage = false;
			}}
		>
			<article style="display: flex;flex-direction:column;align-items:center;padding:1rem">
				<header style="width: 100%;margin:-0.5rem 0 .5rem 0;padding: 1rem;">
					<span aria-label="Close" class="close" on:click={() => (viewImage = false)} />
					<div class="linkEllipsis">
						<AncherNoreferrer style="" link={postLink} content={postTitle} />
					</div>
				</header>
				<img src={imageSrc} class="fullHeight" alt="decoration" />
				<AncherNoreferrer
					link={imageSrc}
					content="Open In a New Tab"
					style="margin-top: .5rem"
				/>
				<!-- <a
          rel="noopener noreferrer"
          href={imageSrc}
          target="_blank"
          style="margin: 0.5rem;">Open In New Tab</a
        > -->
			</article>
		</dialog>
	{/if}
	<Navbar subNameField={'u/' + subName} />
	{#if postsSuccess}
		<div>
			{#each posts as data}
				<!-- <div class="posts"> -->
				<article class={'thing ' + data.thingID} id="article">
					<Header
						postData={data}
						on:collapsePost={(event) => collapsePost(event.detail)}
					/>
					<PostDetails postData={data} />
					<MediaElement {data} on:fullImg={fullHeightImage} />
					<footer class="footer">
						{#if data.expandoType == 'comment'}
							<AncherNoreferrer
								link={data.expando.comment.commentContext}
								content="context"
								role="button"
							/>
						{:else}
							<button on:click={(event) => getComments(event, data.href)}>
								view {data.comments}
							</button>
						{/if}
					</footer>
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
	{:else if status !== 200}
		<ErrorMessage message={posts} />
	{:else}
		<div class="container">There was an error loading the post data</div>
	{/if}
</div>

<style>
	article {
		max-width: 900px;
		margin: 1rem auto;
	}
	header {
		text-align: center;
		position: relative;
		margin-bottom: 0;
		z-index: 2;
	}

	.footer {
		text-align: center;
		margin-top: 0;
	}

	:global(.collapse .togglePost) {
		transform: rotate(180deg) !important;
	}
	:global(.collapse .body) {
		display: none;
	}
	.linkEllipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.togglePost {
		position: absolute;
		top: calc(50% - 0.8rem);
		right: 1rem;
		transform: rotate(90deg);
		cursor: pointer;
		transition: transform ease-in-out 0.3s;
		padding: 0;
		border: none;
		height: 1.5rem;
		width: 1.5rem;
	}

	:global(img.fullHeight) {
		height: max-content !important;
		max-height: 80vh !important;
	}

	div.scroll {
		overflow-y: auto;
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
	.comments {
		width: 90%;
		height: 100%;
	}
	.comments header {
		position: sticky;
		top: -3rem;
		z-index: 1;
	}
	:global(table) {
		font-size: 0.8rem;
	}
	:global(th, td) {
		padding: 0;
	}
	dialog {
		min-height: calc(100% - 33px);
		top: 33px;
	}
</style>

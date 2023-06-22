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
	import RVideo from '$lib/components/RVideo.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ImgGallery from '$lib/components/ImgGallery.svelte';
	import UserComment from '$lib/components/UserComment.svelte';
	import Header from '$lib/components/Header.svelte';

	//tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import { getImgSrc } from '$lib/utils/getImgSrc.js';
	import { getMe } from '$lib/utils/getMe.js';

	//request
	import { fetchRedditData } from '$lib/utils/fetchRedditData.js';

	let status;
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

	function fetchSelfText(id) {
		fetch(`https://old.reddit.com/api/expando?link_id=${id}&renderstyle=html`)
			.then((res) => {
				if (res.ok) return res.text();
			})
			.then((text) => {
				document.querySelector(`#self_${id}`).innerHTML = htmlDecode(text);
			});
	}

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
				// comments = [];
				// comments.push(...json[1].data.children);
				// console.log(comments);
				// console.log("Cleaner Comments");
				// commentRecursor(comments, 0);
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
		console.log(data);
		if (data.error || data.length == 0) {
			console.log(data);
			if (posts.length > 0) hasMore = false;
			else postsSuccess = false;
			return;
		}
		if (data.status == 403 || data.status == 404) {
			console.log(data);
			postsSuccess = false;
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
		let element;
		if (event.type == 'dblclick') element = event.target;
		else if (event.type == 'fullImgGall') element = event.detail.target;

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

	function toggleMute(e) {
		e.target.muted = !e.target.muted;
		e.preventDefault();
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
					<div class={'body'}>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						{#if data.expandoType == 'media'}
							{#if data.thingDomain == 'v.redd.it'}
								<RVideo expando={data.expando} />
							{:else if data.expando.includes('iframe')}
								<iframe
									src={'https://' +
										data.expando.match(/src="([^"]+)/)[1] +
										'?responsive=true&is_nightmode=true'}
									frameborder="0"
									style="border-radius:15px;overflow:hidden;margin:0 auto;height:47vh"
									scrolling="no"
									width="550px"
									height="511px"
									allowfullscreen=""
									title={data.title}
								/>
							{:else if data.expando.includes('gallery')}
								<ImgGallery
									expando={data.expando}
									on:fullImgGall={(event) => fullHeightImage(event)}
								/>
							{:else}
								<img
									src={getImgSrc(data.expando)[0]}
									alt=""
									loading="lazy"
									on:dblclick={(event) => fullHeightImage(event)}
								/>
							{/if}
						{:else if data.expandoType == 'text' || data.expandoType == 'crossPost'}
							<div id={'self_' + data.thingID}>
								{fetchSelfText(data.thingID)}
							</div>
						{:else if data.expandoType == 'none'}
							{#if data.expando.includes('imgur') && data.expando.includes('gifv')}
								<video
									src={data.expando.replace('gifv', 'mp4')}
									muted
									autoplay
									loop
									controls
									on:click={toggleMute}
								/>
							{:else}
								<AncherNoreferrer
									style=""
									link={data.expando}
									content={data.expando}
								/>
							{/if}
						{:else if data.expandoType == 'comment'}
							<UserComment comment={data.expando} />
						{:else}
							<!-- <div
                id="code"
                class="hidden"
                on:click={(event) => {
                  getMe(event.target, "code").classList.toggle("hidden");
                  if(getMe(event.target, "code").classList.contains('hidden')==false);
                    console.log(data)
                }}
              >
                <span>Toggle Code</span><span class="code">◀</span>
                <code on:click={(event) => event.stopPropagation()}
                  >{JSON.stringify(data)}</code
                >
              </div> -->

							{@html data.expando}
						{/if}
					</div>
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
	{:else if status == 403}
		<ErrorMessage message={posts} />
	{:else}
		<div class="container">There was an error loading the post data</div>
	{/if}
</div>

<style>
	/* .home {
    width: min-content;
    padding: 0;
    margin: 0 auto;
    position: absolute;
    top: 0.5rem;
    z-index: 2;
    right: 77%;
  } */
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
	div.body {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		margin-bottom: 1rem;
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

	/* .posts {
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(255, 255, 255, 0.5);
    padding: 2rem;
    max-width: 900px;
    text-align: center;
    margin: 1rem auto;
  } */
	video,
	img,
	iframe {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
	:global(img.fullHeight) {
		height: max-content !important;
		max-height: 80vh !important;
	}
	#code {
		cursor: pointer;
		text-decoration: underline;
		margin: 0 auto;
		width: 100%;
	}
	/* #code.hidden {
    width: 13ch;
  }
  .hidden code {
    width: 0%;
    height: 0;
    padding: 0;
  }
  span.code {
    transition: all 0.5s;
    transform: rotate(-90deg);
  }
  .hidden span.code {
    transform: rotate(0deg);
  }
  code {
    display: block;
    width: 100%;
    height: 100%;
    transition: all .5s;
    overflow: hidden;
  } */

	div#post {
		overflow: hidden;
		width: 100%;
		height: 100%;
		border: dashed 1px var(--muted-border-color);
		padding: 20px;
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

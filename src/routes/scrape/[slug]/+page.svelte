<!--/*
  TODO
  Make videos lighter
  find a way to stop rendering collapsed posts
  Move the script module to a different file
*/-->
<script context="module">
	function getMe(element, targetId) {
		let ele = element;
		while (ele.parentElement != null) {
			if (ele.id == targetId) {
				return ele;
			}
			ele = ele.parentElement;
		}
	}

	function getImgSrc(expando) {
		const imgSrcArr = [];
		const expandoMatchAll = expando.matchAll(/src="([^"]+)"/g);

		for (const match of expandoMatchAll) {
			const parsed = htmlDecode(match[1])
				.replace('preview.redd.it', 'i.redd.it')
				.split('?')[0];
			if (!imgSrcArr.includes(parsed) && parsed.includes('i.redd.it')) imgSrcArr.push(parsed);
		}

		return imgSrcArr;
	}
</script>

<script>
	import { onMount } from 'svelte';

	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RVideo from '$lib/components/RVideo.svelte';
	import PrivateSub from '$lib/components/PrivateSub.svelte';
	import ImgGallery from '$lib/components/ImgGallery.svelte';

	//tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';

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
		fetch(`https://api.reddit.com/${id.split('_')[1]}.json`)
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
			`${subName == '""' ? '' : 'r/' + subName}?${nextSet == '' ? '' : 'after=' + nextSet}`,
		);
		console.log(data);
		if (data.error || data.length == 0) {
			postsSuccess = false;
			return;
		}
		if (data.status == 403) {
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
		const element = event.target;
		// element.classList.toggle("fullHeight");
		// element.scrollIntoView({ block: "center" });
		const title = event.target.parentElement.previousElementSibling.querySelector('h2 a');
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
	<Navbar subNameField={subName} />
	{#if postsSuccess}
		<div>
			{#each posts as data}
				<!-- <div class="posts"> -->
				<article class={'thing ' + data.thingID} id="article">
					<header style="position:sticky;top:4.5rem">
						<h2
							class="linkEllipsis"
							on:mouseenter={(e) => mouseEnter(e)}
							on:mouseleave={(e) => mouseOut(e)}
						>
							<AncherNoreferrer link={data.href} content={data.title} style="" />
							<!-- <a
                rel="noopener noreferrer"
                href="https://www.reddit.com{data.permalink}"
                target="_blank">{@html data.title}</a
              > -->
						</h2>
						<small class="postInfo">
							<AncherNoreferrer
								style=""
								link={'https://old.reddit.com/' + data.subreddit}
								content={data.subreddit}
							/>
							by:
							<AncherNoreferrer
								style=""
								link={'https://old.reddit.com/u/' + data.author}
								content={data.author}
							/>
							ᐧ {data.time}
						</small>
						<button class="togglePost outline" on:click={(e) => collapsePost(e)}>
							▶
						</button>
						<button class="toggleCode outline" on:click={() => console.log(data)}>
							⚙️
						</button>
					</header>
					<div class={'body'}>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						{#if data.expandoType == 'media'}
							{#if data.thingDomain == 'i.redd.it'}
								<img
									src={getImgSrc(data.expando)[0]}
									alt=""
									loading="lazy"
									on:dblclick={(event) => fullHeightImage(event)}
								/>
							{:else if data.thingDomain == 'v.redd.it'}
								<RVideo expando={data.expando} />
							{:else if data.expando.includes('iframe')}
								<iframe
									src={data.expando.match(/src="([^"]+)/)[1] +
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
									srcArr={getImgSrc(data.expando)}
									on:dblclick={(event) => fullHeightImage(event)}
								/>
							{:else}
								no clue of what goes here
							{/if}
						{:else if data.expandoType == 'text'}
							<div id={'self_' + data.thingID}>
								{fetchSelfText(data.thingID)}
							</div>
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
								{@html data.expando}
							{/if}
						{/if}
					</div>
					<footer class="footer">
						<button
							on:click={(event) =>
								getComments(event, data.subreddit + '/comments/' + data.thingID)}
						>
							view {data.comments}
						</button>
					</footer>
					<!-- </div> -->
				</article>
			{/each}
			<InfiniteScroll
				hasMore={true}
				threshold={750}
				elementScroll={scrollElement}
				on:loadMore={load}
			/>
			<button style="margin: 2rem auto;" bind:this={loadButton} on:click={load}>
				Load More
			</button>
		</div>
	{:else if status == 403}
		<PrivateSub message={posts} />
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
	}
	header > h2 {
		width: 90%;
		margin: 0 auto;
		margin-bottom: 0.5rem;
	}
	header > small.postInfo {
		display: block;
		text-align: left;
	}
	div.body {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.footer {
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
		height: 100vh;
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
</style>

<!--/*
  TODO
  Make videos lighter
  find a way to stop rendering collapsed posts
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
</script>

<script>
	import { onMount } from 'svelte';

	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	//tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';

	let posts = [];
	let nextSet = '';
	let body;
	let viewComments = false;
	let comments = [];
	let lastComments;

	let viewImage = false;
	let imageSrc;

	let scrollElement;

	let postsSuccess = true;

	export let data;

	const subName = data.slug;

	let loadButton;

	onMount(() => {
		// load first batch onMount
		body = document.body;
		load();
	});

	function getComments(event, id) {
		if (id == lastComments) {
			viewComments = true;
			return;
		}
		event.target.setAttribute('aria-busy', true);
		event.target.disabled = true;
		fetch(`https://api.reddit.com/${id}.json`)
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

	function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		fetch(`https://api.reddit.com/r/${subName}.json?${nextSet == '' ? '' : 'after=' + nextSet}`)
			.then((res) => {
				if (res.ok) {
					postsSuccess = true;
					return res.json();
				}
			})
			.then((json) => {
				posts.push(...json.data.children);
				nextSet = json.data.after;
				posts = posts;
				loadButton.setAttribute('aria-busy', false);
				loadButton.disabled = false;
			})
			.catch((error) => {
				postsSuccess = false;
				console.error('Error:', error);
			});
	}

	function fullHeightImage(event) {
		const element = event.target;
		// element.classList.toggle("fullHeight");
		// element.scrollIntoView({ block: "center" });
		imageSrc = element.src;
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

				<Comments
					commentsArr={comments[1].data.children}
					opName={comments[0].data.children[0].data.author}
				/>
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
				<img src={imageSrc} class="fullHeight" alt="decoration" />
				<AncherNoreferrer
					link={imageSrc}
					content="Open In a New Tab"
					style="margin-top: 1rem"
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
			{#each posts as { data }}
				<!-- <div class="posts"> -->
				<article id="article">
					<header style="position:sticky;top:4.5rem">
						<h2
							class="linkEllipsis"
							on:mouseenter={(e) => mouseEnter(e)}
							on:mouseleave={(e) => mouseOut(e)}
						>
							<AncherNoreferrer
								style=""
								link={'https://old.reddit.com' + data.permalink}
								content={data.title}
							/>
							<!-- <a
                rel="noopener noreferrer"
                href="https://www.reddit.com{data.permalink}"
                target="_blank">{@html data.title}</a
              > -->
						</h2>
						<small class="postInfo">
							r/<AncherNoreferrer
								style=""
								link={'https://old.reddit.com/r/' + data.subreddit}
								content={data.subreddit}
							/>
							by:
							<AncherNoreferrer
								style=""
								link={'https://old.reddit.com/u/' + data.author}
								content={data.author}
							/>
						</small>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="togglePost" on:click={(e) => collapsePost(e)}>▶</div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div on:click={() => console.log(data)} class="codeToggle">⚙️</div>
					</header>
					<div class={'body'}>
						{#if data.secure_media_embed && data.secure_media_embed.content}
							{#if data.secure_media_embed.media_domain_url.includes('www.redditmedia.com')}
								<iframe
									src={data.secure_media_embed.media_domain_url +
										'?responsive=true&is_nightmode=true'}
									frameborder="0"
									style="border-radius:15px;overflow:hidden;margin:0 auto;height:47vh"
									scrolling="no"
									width="550px"
									height="511px"
									allowfullscreen=""
									title={data.title}
								/>
							{:else}
								<iframe
									src={data.url
										.replace('watch', 'ifr')
										.replace('gfycat.com/', 'gfycat.com/ifr/')}
									frameborder="0"
									scrolling="no"
									width="100%"
									height="100%"
									allowfullscreen=""
									title={data.title}
								/>
							{/if}
							<div class="linkEllipsis" title={data.url}>
								<AncherNoreferrer link={data.url} />
							</div>
						{:else if data.secure_media}
							{#if data.secure_media.reddit_video}
								<video
									muted
									autoplay
									loop
									controls
									src={data.secure_media.reddit_video.fallback_url}
									on:click={toggleMute}
								/>
							{/if}
						{:else if data.post_hint === 'image'}
							<img
								src={data.url}
								alt=""
								loading="lazy"
								on:dblclick={(event) => fullHeightImage(event)}
							/>
							<!-- {:else if data.media_embed!=null || data.media_embed!={}}
        <div class="embed">{data.media_embed.content}</div> -->
						{:else if data.domain.includes('imgur') && data.url.includes('gifv')}
							<video
								src={data.url.replace('gifv', 'mp4')}
								muted
								autoplay
								loop
								on:click={toggleMute}
							/>
						{:else if data.is_gallery === true}
							{#each data.gallery_data.items as item}
								<img
									src={htmlDecode(data.media_metadata[item.media_id].s.u)}
									alt=""
									on:dblclick={(event) => fullHeightImage(event)}
								/>
							{/each}
						{:else if data.selftext_html != null}
							<div id="post">
								{@html htmlDecode(data.selftext_html)}
							</div>
						{:else}
							<div class="linkEllipsis" title={data.url}>
								<AncherNoreferrer link={data.url} />
							</div>

							{#if data.preview && data.preview.images[0].resolutions[0].url}
								<img
									src={htmlDecode(data.preview.images[0].source.url)}
									alt=""
									on:dblclick={(event) => fullHeightImage(event)}
								/>
							{/if}

							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								id="code"
								class="hidden"
								on:click={(event) => {
									getMe(event.target, 'code').classList.toggle('hidden');
								}}
							>
								<span>Toggle Code</span>
								<icon>◀</icon>
								<code on:click={(event) => event.stopPropagation()}>
									{JSON.stringify(data)}
								</code>
							</div>
						{/if}
					</div>
					<footer class="footer">
						<button
							on:click={(event) =>
								getComments(
									event,
									data.subreddit_name_prefixed + '/comments/' + data.id,
								)}
						>
							View Comments
						</button>
					</footer>
					<!-- </div> -->
				</article>
			{/each}
			<InfiniteScroll
				hasMore={true}
				threshold={500}
				elementScroll={scrollElement}
				on:loadMore={load}
			/>
			<button style="margin: 2rem auto;" bind:this={loadButton} on:click={load}>
				Load More
			</button>
		</div>
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
		max-width: 1500px;
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
		max-height: 85vh !important;
	}
	#code {
		cursor: pointer;
		text-decoration: underline;
		margin: 0 auto;
		width: 100%;
	}
	#code.hidden {
		width: 13ch;
	}
	.hidden code {
		width: 0%;
		height: 0;
		padding: 0;
	}
	icon {
		display: inline-block;
		transition: all 0.5s;
		transform: rotate(-90deg);
	}
	.hidden icon {
		transform: rotate(0deg);
	}
	code {
		display: block;
		width: 100%;
		height: 100%;
		/* transition: all .5s; */
		overflow: hidden;
	}

	div#post {
		overflow: hidden;
		width: 100%;
		height: 100%;
		border: dashed 1px var(--muted-border-color);
		padding: 20px;
	}
	div.scroll {
		overflow-y: scroll;
		overflow-x: hidden;
		height: 100vh;
	}
	button {
		margin: 0 auto;
		width: fit-content;
	}
	.codeToggle {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
		opacity: 0;
		cursor: pointer;
	}
	.codeToggle:hover {
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
</style>

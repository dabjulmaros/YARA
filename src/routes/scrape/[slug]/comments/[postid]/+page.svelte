<script>
	import { onMount } from 'svelte';

	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RVideo from '$lib/components/RVideo.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ImgGallery from '$lib/components/ImgGallery.svelte';

	//tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import { getImgSrc } from '$lib/utils/getImgSrc.js';
	import { getMe } from '$lib/utils/getMe.js';

	//request
	import { fetchRedditData } from '$lib/utils/fetchRedditData.js';

	let status;
	let error = [];
	let nextSet = '';
	let viewComments = false;

	let comments = [];
	let post;
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
	const postid = data.postid;
	const postSlug = `${subName}/comments/${postid}`;

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

	async function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		await fetch(`https://old.reddit.com/r/${postSlug}.json`)
			.then((res) => {
				status = res.status;
				return res.json();
			})
			.then((json) => {
				comments = json;
			});
		if (comments.length == 0) {
			console.log(comments);
			postsSuccess = false;
			return;
		}
		if (status == 403 || status == 404) {
			status = 403;
			console.log(comments);
			error.push(comments.error, comments.message);
			postsSuccess = false;
			return;
		}
		postsSuccess = true;
		post = comments[0].data.children[0].data;
		console.log(post);
		// loadButton.remove();
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

<div class="scroll">
	<Navbar subNameField={postSlug} />
	{#if comments.length > 0 && post != undefined}
		<article id="article">
			<header style="position:sticky;top:4.5rem">
				<h2
					class="linkEllipsis"
					on:mouseenter={(e) => mouseEnter(e)}
					on:mouseleave={(e) => mouseOut(e)}
				>
					<AncherNoreferrer
						style=""
						link={'https://old.reddit.com' + post.permalink}
						content={post.title}
					/>
					<!-- <a
            rel="noopener noreferrer"
            href="https://www.reddit.com{post.permalink}"
            target="_blank">{@html post.title}</a
          > -->
				</h2>
				<small class="postInfo">
					r/<AncherNoreferrer
						style=""
						link={'https://old.reddit.com/r/' + post.subreddit}
						content={post.subreddit}
					/>
					by:
					<AncherNoreferrer
						style=""
						link={'https://old.reddit.com/u/' + post.author}
						content={post.author}
					/>
				</small>
				<div class="togglePost" on:click={(e) => collapsePost(e)}>▶</div>
				<div on:click={() => console.log(post)} class="toggleCode">⚙️</div>
			</header>
			<div class={'body'}>
				{#if post.preview && post.preview.images[0].source.url}
					<img
						class="preview"
						src={htmlDecode(post.preview.images[0].source.url)}
						alt=""
						on:dblclick={(event) => fullHeightImage(event)}
					/>
				{/if}
				{#if post.secure_media_embed && post.secure_media_embed.content}
					{#if post.secure_media_embed.media_domain_url.includes('www.redditmedia.com')}
						<iframe
							src={post.secure_media_embed.media_domain_url +
								'?responsive=true&is_nightmode=true'}
							frameborder="0"
							style="border-radius:15px;overflow:hidden;margin:0 auto;height:47vh"
							scrolling="no"
							width="550px"
							height="511px"
							allowfullscreen=""
							title={post.title}
						/>
					{:else}
						<iframe
							src={post.url
								.replace('watch', 'ifr')
								.replace('gfycat.com/', 'gfycat.com/ifr/')}
							frameborder="0"
							scrolling="no"
							width="100%"
							height="100%"
							allowfullscreen=""
							title={post.title}
						/>
					{/if}
					<div class="linkEllipsis" title={post.url}>
						<AncherNoreferrer link={post.url} />
					</div>
				{:else if post.secure_media}
					{#if post.secure_media.reddit_video}
						<RVideo data={post.secure_media.reddit_video} />
					{/if}
				{:else if post.post_hint === 'image'}
					<img
						src={post.url}
						alt=""
						loading="lazy"
						on:dblclick={(event) => fullHeightImage(event)}
					/>
					<!-- {:else if post.media_embed!=null || post.media_embed!={}}
    <div class="embed">{post.media_embed.content}</div> -->
				{:else if post.domain.includes('imgur') && post.url.includes('gifv')}
					<video
						src={post.url.replace('gifv', 'mp4')}
						muted
						autoplay
						loop
						on:click={toggleMute}
					/>
				{:else if post.is_gallery === true}
					<ImgGallery
						metadata={{ items: post.gallery_data.items, media: post.media_metadata }}
						on:fullImgGall={(event) => fullHeightImage(event)}
					/>
				{:else if post.selftext_html != null}
					<div id="post">
						{@html htmlDecode(post.selftext_html)}
					</div>
				{:else}
					<div class="linkEllipsis" title={post.url}>
						<AncherNoreferrer link={post.url} />
					</div>
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
				<Comments commentsArr={comments[1].data.children} />
			</footer>
			<!-- </div> -->
		</article>
	{:else if status == 403}
		<ErrorMessage message={error} />
	{:else if postsSuccess == false}
		<div class="container">There was an error loading the post data</div>
	{/if}
	<button style="margin: 2rem auto;" bind:this={loadButton}>Loading</button>
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
		position: relative;
		z-index: 1;
	}
	img.preview {
		z-index: 0;
		position: absolute;
		top: 0;
		border-radius: 0 0 3rem 3rem;
		opacity: 0.3;
		z-index: -1;
		filter: sepia(1) hue-rotate(195deg) brightness(0.3);
		width: 100%;
		max-height: none;
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

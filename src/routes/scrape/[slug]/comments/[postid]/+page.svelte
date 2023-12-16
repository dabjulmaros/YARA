<script>
	import { onMount } from 'svelte';

	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RVideo from '$lib/components/RVideo.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ImgGallery from '$lib/components/ImgGallery.svelte';
	import Header from '$lib/components/Header.svelte';
	import SimpleIFrame from '$lib/components/SimpleIFrame.svelte';
	import SimpleImg from '$lib/components/SimpleImg.svelte';
	import SimpleVideo from '$lib/components/SimpleVideo.svelte';
	import FullScreenImg from '$lib/components/FullScreenImg.svelte';
	import SelfText from '$lib/components/SelfText.svelte';

	//tools
	import { getMe } from '$lib/utils/getMe.js';
	import { recentCommunities } from '$lib/utils/recentCommunities.js';

	let status = 200;
	let error = [];

	let comments = [];
	let post;

	let viewImage = false;
	let imageSrc;
	let postTitle;
	let postLink;

	let singlePost = true;
	let fullTitle = true;

	let postsSuccess = true;

	export let data;

	const subName = data.slug;
	const postid = data.postid;
	const postSlug = `${subName}/comments/${postid}`;

	let loadButton;

	onMount(() => {
		recentCommunities(`r/${subName}`);
		// load first batch onMount
		load();
	});

	async function load() {
		loadButton.setAttribute('aria-busy', true);
		loadButton.disabled = true;
		await fetch(`https://old.reddit.com/r/${postSlug}.json`)
			.then((res) => {
				status = res.status;
				return res.json();
			})
			.then((json) => {
				if (json === undefined) comments = [];
				else comments = json;
			});

		loadButton.remove();
		if (status == 403 || status == 404) {
			console.log(comments);
			error.push(comments.error, comments.message);
			error = error;
			postsSuccess = false;
			return;
		} else if (status > 500) {
			status = 500;
			error.push('Server Error', 'We are having trouble getting data.');
			error = error;
			postsSuccess = false;
			console.log(error);
			return;
		} else if (comments.length == 0) {
			console.log(comments);
			postsSuccess = false;
			return;
		}
		postsSuccess = true;
		post = comments[0].data.children[0].data;
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
</script>

<div class="scroll">
	{#if viewImage == true}
		<FullScreenImg
			data={{ postLink, postTitle, imageSrc }}
			on:viewImage={(e) => (viewImage = e.detail.value)}
		/>
	{/if}
	<Navbar subNameField={postSlug} />
	{#if comments.length > 0 && post != undefined}
		<article id="article">
			<Header
				postData={post}
				{fullTitle}
				{singlePost}
				sticky={false}
				useInView={true}
				allowToggleTitle={true}
				on:inView={(e) => (fullTitle = e.detail.value)}
			/>
			{#if !fullTitle}
				<Header postData={post} {fullTitle} {singlePost} sticky={true} />
			{/if}

			<div class="body">
				<div class="media">
					{#if post.secure_media_embed && post.secure_media_embed.content}
						{#if post.secure_media_embed.media_domain_url.includes('www.redditmedia.com')}
							<SimpleIFrame
								src={post.secure_media_embed.media_domain_url +
									'?responsive=true&is_nightmode=true'}
								title={post.title}
							/>
						{:else}
							<SimpleIFrame
								src={post.url
									.replace('watch', 'ifr')
									.replace('gfycat.com/', 'gfycat.com/ifr/')}
								title={post.title}
							/>
						{/if}
						<div title={post.url}>
							<AncherNoreferrer link={post.url} />
						</div>
					{:else if post.secure_media}
						{#if post.secure_media.reddit_video}
							<RVideo data={post.secure_media.reddit_video} expando={''} />
						{/if}
					{:else if post.post_hint === 'image' || post.domain == 'i.redd.it'}
						<SimpleImg src={post.url} on:fullImg={(event) => fullHeightImage(event)} />
					{:else if post.domain.includes('imgur') && post.url.includes('gifv')}
						<SimpleVideo src={post.url.replace('gifv', 'mp4')} />
					{:else if post.is_gallery === true}
						<ImgGallery
							metadata={{
								items: post.gallery_data.items,
								media: post.media_metadata,
							}}
							on:fullImg={(event) => fullHeightImage(event)}
						/>
					{:else if post.selftext_html != null}
						<div class="post">
							<SelfText
								on:fullImg={(event) => fullHeightImage(event)}
								postText={post.selftext_html}
							/>
						</div>
					{:else if post.post_hint == 'link'}
						<AncherNoreferrer link={post.url} />
					{:else}
						<div title={post.url}>
							<AncherNoreferrer link={post.url} />
						</div>
					{/if}
				</div>
			</div>
			<footer class="footer">
				<Comments
					on:fullImg={fullHeightImage}
					commentsArr={comments[1].data.children}
					opName={comments[0].data.children[0].data.author}
				/>
			</footer>
			<!-- </div> -->
		</article>
	{:else if status !== 200}
		<ErrorMessage message={error} />
	{:else if postsSuccess == false}
		<div class="container">There was an error loading the post data</div>
	{/if}
	<button style="margin: 2rem auto;" bind:this={loadButton}>Loading</button>
</div>

<style>
	article {
		max-width: 1500px;
		margin: 1rem auto;
	}
	/* .details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: calc(40% - var(--block-spacing-horizontal));
		padding: 1rem 0;
		padding-left: var(--block-spacing-horizontal);
		border-left: solid 1px var(--accordion-border-color);
	} */
	div.media {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		margin-bottom: 1rem;
		position: relative;
		z-index: 1;
	}

	.footer {
		margin-top: 0;
	}

	:global(.collapse .body, .collapse footer) {
		display: none;
	}

	div.post {
		overflow: hidden;
		width: 100%;
		height: 100%;
		border: dashed 1px var(--muted-border-color);
		padding: 20px;
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

	:global(table) {
		font-size: 0.8rem;
	}
	:global(th, td) {
		padding: 0;
	}
	:global(.md p:last-child) {
		margin-bottom: 0;
	}

	@media (min-width: 801px) {
		div.media {
			display: flex;
			flex-direction: column;
			margin: 1rem auto;
			position: relative;
			z-index: 1;
			width: 60%;
		}
		div.body {
			display: flex;
			flex-direction: row-reverse;
			margin: 1rem 0;
		}
	}
</style>

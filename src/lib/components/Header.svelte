<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import PostDetails from '$lib/components/PostDetails.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';

	import inView from '$lib/utils/inView';

	export let postData;
	export let singlePost = false;
	export let fullTitle = false;

	let collapsed = !fullTitle;
	let collapsableTitle;

	const dispatch = createEventDispatcher();
	function collapsePost(e) {
		dispatch('collapsePost', {
			target: e.target,
		});
	}

	function collapseTitle(e) {
		e.target.classList.toggle('collapsedHeader');
		collapsableTitle.classList.toggle('linkEllipsis');
	}

	function mouseEnter(e) {
		e.target.classList.toggle('linkEllipsis');
	}
	function mouseOut(e) {
		e.target.classList.toggle('linkEllipsis');
	}
</script>

<!-- use:inView
			on:enterView={() => {
				collapsed = false;
			}}
			on:exitView={() => {
				collapsed = true;
			}} -->

<header style={'position:sticky;top:4.5rem'}>
	{#if fullTitle}
		<h2 bind:this={collapsableTitle}>
			<AncherNoreferrer
				style=""
				link={postData.expandoType == 'comment'
					? postData.expando.post.postUrl
					: postData.href
					? postData.href
					: postData.permalink}
				content={postData.title}
			/>
		</h2>
	{:else}
		<h2
			class="linkEllipsis"
			on:mouseenter={(e) => mouseEnter(e)}
			on:mouseleave={(e) => mouseOut(e)}
		>
			<AncherNoreferrer
				style=""
				link={postData.expandoType == 'comment'
					? postData.expando.post.postUrl
					: postData.href
					? postData.href
					: postData.permalink}
				content={postData.title}
			/>
		</h2>
	{/if}
	<MediaQuery query="(max-width: 800px)" let:matches>
		{#if matches || singlePost}
			<PostDetails {postData} />
		{/if}
	</MediaQuery>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if !singlePost}
		<div class="togglePost" on:click={(e) => collapsePost(e)}>▶</div>
	{:else}
		<div class="togglePost" on:click={(e) => collapseTitle(e)}>▶</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={() => console.log(postData)} class="toggleCode">⚙️</div>
</header>

<style>
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
	:global(.collapse .togglePost, .togglePost.collapsedHeader) {
		transform: rotate(180deg) !important;
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
	.linkEllipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>

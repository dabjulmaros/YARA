<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from '$components/AncherNoreferrer.svelte';
	import PostDetails from '$components/PostDetails.svelte';
	import MediaQuery from '$components/MediaQuery.svelte';

	import inView from '$utils/inView';

	export let postData;
	export let singlePost = false;
	export let fullTitle = false;
	export let sticky = true;
	export let useInView = false;
	export let allowToggleTitle = false;

	let collapsableTitle;

	const dispatch = createEventDispatcher();
	function collapsePost(e) {
		e.stopPropagation();
		dispatch('collapsePost', {
			target: e.target,
		});
	}

	function dispatchInView(value) {
		dispatch('inView', {
			value: value,
		});
	}

	function collapseTitle(e) {
		e.target.classList.toggle('collapsedHeader');
		toggleTitle();
		e.stopPropagation();
	}

	function toggleTitle() {
		collapsableTitle.classList.toggle('linkEllipsis');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header
	style={sticky ? 'position:sticky;top:4.5rem' : ''}
	on:click={!singlePost ? toggleTitle : ''}
>
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
			on:mouseenter={toggleTitle}
			on:mouseleave={toggleTitle}
			bind:this={collapsableTitle}
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
	{#if useInView}
		<span
			use:inView
			on:enterView={() => {
				dispatchInView(true);
			}}
			on:exitView={() => {
				dispatchInView(false);
			}}
		/>
	{/if}
	<MediaQuery query="(max-width: 800px)" let:matches>
		{#if matches || singlePost}
			<PostDetails {postData} />
		{/if}
	</MediaQuery>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if !singlePost}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="togglePost" on:click={(e) => collapsePost(e)}>▶</div>
	{:else if allowToggleTitle}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="togglePost" on:click={(e) => collapseTitle(e)}>▶</div>
	{/if}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
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

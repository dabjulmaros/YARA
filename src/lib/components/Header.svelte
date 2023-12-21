<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import PostDetails from '$lib/components/PostDetails.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';

	import inView from '$lib/utils/inView';

	export let postData;
	export let singlePost = false;
	export let fullTitle = false;
	export let sticky = true;
	export let useInView = false;
	export let allowToggleTitle = false;

	const link =
		postData.expandoType == 'comment'
			? postData.expando.post.postUrl
			: postData.href
			? postData.href
			: postData.permalink;

	let collapsableTitle;
	let shareButton;

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

	function toggleTitle(action = '') {
		if (action !== 'click' && collapsableTitle.dataset.perm) return;
		if (action == 'click' && !collapsableTitle.dataset.perm) {
			collapsableTitle.dataset.perm = true;
			collapsableTitle.classList.remove('linkEllipsis');
		} else if (action == 'click') {
			collapsableTitle.removeAttribute('data-perm');
			collapsableTitle.classList.add('linkEllipsis');
		} else if (action == 'enter') collapsableTitle.classList.remove('linkEllipsis');
		else if (action == 'leave') collapsableTitle.classList.add('linkEllipsis');
	}

	function shareLink(e) {
		e.stopPropagation();
		let shareUrl = link;
		if (link.substr(0, 3) == '/r/' || link.substr(0, 3) == '/u/')
			shareUrl = 'https://old.reddit.com' + link;
		navigator.clipboard.writeText(shareUrl);
		shareButton.dataset.tooltip = 'copied';
		setTimeout(() => shareButton.removeAttribute('data-tooltip'), 1000);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header
	style={sticky ? 'position:sticky;top:4.4rem' : ''}
	on:click={!singlePost ? toggleTitle('click') : ''}
>
	{#if fullTitle}
		<h2 bind:this={collapsableTitle}>
			<AncherNoreferrer style="" {link} content={postData.title} />
		</h2>
	{:else}
		<h2
			class="linkEllipsis"
			on:mouseenter={() => toggleTitle('enter')}
			on:mouseleave={() => toggleTitle('leave')}
			bind:this={collapsableTitle}
		>
			<AncherNoreferrer style="" {link} content={postData.title} />
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
		<div class="togglePost" on:click={(e) => collapsePost(e)} />
	{:else if allowToggleTitle}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="togglePost" on:click={(e) => collapseTitle(e)} />
	{/if}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={() => console.log(postData)} class="toggleCode">⚙️</div>
	<div bind:this={shareButton} on:click={shareLink} class="share" data-placement="left" />
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
		transform: rotate(90deg) !important;
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
	.share {
		--icon-size: 1rem;
		position: absolute;
		right: 1.2rem;
		bottom: 0.7rem;
		cursor: pointer;
		padding: 0;
		border: none;
		opacity: 0.3;
		transition: all 0.3s linear;
		height: var(--icon-size);
		width: var(--icon-size);
		background-image: var(--share);
		background-size: var(--icon-size);
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
	.share:hover {
		opacity: 0.7;
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

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
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAWNJREFUWEft1LFKxEAQBuB/DBJBH8JCbOxMI8HmioCihfWVPoEPcOU9gE9w5dUWikKKayTYxM5GLHwIBYPElcULhLBHZjOLXDFX3mayX/6ZXcKa/2jNfVCgtEOaoCYoTUBarzOoCUoTkNbrDP5rgvljeUQRXURf8XQ0Ovjw2XyxeNmpt6qJqc1Ndpw8cWvZLbY4bNAcwK4BbjereMxFWtx3XM0JOAfwjh8z5iJZwIei3IsM3YGwv/xyw0V2cH/7GbzWZM5O0uStL0kW0L4kL8orgKYAtrlIJw74BMwkS5PrPpxdZwN9kSFw3kAuMhRuELAPaddbB6LpkFdb2633anG70DWTINwvD8Fpa3wG4wYn2EAdyO7ci3Bi4Ip2N0gxLghwBTIILhiwg7Q3Mfue67sLBx8S14vz4vnS/p+lh7O+jbnrQYHcTX2eU6BPWq5nNUFNUJqAtF5nUBOUJiCt1xmUJvgL9YukKcvKs/QAAAAASUVORK5CYII=);
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
		background-image: url(data:image/png;base64,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);
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

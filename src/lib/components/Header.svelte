<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	//utils
	import { getPoints } from '$lib/utils/getPoints';
	import { getTime } from '$lib/utils/getTime';

	export let postData;

	const dispatch = createEventDispatcher();
	function collapsePost(e) {
		dispatch('collapsePost', {
			target: e.target,
		});
	}

	function mouseEnter(e) {
		e.target.classList.toggle('linkEllipsis');
	}
	function mouseOut(e) {
		e.target.classList.toggle('linkEllipsis');
	}
</script>

<header style="position:sticky;top:4.5rem">
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
		<!-- <a
      rel="noopener noreferrer"
      href="https://www.reddit.com{post.permalink}"
      target="_blank">{@html post.title}</a
    > -->
	</h2>
	<small class="postInfo">
		r/<AncherNoreferrer
			style=""
			link={'https://old.reddit.com/r/' + postData.subreddit.replace('r/', '')}
			content={postData.subreddit.replace('r/', '')}
		/>
		by:
		{#if postData.expandoType !== 'comment'}
			<AncherNoreferrer
				style=""
				link={'https://old.reddit.com/u/' + postData.author}
				content={postData.author}
			/> - {getTime(postData.time, postData.created)} · {getPoints(
				postData.points,
				postData.score,
			)}
		{:else}
			<AncherNoreferrer
				style=""
				link={'https://old.reddit.com/u/' + postData.expando.post.opName}
				content={postData.expando.post.opName}
			/>
		{/if}
	</small>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="togglePost" on:click={(e) => collapsePost(e)}>▶</div>
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
	header > small.postInfo {
		display: block;
		text-align: left;
	}
	:global(.collapse .togglePost) {
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

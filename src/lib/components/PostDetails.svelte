<script>
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	export let postData;

	//utils
	import { getPoints } from '$lib/utils/getPoints';
	import { getTime } from '$lib/utils/getTime';
</script>

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

<style>
	small.postInfo {
		display: block;
		text-align: left;
	}
</style>

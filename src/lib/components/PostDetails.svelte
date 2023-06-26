<script>
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';

	export let postData;

	//utils
	import { shortNum } from '$lib/utils/shortNum';
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
		/>
		<MediaQuery query="(min-width: 801px)" let:matches>
			{#if matches}
				<br />
			{/if}
		</MediaQuery>

		{getTime(postData.time, postData.created)} · {shortNum(postData.points, postData.score)} points
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

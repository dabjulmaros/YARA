<script>
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	export let comment;
</script>

<div>
	{comment.comment.commentOp} · {comment.comment.commentAge} :
	<div>{comment.comment.commentText}</div>
</div>

<style>
</style>

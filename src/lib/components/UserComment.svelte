<script>
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	export let comment;
</script>

<div>
	<div>
		<AncherNoreferrer link={comment.post.postUrl} content={comment.post.postTitle} />
		By
		<AncherNoreferrer link={comment.post.opUrl} content={comment.post.opName} />
		On
		<AncherNoreferrer link={comment.post.subUrl} content={comment.post.subName} />
	</div>
	<div>
		{comment.comment.commentOp} commented {comment.comment.commentAge}
		<div>{comment.comment.commentText}</div>
		<AncherNoreferrer link={comment.comment.commentContext} content="Context" />
	</div>
</div>

<style>
</style>

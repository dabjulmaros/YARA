<script>
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	export let commentsArr;
</script>

<div class="parent">
	{#each commentsArr as comment}
		<details open>
			<summary>
				<small class="author">{comment.data.author}</small>
				<div class="comment">{htmlDecode(comment.data.body)}</div>
			</summary>
			<div class="child">
				{#if comment.data.replies}
					<svelte:self commentsArr={comment.data.replies.data.children} />
				{/if}
			</div>
		</details>
	{/each}
</div>

<style>
	.author {
		margin: 0.3rem 0;
		flex-basis: 100%;
	}
	.comment {
		width: 95%;
	}
	.child {
		padding-left: 1rem;
	}

	summary {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	details summary::after {
		margin: 0;
	}
</style>

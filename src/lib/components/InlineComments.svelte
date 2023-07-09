<script>
	import Comments from './Comments.svelte';

	export let commentsArr;
</script>

<div>
	<div class="header">
		<h2>Comments</h2>
	</div>
	<Comments {commentsArr} />
</div>

<style>
	.header {
		position: sticky;
		top: 10rem;
		background: var(--card-sectionning-background-color);
		padding: 0.3rem 1rem;
		margin: 0.5rem 0;
		z-index: 2;
	}
	h2 {
		margin: 0;
	}
	:global(div.body.comments div.media) {
		width: 30%;
	}
	:global(div.body.comments div.details) {
		width: calc(70% - var(--block-spacing-horizontal));
	}
	@media (max-width: 800px) {
		:global(div.body.comments div.media) {
			width: inherit;
		}
		:global(div.body.comments div.details) {
			width: inherit;
		}
	}
</style>

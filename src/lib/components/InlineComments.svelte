<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Comments from './Comments.svelte';

	export let commentsArr;

	onMount(() => {
		document.documentElement.style.setProperty(
			'--divmediaHeight',
			`${document.querySelector('div.body.comments div.media').clientHeight}px`,
		);
	});

	const dispatch = createEventDispatcher();

	function closeComments(ele) {
		dispatch('viewInlineComments', {
			value: false,
			target: ele.target,
		});
	}
</script>

<div>
	<div class="header">
		<h2>Comments</h2>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span aria-label="Close" class="close" on:click={closeComments} />
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
		margin-left: -0.5rem;
		display: flex;
		align-items: center;
		z-index: 1;
	}
	h2 {
		margin: 0;
		width: calc(100% - 2rem);
	}
	.close {
		width: 1rem;
		height: 1rem;
		background-image: var(--icon-close);
		background-position: center;
		background-size: auto 1rem;
		background-repeat: no-repeat;
		opacity: 0.5;
		transition: opacity var(--transition);
	}
	.close:hover,
	.close:active {
		opacity: 1;
	}
	:global(div.body.comments div.media) {
		width: 30%;
		justify-content: flex-start;
		position: sticky;
		top: calc(100vh - 12rem - var(--divmediaHeight));
		height: fit-content;
	}
	:global(div.body.comments div.details) {
		width: calc(70% - var(--block-spacing-horizontal));
		justify-content: flex-start;
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

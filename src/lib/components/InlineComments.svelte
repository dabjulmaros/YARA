<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Comments from './Comments.svelte';

	export let comments;

	onMount(() => {
		document.documentElement.style.setProperty(
			'--divMediaHeight',
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

	function fullHeightImage(event) {
		let element = event.detail.target;
		// element.classList.toggle("fullHeight");
		// element.scrollIntoView({ block: "center" });
		const title = getMe(element, 'article').querySelector('header h2 a');
		imageSrc = element.src;
		postTitle = title.text;
		postLink = title.href;
		viewImage = true;
	}
</script>

<div style="margin-right: 1rem;">
	<div class="header">
		<h2>Comments</h2>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span aria-label="Close" class="close" on:click={closeComments} />
	</div>
	<Comments
		on:fullImg={fullHeightImage}
		commentsArr={comments[1].data.children}
		opName={comments[0].data.children[0].data.author}
	/>
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
		justify-content: center;
		position: sticky;
		top: calc(33px + 9.4rem);
		height: calc(100vh - 33px - 10rem - 2rem);
	}
	:global(div.body.comments div.details) {
		width: calc(70% - var(--block-spacing-horizontal));
		justify-content: flex-start;
		margin-left: 0;
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

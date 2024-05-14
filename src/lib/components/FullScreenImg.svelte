<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from './AncherNoreferrer.svelte';

	export let data;
	console.log(data);

	function mouseEnter(e) {
		e.target.classList.toggle('linkEllipsis');
	}
	function mouseOut(e) {
		e.target.classList.toggle('linkEllipsis');
	}

	const dispatch = createEventDispatcher();

	function fullHeightImage() {
		dispatch('viewImage', {
			value: false,
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	open
	on:click={(event) => {
		if (event.target.tagName == 'DIALOG') fullHeightImage();
	}}
>
	<article class="modal">
		<header>
			<span aria-label="Close" class="close" on:click={fullHeightImage} />
			<div
				class="linkEllipsis"
				on:mouseenter={(e) => mouseEnter(e)}
				on:mouseleave={(e) => mouseOut(e)}
			>
				<AncherNoreferrer style="" link={data.postLink} content={data.postTitle} />
			</div>
		</header>
		<img src={data.imageSrc} class="fullHeight" alt="decoration" />
		{#if data.description}
			<p>{data.description}</p>
		{/if}
		<AncherNoreferrer
			link={data.imageSrc}
			content="Open In a New Tab"
			style="margin-top: .5rem"
		/>
		<!-- <a
          rel="noopener noreferrer"
          href={imageSrc}
          target="_blank"
          style="margin: 0.5rem;">Open In New Tab</a
        > -->
	</article>
</dialog>

<style>
	dialog {
		min-height: calc(100% - 33px);
		top: 33px;
	}
	header {
		text-align: center;
		position: relative;
		margin-bottom: 0;
		z-index: 2;
	}
	.linkEllipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	article.modal {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem 1rem 1rem;
	}

	article.modal header {
		position: sticky;
		top: 0rem;
		z-index: 1;
		margin-top: 0rem;
		margin-bottom: 0.5rem;
		width: calc(100% + 2rem);
	}
	img.fullHeight {
		height: max-content !important;
		max-height: calc(100vh - 12rem) !important;
	}
</style>

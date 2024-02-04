<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from './AncherNoreferrer.svelte';
	import Comments from './Comments.svelte';

	export let comments;

	function mouseEnter(e) {
		e.target.classList.toggle('linkEllipsis');
	}
	function mouseOut(e) {
		e.target.classList.toggle('linkEllipsis');
	}

	const dispatch = createEventDispatcher();

	function fullHeightComments() {
		dispatch('viewComments', {
			value: false,
		});
	}
	function fullHeightImage(event) {
		dispatch('fullImg', {
			target: event.detail.target,
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	open
	on:click={(event) => {
		if (event.target.tagName == 'DIALOG') fullHeightComments();
	}}
>
	<article class="modal" id="article">
		<header>
			<span aria-label="Close" class="close" on:click={fullHeightComments} />
			<!-- still using the reddit api -->
			<h2
				class="linkEllipsis"
				on:mouseenter={(e) => mouseEnter(e)}
				on:mouseleave={(e) => mouseOut(e)}
			>
				<AncherNoreferrer
					style=""
					link={'https://old.reddit.com' + comments[0].data.children[0].data.permalink}
					content={comments[0].data.children[0].data.title}
				/>
			</h2>
		</header>
		<div style="height: 100%;width:100%">
			<Comments
				on:fullImg={fullHeightImage}
				commentsArr={comments[1].data.children}
				opName={comments[0].data.children[0].data.author}
			/>
		</div>
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
		margin: 0;
		font-size: 1.3rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	article.modal header {
		position: sticky;
		top: 0rem;
		z-index: 1;
		margin-top: 0rem;
		margin-bottom: 0.5rem;
		width: calc(100% + 2rem);
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
</style>

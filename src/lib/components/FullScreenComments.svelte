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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	open
	on:click={(event) => {
		if (event.target.tagName == 'DIALOG') fullHeightComments();
	}}
>
	<article class="modal">
		<header>
			<span aria-label="Close" class="close" on:click={fullHeightComments} />
			<!-- still using the reddit api -->
			<div
				class="linkEllipsis"
				on:mouseenter={(e) => mouseEnter(e)}
				on:mouseleave={(e) => mouseOut(e)}
			>
				<AncherNoreferrer
					style=""
					link={'https://old.reddit.com' + comments[0].data.children[0].data.permalink}
					content={comments[0].data.children[0].data.title}
				/>
			</div>
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

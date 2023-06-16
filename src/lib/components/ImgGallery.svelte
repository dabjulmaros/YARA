<script>
	import { createEventDispatcher } from 'svelte';

	export let srcArr;

	const dispatch = createEventDispatcher();

	let index = 0;

	function fullHeightImage(e) {
		console.log(e);
		dispatch('fullImgGall', {
			target: e.target,
		});
	}

	function changeImg(change) {
		index += change;
		if (index >= srcArr.length) index = 0;
		else if (index < 0) index = srcArr.length - 1;
	}
</script>

<div class="gallery">
	<button class="outline" on:click={() => changeImg(-1)}>◀</button>
	<div class="imgHolder" style="position:relative;">
		<mark style="position: absolute; z-index:1;opacity:.4;right:0;bottom:0" class="mark">
			{index + 1}/{srcArr.length}
		</mark>
		<div class="carousel" style={`transform:translate(-${index * 100}%)`}>
			{#each srcArr as src}
				<div>
					<img
						{src}
						alt=""
						loading="lazy"
						on:dblclick={(event) => fullHeightImage(event)}
					/>
				</div>
			{/each}
		</div>
	</div>
	<button class="outline" on:click={() => changeImg(1)}>▶</button>
</div>

<style>
	button {
		width: 3rem;
		height: 3rem;
		margin: 0;
		padding: 0.8rem;
		line-height: 0rem;
		font-size: 1.5rem;
	}
	.gallery {
		width: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.carousel {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		width: calc(100% - 2px);
		transform: translate(0%);
		transition: transform 0.3s ease-in-out;
		/* transform: translate(-100%); */
	}
	.imgHolder {
		width: calc(100% - 2px);
		overflow: hidden;
		margin: 0 auto;
	}
	.imgHolder div {
		display: flex;
		flex: 0 0 auto;
		width: 100%;
	}
	img {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

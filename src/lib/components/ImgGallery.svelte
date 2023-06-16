<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { getImgSrc } from '$lib/utils/getImgSrc';

	export let expando;
	let srcArr = [];
	let capArr = [];

	const dispatch = createEventDispatcher();

	let index = 0;

	function fullHeightImage(e) {
		dispatch('fullImgGall', {
			target: e.target,
		});
	}
	onMount(() => {
		srcArr = getImgSrc(expando);
		capArr = getCaptions(expando);
	});

	function changeImg(change) {
		index += change;
		if (index >= srcArr.length) index = 0;
		else if (index < 0) index = srcArr.length - 1;
	}
	function getCaptions(expando) {
		const returnArr = [];
		let captions = expando.matchAll(/Caption: ([^<]+) </g);
		for (const match of captions) {
			returnArr.push(match[1]);
		}
		return returnArr;
	}
</script>

<div class="gallery">
	<button class="outline" on:click={() => changeImg(-1)}>◀</button>
	<div class="imgHolder" style="position:relative;">
		<mark
			style="position: absolute; z-index:1;opacity:.4;right:0;bottom:0"
			class="mark"
			data-tooltip={capArr[index]}
		>
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
		cursor: pointer;
		margin: 1rem;
		border: none;
		height: 2.2rem;
		width: 2.7rem;
		z-index: 1;
		line-height: 1rem;
		font-size: 1.4rem;
		padding: 0rem;
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

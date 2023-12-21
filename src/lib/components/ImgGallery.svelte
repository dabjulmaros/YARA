<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { getImgSrc } from '$lib/utils/getImgSrc';
	import { htmlDecode } from '$lib/utils/htmlDecode';

	export let expando;
	export let metadata = '';
	let srcArr = [];
	let capArr = [];

	let index = 0;

	const dispatch = createEventDispatcher();
	function fullHeightImage(e) {
		dispatch('fullImg', {
			target: e.target,
		});
	}
	onMount(() => {
		if (expando !== '' && expando !== undefined) {
			srcArr = getImgSrc(expando);
			capArr = getCaptions(expando);
		} else if (metadata !== undefined || metadata !== '') {
			for (var x of metadata.items) {
				srcArr.push(htmlDecode(metadata.media[x.media_id].s.u));
			}
			//svelte quirk it wont refresh the page after array push if the array is not set to itself
			srcArr = srcArr;
		}
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
	{#if srcArr.length > 0}
		<mark
			style="position: absolute; z-index:1;opacity:.4;right:0;bottom:0"
			class="mark"
			data-tooltip={capArr[index]}
			data-placement="left"
		>
			{index + 1}/{srcArr.length}
		</mark>
		<button class="outline" on:click={() => changeImg(-1)}>
			<span class="chevron left" />
		</button>
		<div class="imgHolder" style="position:relative;">
			<div class="carousel" style={`transform:translate(-${index * 100}%)`}>
				{#each srcArr as src, i}
					<div>
						<img
							{src}
							alt=""
							loading={i == index + 1 ? 'eager' : 'lazy'}
							on:dblclick={(event) => fullHeightImage(event)}
						/>
					</div>
				{/each}
			</div>
		</div>
		<button class="outline" on:click={() => changeImg(1)}>
			<span class="chevron right" />
		</button>
	{/if}
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
		outline: var(--primary-focus) solid 2px;
	}
	.chevron {
		--icon-size: 100%;
		display: inline-block;
		cursor: pointer;
		padding: 0;
		border: none;
		height: var(--icon-size);
		width: var(--icon-size);
		background-size: var(--icon-size);
	}
	.right {
		background-image: var(--rightChevron);
	}
	.left {
		background-image: var(--leftChevron);
	}
	.gallery {
		width: 100%;
		display: flex;
		align-items: center;
		position: relative;
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
		overflow: hidden;
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
		border-radius: var(--border-radius);
	}
</style>

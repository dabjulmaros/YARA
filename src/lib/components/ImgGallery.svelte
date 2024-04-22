<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { getImgSrc } from '$lib/utils/getImgSrc';
	import { htmlDecode } from '$lib/utils/htmlDecode';

	export let expando = '';
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
				capArr.push(x.caption ?? '');
			}
			//svelte quirk it wont refresh the page after array push if the array is not set to itself
			srcArr = srcArr;
		} else {
			console.error('Gallery not properly decoded');
		}
	});

	function changeImg(change) {
		index += change;
		if (index >= srcArr.length) index = 0;
		else if (index < 0) index = srcArr.length - 1;
	}
	function getCaptions(expando) {
		const returnArr = [];
		const tempArr = [];
		let previews = expando.matchAll(/class="gallery-preview"/g);
		let captions = expando.matchAll(/Caption: ([^<]+) </g);

		for (const match of previews) {
			tempArr.push(match.index);
			returnArr.push('');
		}
		tempArr.push(expando.length);

		for (const match of captions) {
			let count = 0;
			for (let arrPos = 0; arrPos < tempArr.length; arrPos++) {
				if (match.index > tempArr[arrPos] && match.index < tempArr[arrPos + 1]) break;

				count++;
			}

			returnArr[count] = htmlDecode(match[1]);
		}
		return returnArr;
	}
</script>

<div class="gallery">
	{#if srcArr.length > 0}
		{#if capArr[index] !== ''}
			<mark class="mark" data-tooltip={capArr[index]} data-placement="left">
				{index + 1}/{srcArr.length}
			</mark>
		{:else}<mark class="mark">
				{index + 1}/{srcArr.length}
			</mark>
		{/if}
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
		margin: 0.7rem;
		border: none;
		aspect-ratio: 1;
		height: 40px;
		width: 40px;
		z-index: 1;
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
	.mark {
		position: absolute;
		z-index: 1;
		opacity: 0.4;
		right: 0;
		bottom: 0;
	}
	img {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
		border-radius: var(--border-radius);
	}
</style>

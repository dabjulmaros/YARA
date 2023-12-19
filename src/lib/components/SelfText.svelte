<script>
	import { createEventDispatcher } from 'svelte';
	// tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import { previewImageParser } from '$lib/utils/previewImageParser.js';

	export let thingID = '';
	export let postText = '';

	async function fetchSelfText(id) {
		const data = await fetch(
			`https://old.reddit.com/api/expando?link_id=${id}&renderstyle=html`,
		)
			.then((res) => {
				if (res.ok) return res.text();
			})
			.then((text) => {
				return parseHtml(text);
			})
			.catch((e) => {
				return 'Error: ' + e;
			});
		return data;
	}
	function parseHtml(text) {
		return previewImageParser(htmlDecode(text));
	}
	const dispatch = createEventDispatcher();
	function fullHeightImage(event) {
		dispatch('fullImg', {
			target: event.detail.target,
		});
	}
</script>

<div on:fullImg={fullHeightImage}>
	{#if thingID !== ''}
		{#await fetchSelfText(thingID)}
			...Loading
		{:then data}
			{@html data}
		{/await}
	{:else if postText !== ''}
		{@html parseHtml(postText)}
	{:else}
		An error has Occured
	{/if}
</div>

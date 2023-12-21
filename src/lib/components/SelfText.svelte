<script>
	import { createEventDispatcher } from 'svelte';
	// tools
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import { previewImageParser } from '$lib/utils/previewImageParser.js';

	//request
	import { fetchJsonData } from '$lib/utils/fetchJsonData.js';

	export let thingID = '';
	export let postText = '';

	async function fetchSelfText(id) {
		const data = await fetchJsonData(
			`https://old.reddit.com/api/expando?link_id=${id}&renderstyle=html`,
		);

		try {
			if (data.status == 200) {
				return parseHtml(data.response);
			} else throw new Error(`Data Error: ${JSON.stringify(data)}`);
		} catch (e) {
			return 'Error: ' + e;
		}
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

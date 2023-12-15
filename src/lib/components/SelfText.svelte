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
				document.querySelector(`#self_${id}`).innerHTML = parseHtml(text);
			})
			.catch((e) => {
				document.querySelector(`#self_${id}`).innerHTML = 'Error: ' + e;
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
		{@html fetchSelfText(thingID)}
	{:else if postText !== ''}
		{@html parseHtml(postText)}
	{:else}
		An error has Occured
	{/if}
</div>

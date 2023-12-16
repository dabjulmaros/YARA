<script>
	import { localStore } from '$lib/utils/storable';
	import { searchCleaner } from '$lib/utils/searchCleaner';

	export let link;
	export let content = link;
	export let style = '';
	export let role = '';

	if (link.substr(0, 3) == '/r/' || link.substr(0, 3) == '/u/')
		link = 'https://old.reddit.com' + link;

	function testLink(e) {
		let validLink = true;
		let vLink = searchCleaner(link, $localStore.method, false);

		try {
			new URL(vLink);
		} catch {
			validLink = false;
		}

		if (validLink) return;
		else window.location = vLink;
		e.preventDefault();
	}
</script>

<a
	rel="noopener noreferrer"
	href={link}
	{style}
	target="_blank"
	{role}
	on:click={testLink}
	title={content}
>
	{#if Object.keys($$slots).length}
		<slot />
	{:else}
		{@html content}
	{/if}
</a>

<style>
	a[role='button'] {
		min-width: 10rem;
		margin: 0 auto;
		display: block;
		width: fit-content;
	}
</style>

<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import Logo from '$lib/Logo.svelte';
	import { browser } from '$app/environment';

	let desktop: string;

	if (window.electron && browser) {
		window.electron.receive('from-main', (data: any) => {
			desktop = `Received Message "${data}" from Electron`;
			console.log(desktop);
		});
	}

	const agent = window.electron ? 'Electron' : 'Browser';

	//custom changes
	import Search from '$lib/components/Search.svelte';
	import { localStore } from '$lib/utils/storable';

	let componentSearch: (arg0: number) => void;

	function sendSearch() {
		componentSearch($localStore.method ? 2 : 1);
	}
</script>

<!-- <main> -->
<!-- <Logo />

	<h1>Hello {agent}!</h1>

	<Counter id="0" {agent} />

	{#if desktop}
		<br />
		<br />
		{desktop}
	{/if} -->

<form on:submit|preventDefault={sendSearch} class="flex">
	{#if browser}
		<h3>Where to</h3>
		<Search bind:submitSearch={componentSearch} noMargin={false} inputField="" />
		<div class="flex">
			<input
				type="checkbox"
				id="switch"
				name="switch"
				role="switch"
				bind:checked={$localStore.method}
			/>
			<label for="switch">
				{$localStore.method ? 'Scrape' : 'API'}
			</label>
			<button>Go</button>
		</div>
	{/if}
</form>

<!-- </main> -->

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		padding: 2em 1em 1em 1em;
		text-align: center;
		animation: fade 1s;
		margin: 0 auto;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.flex {
		display: flex;
	}
	form {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;

		height: 100vh;
		overflow: hidden;
		flex-direction: column;
		justify-content: center;
	}
	h3 {
		margin-bottom: 1rem;
	}
	div {
		align-items: center;
	}
	label {
		min-width: 7ch;
		text-align: center;
		margin: 0 2rem 0 0;
	}
	button {
		flex: 1;
		margin: 0;
		padding: 0.4rem;
	}
</style>

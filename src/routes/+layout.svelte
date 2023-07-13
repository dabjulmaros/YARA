<script>
	import { onMount } from 'svelte';

	let ready = false;

	// document.body.addEventListener('keypress', (e) => {
	// 	if (e.code == 'KeyF' && e.ctrlKey) {
	// 		console.log('search?');
	// 	}
	// });

	onMount(() => (ready = true));
</script>

<div class="dragbar">
	<span>🆈ara</span>
</div>
<!-- <tab-group new-tab-button="true" /> --><!--tab-groups -->

{#if ready}
	<slot />
{/if}

<style>
	.dragbar {
		-webkit-app-region: drag;
		position: absolute;
		z-index: 100;
		height: 33px;
		width: 100%;
		top: 0;
		color: var(--primary);
	}
	.dragbar span {
		text-align: center;
		width: 100%;
		display: block;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	let ready: boolean = false;
	onMount(() => (ready = true));
</script>

<div class="dragbar">
	<span style="margin-left:1rem">🆈ara</span>
	<span />
</div>

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
</style>

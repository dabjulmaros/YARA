<script>
	import { createEventDispatcher } from 'svelte';

	export let src;

	const dispatch = createEventDispatcher();
	function fullHeightImage(e) {
		dispatch('fullImg', {
			target: e.target,
		});
	}
</script>

<img {src} alt="" loading="lazy" on:dblclick={(event) => fullHeightImage(event)} />

<style>
	img {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

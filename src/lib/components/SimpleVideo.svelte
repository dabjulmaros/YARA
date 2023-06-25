<script>
	export let src;
	function toggleMute(e) {
		e.target.muted = !e.target.muted;
		e.preventDefault();
	}
</script>

<video {src} muted autoplay loop controls on:click={toggleMute} />

<style>
	video {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

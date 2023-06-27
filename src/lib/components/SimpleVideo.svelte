<script>
	import inView from '$lib/utils/inView';
	export let src;
	function toggleMute(e) {
		e.target.muted = !e.target.muted;
		e.preventDefault();
	}
	let video;
</script>

<video
	use:inView
	on:enterView={() => {
		video.play();
	}}
	on:exitView={() => {
		video.pause();
	}}
	bind:this={video}
	{src}
	muted
	autoplay
	loop
	controls
	on:click={toggleMute}
/>

<style>
	video {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

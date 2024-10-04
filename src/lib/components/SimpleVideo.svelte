<script>
	import inView from '$lib/utils/inView';
	export let src;
	export let poster = '';
	function toggleMute(e) {
		e.target.muted = !e.target.muted;
		e.preventDefault();
	}
	let video;
</script>

<video
	use:inView
	on:enterView={() => {
		if (poster !== '') return;
		video.play();
	}}
	on:exitView={() => {
		if (poster !== '') return;
		video.pause();
	}}
	bind:this={video}
	{src}
	{poster}
	muted={(poster = '' ? true : false)}
	autoplay={(poster = '' ? true : false)}
	loop
	controls
	on:click={toggleMute}
/>

<style>
	video {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		min-width: 200px;
		margin: 0 auto;
	}
</style>

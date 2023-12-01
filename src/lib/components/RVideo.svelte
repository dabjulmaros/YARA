<!-- Need to fix issue where audio loads before video -->
<script>
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import inView from '$lib/utils/inView';

	export let expando;
	export let data;
	let video;
	let audio;
	let paused;
	let currentTime;

	$: if (paused != undefined) togglePlaying();

	function toggleMute(e) {
		if (!video.paused) audio.play();
		else audio.pause();

		video.muted = !video.muted;
		audio.muted = video.muted;

		audio.currentTime = currentTime;
		e.preventDefault();
	}
	function togglePlaying(override = null) {
		if (currentTime == undefined) currentTime = 0;

		if (override != null) paused = override;

		if (!paused) {
			video.play();
			audio.play();
		} else {
			video.pause();
			audio.pause();
		}
		audio.currentTime = currentTime;
	}

	function getVideoSrc() {
		let baseURL;
		let mpdList;
		if (expando !== undefined && expando !== '') {
			baseURL = expando.match(/data-seek-preview-url="([^"]+)"/)[1];
			mpdList = expando.match(/data-mpd-url="([^"]+)"/)[1];
		} else if (data !== undefined && data !== '') {
			baseURL = data.scrubber_media_url;
			mpdList = data.dash_url;
		}
		fetch(htmlDecode(mpdList))
			.then((res) => {
				if (res.ok) return res.text();
			})
			.then((text) => {
				let audioExists = text.match(/dash_audio?(_?.+).mp4/gi);
				let quality = text.match(/DASH_(\d+).mp4/g);
				// let highest = 0
				// for(let match of mpd.matchAll(/DASH_(\d+).mp4/g)) if(match[1]>highest) highest = match[1]
				// let use =  `DASH_${highest}.mp4`
				//assumes that the mpd file has the highest quality as the last
				let use = quality[quality.length - 1];
				video.src = baseURL.replace('DASH_96.mp4', use);
				if (audioExists.length > 0) {
					const source = document.createElement('source');
					source.src = baseURL.replace(
						'DASH_96.mp4',
						audioExists[audioExists.length - 1],
					);
					audio.appendChild(source);
				}
			});
	}
</script>

<video
	muted
	loop
	controls
	use:inView
	on:enterView={() => {
		togglePlaying(false);
	}}
	on:exitView={() => {
		togglePlaying(true);
	}}
	src={getVideoSrc()}
	bind:this={video}
	bind:paused
	bind:currentTime
	on:click={toggleMute}
	on:touchend={toggleMute}
>
	<audio muted loop bind:this={audio} />
</video>

<style>
	video {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

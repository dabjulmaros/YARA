<script>
	export let srcArr;
	let index = 0;

	function changeImg(change) {
		index += change;
		if (index >= srcArr.length) index = 0;
		else if (index < 0) index = srcArr.length - 1;
		console.log(index, change);
	}
</script>

<div class="gallery">
	<button class="outline" on:click={() => changeImg(-1)}>◀</button>
	<div class="imgHolder">
		<div class="carousel" style={`transform:translate(-${index * 100}%)`}>
			{#each srcArr as src}
				<div>
					<img {src} alt="" loading="lazy" />
				</div>
			{/each}
		</div>
	</div>
	<button class="outline" on:click={() => changeImg(1)}>▶</button>
</div>

<style>
	button {
		width: 3rem;
		height: 3rem;
		margin: 0;
		padding: 0.8rem;
		line-height: 0rem;
		font-size: 1.5rem;
	}
	.gallery {
		width: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.carousel {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		width: calc(100% - 2px);
		transform: translate(0%);
		transition: transform 0.3s ease-in-out;
		/* transform: translate(-100%); */
	}
	.imgHolder {
		width: calc(100% - 2px);
		overflow: hidden;
		margin: 0 auto;
	}
	.imgHolder div {
		display: flex;
		flex: 0 0 auto;
		width: 100%;
	}
	img {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

<script>
	export let srcArr;
</script>

<div class="gallery">
	<button>◀</button>
	<div class="imgHolder">
		<div class="carousel">
			{#each srcArr as src}
				<div>
					<img {src} alt="" loading="lazy" />
				</div>
			{/each}
		</div>
	</div>
	<button>▶</button>
</div>

<style>
	button {
		font-size: 1rem;
		width: 1rem;
		height: 1rem;
		line-height: 0;
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
		/* transform: translate(-100%); */
	}
	.imgHolder {
		width: 100%;
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

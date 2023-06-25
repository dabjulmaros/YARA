<script>
	export let src;
	export let title;
</script>

<iframe
	{src}
	frameborder="0"
	scrolling="no"
	width="550px"
	height="511px"
	allowfullscreen=""
	{title}
/>

<style>
	:global(iframe) {
		display: block;
		margin: 0 auto;
		height: 47vh;
		max-height: 47vh;
		max-width: 100%;
		overflow: hidden;
		border-radius: 15px;
	}
</style>

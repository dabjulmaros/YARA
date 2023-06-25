<script>
	export let src;
	export let title;
</script>

<iframe
	{src}
	frameborder="0"
	style="border-radius:15px;overflow:hidden;margin:0 auto;height:47vh"
	scrolling="no"
	width="550px"
	height="511px"
	allowfullscreen=""
	{title}
/>

<style>
	iframe {
		height: fit-content;
		max-height: 47vh;
		max-width: 100%;
		margin: 0 auto;
	}
</style>

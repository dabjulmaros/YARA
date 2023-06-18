<script>
	export let message;
</script>

<div class="holder">
	<article>
		<header>
			<h2>{message[0]}</h2>
		</header>
		<h5>{message[1]}</h5>
		{#each message as p, i}
			{#if i > 1}
				<p>{p}</p>
			{/if}
		{/each}
	</article>
</div>

<style>
	.holder {
		height: calc(100vh - 9rem);
		display: flex;
		min-width: 900px;
		align-items: center;
	}
	article {
		max-width: 900px;
		min-width: 450px;
		margin: 1rem auto;
		height: fit-content;
	}
	article > h5 {
		margin-top: 2rem;
		text-align: center;
	}
	header {
		text-align: center;
		position: relative;
		margin-bottom: 0;
	}
	header > h2 {
		width: 90%;
		margin: 0 auto;
		margin-bottom: 0.5rem;
	}
</style>

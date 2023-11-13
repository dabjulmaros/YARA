<script>
	import { shortNum } from '$lib/utils/shortNum';
	import AncherNoreferrer from './AncherNoreferrer.svelte';
	export let items;
	console.log(items);
</script>

<div>
	{#each items as data}
		<!-- filters out users -->
		{#if data.title !== '' && data.members !== ''}
			<article>
				<div class="body">
					<h2>
						<AncherNoreferrer link={`${data.link}`} content={`View ${data.title}`} />
					</h2>
					<small>{shortNum(null, data.members)} subscribers</small>
					<p>{data.description}</p>
				</div>
			</article>
		{/if}
	{/each}
</div>

<style>
	article {
		max-width: 1500px;
		margin: 1rem auto;
	}
	div.body {
		display: flex;
		flex-direction: column;
	}
	h2 {
		margin-bottom: 0.5rem;
	}
	@media (min-width: 801px) {
		div.body {
			min-height: 5vh;
		}
	}
</style>

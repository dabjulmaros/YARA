<script>
	import { shortNum } from '$lib/utils/shortNum';
	import AncherNoreferrer from './AncherNoreferrer.svelte';
	export let items;
</script>

<div class="grid">
	{#each items as data}
		<!-- filters out users -->
		{#if data.title !== '' && data.members !== ''}
			<article>
				<div class="body">
					<h2>
						<AncherNoreferrer link={`${data.link}`} content={`View ${data.title}`} />
					</h2>
					<small>{data.community} · {shortNum(null, data.members)} subscribers</small>
					<p>{data.description}</p>
				</div>
			</article>
		{/if}
	{/each}
</div>

<style>
	div.grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 0.5rem;
		grid-row-gap: 0.5rem;
		margin: 1rem auto;
	}
	article {
		width: calc(100% - 1rem);
		margin: 0.5rem 0.5rem;
	}
	div.body {
		display: flex;
		flex-direction: column;
	}
	h2 {
		margin-bottom: 0.5rem;
	}
	@media (min-width: 801px) {
		div.grid {
			grid-template-columns: repeat(2, 1fr);
			max-width: 1500px;
		}
	}
</style>

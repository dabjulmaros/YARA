<script>
	import { shortNum } from '$lib/utils/shortNum';
	import AncherNoreferrer from './AncherNoreferrer.svelte';
	export let items;
	console.log(items);
</script>

<div>
	{#each items as data}
		<!-- filters out users -->
		{#if data.title !== ''}
			<article>
				<div class="body">
					<h2>
						<AncherNoreferrer link={`${data.link}`} content={`View ${data.title}`} />
					</h2>
					<small>{shortNum(null, data.members)}</small>
					<p>{data.description}</p>
				</div>
			</article>
		{/if}
	{/each}
</div>

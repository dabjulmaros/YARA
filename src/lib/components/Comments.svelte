<script>
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	//utils
	import { shortNum } from '$lib/utils/shortNum';
	import { getTime } from '$lib/utils/getTime';

	export let commentsArr;
	export let opName;
</script>

<div class="parent">
	{#each commentsArr as comment}
		{#if comment.kind !== 'more'}
			<details open>
				<summary>
					<div>
						{#if comment.data.author === opName}
							<code>OP</code>
						{/if}
						<AncherNoreferrer
							link={`/u/${comment.data.author}`}
							content={comment.data.author}
							style="width: fit-content;margin: 0.3rem 0;flex-basis: 100%;"
						/>
					</div>
					<small>
						{getTime(null, comment.data.created)} · {shortNum(null, comment.data.score)}
						points
					</small>
				</summary>
				<div class="comment border">{@html htmlDecode(comment.data.body_html)}</div>
				{#if comment.data.replies !== '' && comment.data.replies.kind !== 'more'}
					<div class="child border">
						<svelte:self commentsArr={comment.data.replies.data.children} {opName} />
					</div>
				{/if}
			</details>
		{/if}
	{/each}
</div>

<style>
	.parent {
		width: 100%;
	}

	.comment {
		padding: 0.5rem 0 0 0.5rem;
		width: 95%;
	}
	.child {
		padding: 0.5rem 0 0 1rem;
	}

	summary {
		margin: 0 0 0 1rem;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	details > summary::after {
		margin: 0;
		position: absolute;
		left: -1.5rem;
		top: 50%;
		transform: translate(0px, -50%) rotate(270deg);
	}

	details summary:focus {
		color: var(--accordion-close-summary-color);
	}

	details:last-child {
		padding: 0;
	}

	details[open] {
		border: none;
		margin-bottom: 0;
	}

	details[open] .border {
		border: none;
		border-left: solid 1px var(--accordion-border-color);
	}

	details[open] > summary::after {
		transform: translate(0px, -50%) rotate(360deg);
	}

	details[open] summary:focus {
		color: var(--accordion-open-summary-color);
	}

	:global(.comment .md p:last-child) {
		margin-bottom: 0;
	}
	:global(.md *) {
		margin: 0;
	}
</style>

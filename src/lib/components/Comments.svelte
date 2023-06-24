<script>
	import { htmlDecode } from '$lib/utils/htmlDecode.js';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';

	//utils
	import { getPoints } from '$lib/utils/getPoints';
	import { getTime } from '$lib/utils/getTime';

	export let commentsArr;

	console.log(commentsArr);
</script>

<div class="parent">
	{#each commentsArr as comment}
		{#if comment.kind !== 'more'}
			<details open>
				<summary>
					<AncherNoreferrer
						link={`/u/${comment.data.author}`}
						content={comment.data.author}
						style="width: fit-content;margin: 0.3rem 0;flex-basis: 100%;"
					/>
					<small>
						{getTime(null, comment.data.created)} · {getPoints(
							null,
							comment.data.score,
						)}
					</small>
				</summary>
				<div class="comment border">{@html htmlDecode(comment.data.body_html)}</div>
				<div class="child border">
					{#if comment.data.replies}
						<svelte:self commentsArr={comment.data.replies.data.children} />
					{/if}
				</div>
			</details>
		{/if}
	{/each}
</div>

<style>
	details[open] .border {
		border: none;
		border-left: solid 1px var(--accordion-border-color);
	}
	.comment {
		padding-left: 0.5rem;
		width: 95%;
	}
	.child {
		padding-top: 0.5rem;
		padding-left: 1rem;
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
	details[open] > summary::after {
		transform: translate(0px, -50%) rotate(360deg);
	}

	details[open] summary:focus {
		color: var(--accordion-open-summary-color);
	}
	details summary:focus {
		color: var(--accordion-close-summary-color);
	}
	details[open] {
		border: none;
	}
</style>

<script>
	import Search from './Search.svelte';
	export let subNameField;
</script>

<article>
	<nav>
		<ul style="margin: 0;width: 100%;">
			<li style="padding:0;padding-left:2rem;">
				<a href="/" class="secondary home"><span /></a>
			</li>

			<li style="text-align:center;padding:0 2rem;width:100%">
				<Search noMargin={true} inputField={subNameField} />
			</li>

			<ul />
		</ul>
	</nav>
</article>

<style>
	article {
		max-width: 1500px;
		margin: 0 auto;
		padding: 0.5rem;
		border: var(--primary-focus) solid;
		position: sticky;
		top: 0;
		z-index: 3;
		height: 4.5rem;
	}
	.home {
		--icon-size: 2rem;
		background-image: var(--home);
		width: var(--icon-size);
		height: var(--icon-size);
		background-size: var(--icon-size);
		background-color: var(--primary-focus);
	}
	a {
		font-size: 2rem;
		padding: 0;
		line-height: 2.2rem;
		margin-top: -4px;
		height: 2.6rem;
		width: 2.4rem;
	}
</style>

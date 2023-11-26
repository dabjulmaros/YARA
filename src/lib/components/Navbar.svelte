<script>
	import Search from './Search.svelte';
	export let subNameField;
</script>

<article>
	<nav>
		<ul style="margin: 0;width: 100%;">
			<li style="padding:0;padding-left:2rem;">
				<a href="/" class="secondary home" />
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
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAtNJREFUaEPtmT9oE3EUx7/vjrQOTZvYRkVQcBIHB6GCYmsTdFAXrbTdKkjBIW2t0s3Btg5uxT9pMghF0K0tVhd1UJLaioIFBwdxEhRETWsujYNJuHuSoqDp9XL3yx2R+rv13r/P+977vR8cYYM8tEE4IEH+NSWlIv+dIo3x5LES9Ep/5LGX8N59WszUlHh2joAbJQAGhrLRw7dAxF4AeQMyNaUG0tsuATwCQP1VuA7QmBb6fBU9PbrbMO6DjE7VBUJbxwFEAShlBRsAElr6yzBGewpuwrgK0jK54Nd/GJMM7rYqkkDT6ialb6mvLecWjGsg/oknzSr5pgFEbBaX1LnYnRs4umzT3tLMFZDg9fmd7DPuA9jnsKjXVFROZS60f3Dot8a8apBgbG4vK3gAYJdgMe/JwMnMYMcbQf9Vt6pAgolUOzPNANhSTREAvhJxVyYanheNIwwSmEh1gug2gCbR5GV+WTCf1QbCsyLxnIP8vejqRZJa+ORFF6czEPNF5zILhBanfRDrRec2jOPFaQvE7qJzm8bJ4qwIEriWDKBOKZ1MR9wu1Ga8pygYXdrFiGZ9W7B42xJb2F5U9BkCDtpM6okZAy98htq1NNj2ab0E6yriTyzsVlifJWCPJ9U5DMrAW4PUzly07Z2ZqylIUyzZSopyD8AOh/m8Nv/IhnE6OxhZLE+0BiSYSB1nprsAmr2uSjD+MhH3ZqLhR3/6Vxz238aBROoymMYEk4u5EY9o0fAVO84SxE6XqraRili00MGMvNJJ7a2j/HezcAWub1BZLx0m+ysqVlNFGM8Vo/7Et/MHVswK3XzzZaOh5B+CcEiCmHTA/VNLKmLW5lruEamIVGS1A3LY190BckbkjDickfjcEIDhitcKYNEH40y6P2J61wrFkw1FKHcAtNqINa71d6z+8ar02B72SoFq/V6C1FqB8vxSEamIRx2Qn5ZHjRUO+xN7gKBCwphrTQAAAABJRU5ErkJggg==);
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

<script>
	import { page } from '$app/stores';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { error } from '@sveltejs/kit';
	console.log($page);
</script>

<div class="scroll">
	<Navbar subNameField="" />
	<ErrorMessage message={[$page.status, $page.error.message]} />
</div>

<style>
	div.scroll {
		overflow-y: auto;
		overflow-x: hidden;
		height: calc(100vh - 33px);
		margin-top: 33px;
	}
</style>

<script>
	import { localStore } from '$lib/utils/storable';
	import { searchCleaner } from '$lib/utils/searchCleaner';

	export let noMargin;
	export const submitSearch = () => formSubmit();
	export let inputField;

	let element;

	function formSubmit() {
		let cleanInputField = searchCleaner(inputField, $localStore.method, true);
		window.location = cleanInputField;
	}

	function keyDown(e) {
		if (e.keyCode == 13) {
			formSubmit();
		}
	}
	function textDrop(e) {
		e.preventDefault();
		let textData = e.dataTransfer.getData('text'); // get the dragged value
		e.target.value = textData; // change the value with the new value
		inputField = textData;
		formSubmit();
	}
	function input(element) {
		if (element.target) {
			element = element.target;
		}
		if (inputField == '') {
			element.className = 'home';
		} else if (inputField.substring(0, 2) == 'u/') {
			element.className = 'person';
		} else if (
			inputField.substring(0, 1) == '?' ||
			inputField.includes('search') ||
			inputField.includes('Search')
		) {
			element.className = 'search';
		} else if (inputField.includes('/comments/')) {
			element.className = 'post';
		} else {
			element.className = 'community';
		}
	}
</script>

<input
	type="search"
	class="home"
	id="searchBar"
	placeholder="Enter Sub name... no r/ needed"
	bind:value={inputField}
	on:keydown={keyDown}
	on:drop={textDrop}
	on:input={input}
	bind:this={element}
	use:input
	style={`max-width:600px;${noMargin ? 'margin:0' : ''}`}
/>

<style>
	/* home */
	:global(input[type='search']#searchBar) {
		background-size: 25px;
		background-position-x: 16px;
	}
	:global(input[type='search'].home) {
		background-image: var(--navBarHome);
	}
	/* search */
	:global(input[type='search'].search) {
		background-image: var(--navBarSearch);
	}
	/* person */
	:global(input[type='search'].person) {
		background-image: var(--navBarSearch);
	}
	/* public */
	:global(input[type='search'].community) {
		background-image: var(--navBarCommunity);
	}
	/* forum */
	:global(input[type='search'].post) {
		background-image: var(--navBarPost);
	}
</style>

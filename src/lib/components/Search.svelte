<script>
	import { localStore } from '$lib/utils/storable';
	import { searchCleaner } from '$lib/utils/searchCleaner';

	export let noMargin;
	export const submitSearch = () => formSubmit();

	export let inputField;
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
</script>

<input
	type="search"
	placeholder="Enter Sub name... no r/ needed"
	bind:value={inputField}
	on:keydown={keyDown}
	on:drop={textDrop}
	style={`max-width:600px;${noMargin ? 'margin:0' : ''}`}
/>

<script>
	export let noMargin;
	export const submitSearch = (method) => formSubmit(method);

	export let inputField;
	function formSubmit(method = 0) {
		if (inputField != '') {
			let cleanInputField = inputField;

			if (cleanInputField.includes('/r/')) cleanInputField = cleanInputField.split('/r/')[1];

			if (cleanInputField.substr(0, 2) == 'r/') cleanInputField = cleanInputField.substr(2);

			if (cleanInputField.includes('/comments/'))
				cleanInputField = cleanInputField.match(/([^/]+\/comments\/[^/]+)/)[1];

			if (cleanInputField.includes('reddit.com/'))
				cleanInputField = cleanInputField.split('reddit.com/')[1];

			if (window.location.pathname.includes('/scrape/') || method == 2)
				window.location = `/scrape/${cleanInputField}`;
			else window.location = `/r/${cleanInputField}`;
		} else {
			document.querySelector('input').setAttribute('aria-invalid', 'true');
			document.querySelector('input').placeholder = 'Please Enter a Sub name';
			setTimeout(() => {
				document.querySelector('input').setAttribute('aria-invalid', 'false');
				document.querySelector('input').placeholder = 'Enter Sub name... no r/ needed';
			}, 1000);
		}
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

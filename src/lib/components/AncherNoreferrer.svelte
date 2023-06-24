<script>
	export let link;
	export let content = link;
	export let style = '';
	export let role = '';

	if (link.substr(0, 3) == '/r/' || link.substr(0, 3) == '/u/')
		link = 'https://old.reddit.com' + link;
</script>

<a rel="noopener noreferrer" href={link} {style} target="_blank" {role}>{@html content}</a>

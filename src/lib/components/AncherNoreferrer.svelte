<script>
	export let link;
	export let content = link;
	export let style;

	if (link.substr(0, 3) == '/r/') link = 'https://old.reddit.com' + link;
</script>

<a rel="noopener noreferrer" href={link} {style} target="_blank">{@html content}</a>

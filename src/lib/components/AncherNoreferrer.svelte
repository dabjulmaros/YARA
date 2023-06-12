<script>
  export let link;
  export let content = link;
  export let style;
</script>

<a rel="noopener noreferrer" href={link} {style} target="_blank"
  >{@html content}</a
>

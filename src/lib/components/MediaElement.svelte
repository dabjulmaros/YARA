<script>
	import { createEventDispatcher } from 'svelte';
	import AncherNoreferrer from '$lib/components/AncherNoreferrer.svelte';
	import RVideo from '$lib/components/RVideo.svelte';
	import ImgGallery from '$lib/components/ImgGallery.svelte';
	import UserComment from '$lib/components/UserComment.svelte';
	import SimpleVideo from '$lib/components/SimpleVideo.svelte';
	import SimpleIFrame from '$lib/components/SimpleIFrame.svelte';
	import SimpleImg from '$lib/components/SimpleImg.svelte';

	//tools
	import { getImgSrc } from '$lib/utils/getImgSrc.js';
	import { htmlDecode } from '$lib/utils/htmlDecode.js';

	export let data;

	function fetchSelfText(id) {
		fetch(`https://old.reddit.com/api/expando?link_id=${id}&renderstyle=html`)
			.then((res) => {
				if (res.ok) return res.text();
			})
			.then((text) => {
				document.querySelector(`#self_${id}`).innerHTML = htmlDecode(text);
			});
	}

	const dispatch = createEventDispatcher();
	function fullHeightImage(event) {
		dispatch('fullImg', {
			target: event.detail.target,
		});
	}
</script>

<div class={'media'}>
	{#if data.expandoType == 'media'}
		{#if data.thingDomain == 'v.redd.it'}
			<RVideo expando={data.expando} data={''} />
		{:else if data.expando.includes('iframe')}
			<SimpleIFrame
				src={'https://' +
					data.expando.match(/src="([^"]+)/)[1] +
					'?responsive=true&is_nightmode=true'}
				title={data.title}
			/>
		{:else if data.expando.includes('gallery')}
			<ImgGallery expando={data.expando} on:fullImg={(event) => fullHeightImage(event)} />
		{:else if data.thingDomain.includes('imgur') && data.dataUrl.includes('gifv')}
			<SimpleVideo src={data.dataUrl.replace('gifv', 'mp4')} />
		{:else}
			<SimpleImg
				src={getImgSrc(data.expando)[0]}
				on:fullImg={(event) => fullHeightImage(event)}
			/>
		{/if}
	{:else if data.expandoType == 'text' || data.expandoType == 'crossPost'}
		<div id={'self_' + data.thingID} class="post">
			{fetchSelfText(data.thingID)}
		</div>
	{:else if data.expandoType == 'none'}
		{#if data.expando.includes('imgur') && data.expando.includes('gifv')}
			<SimpleVideo src={data.expando.replace('gifv', 'mp4')} />
		{:else}
			<AncherNoreferrer style="" link={data.expando} content={data.expando} />
		{/if}
	{:else if data.expandoType == 'comment'}
		<UserComment comment={data.expando} />
	{:else}
		{@html data.expando}
	{/if}
</div>

<style>
	div.media {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	div.post {
		overflow: hidden;
		width: 100%;
		height: 100%;
		border: dashed 1px var(--muted-border-color);
		padding: 20px;
	}
	:global(.md p:last-child) {
		margin-bottom: 0;
	}
	:global(table) {
		font-size: 0.8rem;
	}
	:global(th, td) {
		padding: 0;
	}
	@media (min-width: 801px) {
		div.media {
			display: flex;
			flex-direction: column;
			margin: 1rem auto;
			position: relative;
			z-index: 1;
			width: 60%;
		}
	}
</style>

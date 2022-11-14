<script>
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";

	export let group = [];
	let index = 0;
	function switchImage() {
		if (index < group.length - 1) index++;
		else index = 0;
		console.log(index, group.length);
	}
</script>

<div class="col-4 container">
	{#each group as image, i}
		{#await preload(image) then _}
			<img
				src={image}
				alt={image}
				on:click={switchImage}
				class={index === i ? "image active" : "image inactive"}
				in:blur={{ duration: 2000 }}
			/>
		{/await}
	{/each}
	<span class="image_index">{index + 1}/{group.length}</span>
</div>

<style>
	.container {
		position: relative;
	}
	.image {
		width: 100%;
		padding: 5px;
	}
	.image_index {
		background-color: var(--background);
		border-color: var(--text);
		padding: 2px;
		padding-left: 10px;
		padding-right: 10px;
		position: absolute;
		top: 25px;
		right: 10px;
		border-radius: 10%;
	}
	.image.active {
		opacity: 1;
		transition: all 1s ease-in-out 2s;
		animation-delay: 1s, 2s;
	}
	.image.inactive {
		opacity: 0;
		transition: all 1s ease-in-out 2s;
		animation-delay: 1s, 2s;
		display: none;
	}
</style>

<script>
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";

	export let image = null;
</script>

<div class="col-4">
	{#await preload(image) then _}
		<img
			src={image}
			alt={image}
			class="image"
			in:blur={{ duration: 2000 }}
		/>
	{/await}
</div>

<style>
	.image {
		width: 100%;
		padding: 5px;
	}
</style>

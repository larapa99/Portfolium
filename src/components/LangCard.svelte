<script>
	import { blur } from "svelte/transition";
	import { preload } from "../scripts/functions";
	export let lang = null;
</script>

<div class="container">
	<h2>{lang.name}</h2>
	{#if lang.image}
		{#await preload(lang.image) then _}
			<img
				src={lang.image}
				alt={lang.name}
				class="image"
				in:blur={{ duration: 3000 }}
			/>
		{/await}
	{/if}
	<div class="stars">
		{#each Array(Math.floor(lang.level)) as _, i}
			<i class="fas fa-star" />
		{/each}
		{#if lang.level % Math.floor(lang.level) !== 0}
			<i class="fas fa-star-half-alt" />
		{/if}
		{#each Array(5 - Math.round(lang.level)) as _, i}
			<i class="far fa-star" />
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
	.container h2 {
		font-size: 1.5rem;
		margin-bottom: 10px;
	}
	.image {
		height: 50px;
		width: 100px;
		object-fit: cover;
		margin-bottom: 20px;
		border-radius: 5%;
	}
	.stars i {
		color: var(--yellow);
	}
	.stars {
		display: flex;
		justify-content: space-around;
	}
	@media only screen and (min-width: 768px) {
		.image {
			height: 100px;
			width: 200px;
		}
		.stars i {
			font-size: 1.5rem;
		}
	}
</style>

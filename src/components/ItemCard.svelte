<script>
	import { blur } from "svelte/transition";
	import { preload } from "../scripts/functions";

	export let item = null;
</script>

{#await preload(item.image) then _}
	<div class="container">
		{#if item.image}
			<img
				src={item.image}
				alt={item.name}
				class="image"
				in:blur={{ duration: 2000 }}
			/>
		{/if}
		<p>{item.name}</p>
		<!-- {#if item.level}
			<div class="stars">
				{#each Array(Math.floor(item.level)) as _, i}
					<i class="fas fa-star" />
				{/each}
				{#if item.level % Math.floor(item.level) !== 0}
					<i class="fas fa-star-half-alt" />
				{/if}
				{#each Array(5 - Math.round(item.level)) as _, i}
					<i class="far fa-star" />
				{/each}
			</div>
		{/if} -->
	</div>
{/await}

<style>
	.container {
		display: flex;
		flex-direction: column;
		margin: 20px;
	}
	.container p {
		margin-top: 10px;
		text-align: center;
		opacity: 0.5;
	}
	.image {
		height: 40px;
		width: 40px;
		object-fit: contain;
		align-self: center;
	}
	.stars i {
		color: var(--yellow);
		font-size: 0.6rem;
	}
	.stars {
		display: flex;
		justify-content: space-around;
	}

	@media only screen and (min-width: 768px) {
		.image {
			height: 80px;
			width: 80px;
		}
		.stars i {
			color: var(--yellow);
			font-size: 1rem;
		}
		.container {
		display: flex;
		flex-direction: column;
		margin: 40px;
	}
	}
</style>

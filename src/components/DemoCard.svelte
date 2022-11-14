<script>
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";

	export let data = null;
	export let repository = "repository";
	export let demo = "try demo";

	let images = data.images;
	let index = 0;
	function switchImage() {
		if (index < images.length - 1) index++;
		else index = 0;
		console.log(index, images.length);
	}
</script>

<div class="col-4">
	<div class="container">
		<div class="header-container">
			{#if data.title}
				<h2>{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<h4>{data.subtitle}</h4>
			{/if}
		</div>
		<div class="title-container">
			{#each data.images as image, i}
				{#await preload(image) then _}
					<img
						src={image}
						alt={i}
						on:click={switchImage}
						class={index === i ? "image active" : "image inactive"}
						in:blur={{ duration: 2000 }}
					/>
				{/await}
			{/each}
			<span class="image_index">{index + 1}/{images.length}</span>
		</div>
		<div class="data-container">
			{#if data.description}
				<p>{data.description}</p>
			{/if}
		</div>
		<div class="link-container">
			{#if data.repo_link}
				<a href={data.repo_link}>{repository}</a>
			{/if}
			{#if data.demo_link}
				<a href={data.demo_link}>{demo}</a>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
	.link-container {
		display: flex;
		flex-direction: row;
		justify-content: right;
		column-gap: 20px;
		text-transform: capitalize;
	}
	.title-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		position: relative;
	}
	.data-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	.container p {
		text-align: justify;
		margin-top: 10px;
	}
	.image {
		width: 100%;
		object-fit: contain;
		align-self: center;
		border-radius: 2%;
		margin-top: 20px;
		margin-bottom: 10px;
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
	.container a {
		color: var(--primary-light);
		text-decoration: none;
		align-self: flex-end;
		margin-top: 10px;
	}
	.header-container h2 {
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
	}
	.header-container h4 {
		text-align: center;
		font-size: 1rem;
		opacity: 0.4;
	}
	@media only screen and (min-width: 768px) {
		.header-container h2 {
			text-align: start;
			font-size: 2rem;
			font-weight: bold;
		}
		.header-container h4 {
			text-align: start;
			font-size: 1rem;
			opacity: 0.4;
		}
		.image {
			width: 100%;
			border-radius: 2%;
			height: 300px;
		}
		.title-container {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;
		}
	}
</style>

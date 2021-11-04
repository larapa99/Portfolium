<script>
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";
	import { Link } from "svelte-navigator";

	export let data = null;
	export let goto = "go to";
</script>

<div class="col-6">
	<div class="container">
		<div class="title-container">
			<div class="col-6 centered">
				{#if data.image}
					{#await preload(data.image) then _}
						<img
							src={data.image}
							alt={data.key}
							class="image"
							in:blur={{ duration: 2000 }}
						/>
					{/await}
				{/if}
			</div>
			<div class="col-6 centered data-container">
				{#if data.title}
					<h2>{data.title}</h2>
				{/if}
				{#if data.subtitle}
					<h4>{data.subtitle}</h4>
				{/if}
				{#if data.date}
					<h3>{data.date}</h3>
				{/if}
				{#if data.note}
					<p class="note">{data.note}</p>
				{/if}
			</div>
		</div>
		{#if data.roles}
			<div class="roles">
				{#each data.roles as role}
					<p>{role}</p>
				{/each}
			</div>
		{/if}
		{#if data.description}
			<p>{data.description}</p>
		{/if}
		{#if data.link && data.alias}
			<a href={data.link}>{goto} <span>{data.alias}</span></a>
		{/if}
	</div>
</div>

<style>
	.container {
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		padding: 20px;
	}
	.title-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
	.data-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.container h2 {
		font-size: 1.6rem;
		text-align: center;
		text-transform: uppercase;
	}
	.container p {
		text-align: justify;
		margin-top: 10px;
	}
	.container .note {
		align-self: center;
		color: var(--red);
	}
	.data-container h3 {
		font-size: 1.3rem;
		opacity: 0.4;
		text-align: center;
	}
	.data-container h3::after {
		content: "] •";
		padding: 5px;
	}
	.data-container h3::before {
		content: "• [";
		padding: 5px;
	}
	.data-container h4 {
		font-size: 1rem;
		opacity: 0.4;
		text-align: center;
	}
	.image {
		height: 200px;
		width: 200px;
		object-fit: contain;
		align-self: center;
	}
	.container a {
		color: var(--primary-light);
		text-decoration: none;
		align-self: flex-end;
		margin-top: 10px;
	}
	.container a span {
		text-transform: capitalize;
		font-size: 1.4rem;
	}
	.roles {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		color: var(--primary-light);
		flex-wrap: wrap;
	}
	.roles p::before {
		content: "#";
		display: inline-block;
	}
	@media only screen and (min-width: 768px) {
		.image {
			height: 350px;
			width: 350px;
		}
		.title-container {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;
		}
		.container h2 {
			font-size: 2.5rem;
			text-align: center;
		}
	}
</style>

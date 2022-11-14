<script>
	import { fade, fly, slide } from "svelte/transition";
	import ImageCard from "../components/ImageCard.svelte";
	import ImageGroupCard from "../components/ImageGroupCard.svelte";
	import EN from "../lang/EN_more.json";
	import ES from "../lang/ES_more.json";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { gallery, header, hobbies, interests } = lang;
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1>{header}</h1>
	<div class="container">
		<div class="title-container">
			{#if hobbies.header}
				<h2>
					{hobbies.header}
				</h2>
			{/if}
			{#if hobbies.subtitle}
				<h4>{hobbies.subtitle}</h4>
			{/if}
			{#if hobbies.description}
				<p>{hobbies.description}</p>
			{/if}
			<div class="data-container">
				{#if hobbies.data}
					<ul>
						{#each hobbies.data as hobbie}
							<li>{hobbie}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
		<div class="title-container">
			{#if interests.header}
				<h2>
					{interests.header}
				</h2>
			{/if}
			{#if interests.subtitle}
				<h4>{interests.subtitle}</h4>
			{/if}
			{#if interests.description}
				<p>{interests.description}</p>
			{/if}
			<div class="data-container">
				{#if interests.data}
					<ul>
						{#each interests.data as interest}
							<li>{interest}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
		<div class="title-container">
			{#if gallery.header}
				<h2>
					{gallery.header}
				</h2>
			{/if}
			{#if gallery.subtitle}
				<h4>{gallery.subtitle}</h4>
			{/if}
			{#if gallery.description}
				<p>{gallery.description}</p>
			{/if}
		</div>
		<div class="image-container">
			{#each gallery.images as image}
				{#if typeof image === typeof ""}
					<ImageCard {image} />
				{:else if typeof image === typeof []}
					<ImageGroupCard group={image} />
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: center;
		row-gap: 20px;
		column-gap: 20px;
	}
	.title-container h2 {
		font-size: 2rem;
		text-align: center;
		font-weight: bold;
	}
	.title-container h4 {
		font-size: 1rem;
		opacity: 0.4;
		text-align: center;
	}
	.title-container p {
		margin-top: 10px;
		text-align: justify;
	}
	.image-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: start;
		row-gap: 0px;
		column-gap: 0px;
	}
	.data-container {
		padding: 10px 20px;
		padding-left: 30px;
	}
	.data-container li {
		list-style: square;
		list-style-position: outside;
		opacity: 0.5;
		font-size: 1.2rem;
		text-transform: capitalize;
		text-align: justify;
	}

	@media only screen and (min-width: 768px) {
		.title-container h2 {
			font-size: 2rem;
			text-align: start;
			font-weight: bold;
		}
		.title-container h4 {
			font-size: 1rem;
			opacity: 0.4;
			text-align: start;
		}
		.data-container li {
			list-style: square;
			opacity: 0.5;
			font-size: 1.3rem;
			text-transform: capitalize;
			width: 40%;
			margin-left: 20px;
			float: left;
		}
	}
</style>

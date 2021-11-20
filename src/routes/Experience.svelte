<script>
	import { fade } from "svelte/transition";
	import Card from "../components/ExperienceCard.svelte";
	import EN from "../lang/EN_experience.json";
	import ES from "../lang/ES_experience.json";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { data, main, header, goto, description, ctools } = lang;
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1>{header}</h1>
	<div class="description">
		<h2>
			{#if lang === ES}
				Acerca de Ciberseguridad
			{:else}
				About Cybersecurity
			{/if}
		</h2>
		{#each description as paragraph, i}
			<p>{paragraph}</p>
		{/each}
		<div class="data-container">
			<ul>
				{#each ctools as tool, i}
					<li>{tool}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="divider" />
	<div class="container">
		{#each data as data (data.key)}
			<Card {data} {goto} />
		{/each}
	</div>
</div>

<style>
	.divider {
		width: 100%;
		background-color: var(--text);
		opacity: 0.1;
		margin: 10px 0px;
		height: 2px;
	}
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-bottom: 3rem;
	}
	.description {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: center;
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
	.description p {
		text-align: justify;
	}
	.data-conatiner ul {
		padding-left: 30px;
	}

	@media only screen and (min-width: 768px) {
		.main p {
			font-size: 2rem;
		}
		.description {
			display: flex;
			flex-direction: column;
			padding: 10px 50px;
		}
		.data-conatiner ul {
			padding-left: 40px;
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

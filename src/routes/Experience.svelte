<script>
	import { fade } from "svelte/transition";
	import Card from "../components/ExperienceCard.svelte";
	import EN from "../lang/EN_experience.json";
	import ES from "../lang/ES_experience.json";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { data, main, header, goto } = lang;
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1>{header}</h1>
	<div class="container">
		{#each data as data (data.key)}
			<Card {data} {goto} />
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-bottom: 3rem;
	}
	@media only screen and (min-width: 768px) {
		.main p {
			font-size: 2rem;
		}
	}
</style>

<script>
	import { fade, fly, slide } from "svelte/transition";
	import EN from "../lang/EN_skills.json";
	import ES from "../lang/ES_skills.json";
	import LangCard from "../components/LangCard.svelte";
	import ItemCard from "../components/ItemCard.svelte";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { plangs, langs, frameworks, tools, technologies, titles, header } =
		lang;
</script>

<div class="fscreen" in:fade={{ duration: 3000 }}>
	<h1>{header}</h1>
	<div class="container">
		<h2>{titles["languages"]}</h2>
		<div class="langs">
			{#each langs as lang, index}
				<LangCard {lang} />
			{/each}
		</div>
		<h2>{titles["programming"]}</h2>
		<div class="items">
			{#each plangs as item, index}
				<ItemCard {item} />
			{/each}
		</div>
		<h2>{titles["technologies"]}</h2>
		<div class="items">
			{#each technologies as item, index}
				<ItemCard {item} />
			{/each}
		</div>
		<h2>{titles["tools"]}</h2>
		<div class="items">
			{#each tools as item, index}
				<ItemCard {item} />
			{/each}
		</div>
		<h2>{titles["frameworks"]}</h2>
		<div class="items">
			{#each frameworks as item, index}
				<ItemCard {item} />
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
	.container h2 {
		font-size: 2rem;
		text-align: center;
		font-weight: bold;
	}
	.langs {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		row-gap: 20px;
		column-gap: 20px;
		margin-bottom: 40px;
		width: 100%;
	}
	.items {
		display: flex;
		flex-direction: row;
		margin-bottom: 40px;
		flex-wrap: wrap;
		overflow: auto;
		width: 100%;
		justify-content: space-around;
	}
	@media only screen and (min-width: 768px) {
		.container h2 {
			text-align: start;
		}
	}
</style>

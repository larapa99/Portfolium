<script>
	import { fade, fly, slide } from "svelte/transition";
	import DemoCard from "../components/DemoCard.svelte";
	import EN from "../lang/EN_demo.json";
	import ES from "../lang/ES_demo.json";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { demos, main, header, repository } = lang;
	let _demo = lang.try;
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1>{header}</h1>
	<div class="container">
		<div class="demos">
			{#each demos as demo}
				<DemoCard {repository} demo={_demo} data={demo} />
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
	.demos {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		row-gap: 20px;
		column-gap: 20px;
		margin-bottom: 40px;
		width: 100%;
	}

	@media only screen and (min-width: 768px) {
		.container h2 {
			text-align: start;
		}
		.demos {
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;
			row-gap: 20px;
			column-gap: 20px;
			margin-bottom: 40px;
			width: 100%;
		}
	}
</style>

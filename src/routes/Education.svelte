<script>
	import { fade } from "svelte/transition";
	import Card from "../components/EducationCard.svelte";
	import EN from "../lang/EN_education.json";
	import ES from "../lang/ES_education.json";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { data, main, header, goto, by } = lang;
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1>{header}</h1>
	<div class="main centered">
		<p>
			<b>
				{main.degree}
			</b>
			{by}
			<b>
				{main.university}
			</b>
		</p>
	</div>
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
	.main {
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	.main::after {
		content: "• • •";
		display: inline-block;
		opacity: 0.5;
	}
	.main p {
		text-align: center;
	}
	.main b {
		color: var(--primary-light);
	}
	@media only screen and (min-width: 768px) {
		.main p {
			font-size: 2rem;
		}
	}
</style>

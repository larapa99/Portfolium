<script>
	import { Router, Link, Route } from "svelte-navigator";
	import Info from "./routes/Info.svelte";
	import Skills from "./routes/Skills.svelte";
	import Education from "./routes/Education.svelte";
	import Experience from "./routes/Experience.svelte";
	import Demos from "./routes/Demos.svelte";
	import More from "./routes/More.svelte";
	import { onMount } from "svelte";
	import EN from "./lang/EN_index.json";
	import ES from "./lang/ES_index.json";

	let _lang = "EN";
	onMount(() => {
		try {
			let lang = localStorage.getItem("LANG");
			_lang = lang;
			if (!lang) throw "no-data";
		} catch (error) {
			localStorage.setItem("LANG", "EN");
			_lang = "EN";
		}
	});
	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { info, education, experience, skills, more, demos, footer } = lang;

	function reload() {
		try {
			let lang = localStorage.getItem("LANG");
			if (!lang) throw "no-data";
			if (lang === "EN") localStorage.setItem("LANG", "ES");
			else localStorage.setItem("LANG", "EN");
		} catch (error) {
			localStorage.setItem("LANG", "EN");
		}
		window.location.reload();
	}
</script>

<Router>
	<nav id="menu-nav">
		<ul id="menu-list">
			<li class="menu-item" id="menu-info">
				<Link to="/">{info}</Link>
			</li>
			<li class="menu-item" id="menu-education">
				<Link to="/education">{education}</Link>
			</li>
			<li class="menu-item" id="menu-experience">
				<Link to="/experience">{experience}</Link>
			</li>
			<li class="menu-item" id="menu-skill">
				<Link to="/skill">{skills}</Link>
			</li>
			<li class="menu-item" id="menu-more">
				<Link to="/demos">{demos}</Link>
			</li>
			<li class="menu-item" id="menu-more">
				<Link to="/more">{more}</Link>
			</li>
			<li class="menu-item" id="menu-more">
				<button on:click={reload}>{_lang === "EN" ? "ES" : "EN"}</button
				>
			</li>
		</ul>
	</nav>

	<main>
		<Route path="/">
			<Info />
		</Route>
		<Route path="/education">
			<Education />
		</Route>
		<Route path="/experience">
			<Experience />
		</Route>
		<Route path="/skill">
			<Skills />
		</Route>
		<Route path="/demos">
			<Demos />
		</Route>
		<Route path="/more">
			<More />
		</Route>
	</main>
</Router>

<footer>
	<div class="raccoon-solutions">
		<img src="/images/Raccoon_white.png" alt="raccoon" />
		<h2>drky@raccoonsolutions.net</h2>
	</div>
	<div class="beta">
		{footer.beta}
	</div>
</footer>

<style>
	footer {
		position: relative;
		margin-top: 20px;
		background-color: var(--primary);
		color: var(--white);
		padding: 40px;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	footer .beta {
		align-self: center;
		text-align: center;
		margin-top: 20px;
		opacity: 0.5;
		text-transform: uppercase;
	}
	.raccoon-solutions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		align-items: center;
	}
	.raccoon-solutions h2 {
		font-family: "IBM Plex Mono", monospace;
		font-size: 0.8rem;
		margin-top: 10px;
	}
	.raccoon-solutions img {
		width: 50%;
		height: auto;
		object-fit: cover;
	}
	@media only screen and (min-width: 768px) {
		.raccoon-solutions img {
			width: 50%;
			max-width: 200px;
			height: auto;
			object-fit: cover;
		}
		.raccoon-solutions h2 {
			font-size: 1rem;
		}
	}
</style>

<script>
	import EN from "../lang/EN_info.json";
	import ES from "../lang/ES_info.json";
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";
	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let {
		nickname,
		degree,
		name,
		specialization,
		description,
		header,
		download,
		legend,
	} = lang;

	const photo = "/images/photo.jpg";
</script>

<div class="fscreen" in:fade={{ duration: 2000 }}>
	<h1 class="no-point">{header}</h1>
	<div class="container">
		<div class="col-6 centered preloading">
			{#await preload(photo) then _}
				<img
					src={photo}
					alt="DRKY"
					class="photo"
					in:blur={{ duration: 2000 }}
				/>
			{/await}
		</div>
		<div class="col-6 body">
			<h2 id="name">{name}</h2>
			<h3 id="degree">{degree}</h3>
			<h4 id="specialization">{specialization}</h4>
			{#each description as pharagraph}
				<p class="description">{pharagraph}</p>
			{/each}
			<a id="download" href="/cv.pdf">{download}</a>
			<span id="download-legend">{legend}</span>
			<div id="social-media">
				<a href="mailto:drky@raccoonsolutions.net" id="to-mail">
					<i class="fas fa-envelope  fa-xs" />
				</a>
				<a href="https://github.com/DRKY99" id="to-github">
					<i class="fab fa-github fa-xs " />
				</a>
				<a href="https://www.linkedin.com/in/drky/" id="to-linkedin">
					<i class="fab fa-linkedin fa-xs" />
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	#download {
		padding: 10px;
		margin: 10px;
		margin-top: 30px;
		border-width: 2px;
		font-size: 1.5rem;
		border-radius: 10px;
		cursor: pointer;
		width: 100%;
		border-style: solid;
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		transition: all 0.3s ease-in-out 0.1s;
		color: var(--white);
		border-color: var(--background);
		background-color: var(--primary-light);
	}
	#download:hover {
		transition: all 0.3s ease-in-out 0.1s;
		color: var(--primary-light);
		border-color: var(--primary-light);
		background-color: transparent;
	}
	#download-legend {
		text-align: center;
		font-size: 0.8rem;
		opacity: 0.5;
	}
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-bottom: 3rem;
	}

	.body {
		display: flex;
		justify-content: center;
		align-content: center;
		flex-direction: column;
		margin-top: 10px;
	}

	.body h2 {
		color: var(--primary-light);
	}

	#social-media {
		display: flex;
		flex-direction: row;
		font-size: 5rem;
		justify-content: space-around;
	}
	#social-media a {
		color: var(--text);
		transition: all 0.3s ease-in-out 0.1s;
	}
	#to-linkedin :hover {
		color: #0e76a8;
		transition: all 0.3s ease-in-out 0.1s;
	}
	#to-mail :hover {
		color: #de5246;
		transition: all 0.3s ease-in-out 0.1s;
	}
	#to-github :hover {
		color: #6e5494;
		transition: all 0.3s ease-in-out 0.1s;
	}

	h2#name {
		font-size: 2rem;
		text-align: center;
	}
	h3#degree {
		font-size: 1.5rem;
		text-align: center;
		opacity: 80%;
	}
	h4#specialization {
		font-size: 1.1rem;
		text-align: center;
		opacity: 80%;
	}

	p.description {
		text-align: justify;
		margin-top: 10px;
	}

	.photo {
		height: 70vw;
		width: auto;
		border-radius: 5%;
		object-fit: cover;
		aspect-ratio: 1;
		align-self: center;
	}
	.preloading {
		min-height: 70vw;
	}
	@media only screen and (min-width: 768px) {
		.photo {
			max-height: 600px;
		}
		.preloading {
			min-height: 600px;
		}
		h2#name {
			font-size: 4rem;
		}
		#social-media {
			font-size: 8rem;
		}
		#download-legend {
			font-size: 1rem;
		}
		.body {
			margin-top: 0px;
		}
	}
</style>

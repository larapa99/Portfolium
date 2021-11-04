<script>
	import EN from "../lang/EN_info.json";
	import ES from "../lang/ES_info.json";
	import { fade, blur } from "svelte/transition";
	import { preload } from "../scripts/functions";

	let lang = localStorage.getItem("LANG");
	if (lang === "ES") lang = ES;
	else lang = EN;
	let { nickname, degree, name, specialization, description, header } = lang;

	const photo = "/images/photo.jpg";
</script>

{#await preload(photo) then _}
	<div class="fscreen" in:fade={{ duration: 2000 }}>
		<h1 class="no-point">{header}</h1>
		<div class="container">
			<div class="col-6 centered">
				<img
					src={photo}
					alt="DRKY"
					class="photo"
					in:blur={{ duration: 1000 }}
				/>
			</div>
			<div class="col-6 body">
				<h2 id="name">{name}</h2>
				<h3 id="degree">{degree}</h3>
				<h4 id="specialization">{specialization}</h4>
				{#each description as pharagraph}
					<p class="description">{pharagraph}</p>
				{/each}
				<div id="social-media">
					<a href="mailto:drkyofficial@gmail.com" id="to-google">
						<i class="fab fa-google" />
					</a>
					<a href="https://github.com/DRKY99" id="to-github">
						<i class="fab fa-github" />
					</a>
					<a
						href="https://www.linkedin.com/in/drky/"
						id="to-linkedin"
					>
						<i class="fab fa-linkedin" />
					</a>
				</div>
			</div>
		</div>
	</div>
{/await}

<style>
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
	}

	#social-media {
		margin-top: 3rem;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	#social-media .fab {
		font-size: 3rem;
	}
	#social-media a {
		color: var(--text);
		transition: all 0.3s ease-in-out 0.1s;
	}
	#to-linkedin :hover {
		color: #0e76a8;
		transition: all 0.3s ease-in-out 0.1s;
	}
	#to-google :hover {
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
		margin: 10px;
	}
	@media only screen and (min-width: 768px) {
		.photo {
			max-height: 500px;
		}
		h2#name {
			font-size: 4rem;
		}
		#social-media .fab {
			font-size: 5rem;
		}
	}
</style>

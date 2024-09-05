var ghpages = require("gh-pages");

ghpages.publish(
	"public", // path to public directory
	{
		branch: "gh-pages",
		repo: "https://github.com/larapa99/Portfolium.git", // Update to point to your repository
		user: {
			name: "Ariel Lara", // update to use your name
			email: "larapa99@gmail.com", // Update to use your email
		},
	},
	() => {
		console.log("Deploy Complete!");
	}
);

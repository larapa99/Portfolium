var ghpages = require("gh-pages");

ghpages.publish(
	"public", // path to public directory
	{
		branch: "gh-pages",
		repo: "https://github.com/DRKY99/Portfolium.git", // Update to point to your repository
		user: {
			name: "Ariel Lara", // update to use your name
			email: "drkyofficial@gmail.com", // Update to use your email
		},
	},
	() => {
		console.log("Deploy Complete!");
	}
);

import App from "./App.svelte";
require("dotenv").config();

const app = new App({
	target: document.body,
});

export default app;

import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	// TODO: changer pour https://heartbeatcountry.com/ après la remise finale:
	"site": "https://heartbeat.pages.dev",

	// on souhaite utiliser le mode SSR:
	"output": "server",

	adapter: node({
		mode: "standalone",
	}),

	server: {
		port: +process.env.PORT || 3000,
	},
});

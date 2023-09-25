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
		host: process.env.NODE_ENV === 'production' ? true : false,
		port: +process.env.PORT || 3000,
	},

	vite: {
		optimizeDeps: { exclude: ["@node-rs/argon2"] },
	}
});

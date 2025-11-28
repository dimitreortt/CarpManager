import { defineConfig } from "cypress"
import { config } from "./cypress/plugins"

export default defineConfig({
	e2e: {
		specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
		supportFile: "cypress/support/e2e.ts",
		setupNodeEvents: config,
		baseUrl: "https://fabic-gestao.web.app",
	},
})

describe("template spec", () => {
	let userEmail: string
	let userPassword: string
	let integrationUrl: string = "https://carpmanager-cypress-integration.web.app/"
	let appUrl: string = "https://fabic-gestao.web.app"

	before(() => {
		cy.task("getUserEmail").then((email) => {
			expect(email).to.be.a("string")
			userEmail = email as string
		})
		cy.task("getUserPassword").then((password) => {
			expect(password).to.be.a("string")
			userPassword = password as string
		})
	})

	it("sets up the test account", () => {
		cy.visit(integrationUrl)

		cy.get("input[name='email']").type("integration-test@test.com")
		cy.get("input[name='password']").type("**** **** **** ****")
		cy.get("button[type='submit']").click()
		cy.wait(3000)
		cy.get("div").should("contain.text", "Setup Complete. Go Ahead!")
	})

	it("registers the test account", () => {
		cy.visit(`${appUrl}/cadastro`)

		cy.get("input[name='name']").should("be.visible").type("Auth Integration Test User")
		cy.get("input[name='email']").type(userEmail)
		cy.get("input[name='password']").type(userPassword)
		cy.get("input[name='confirmPassword']").type(userPassword)
		cy.get("button[type='submit']").click()
		cy.wait(3000)
		cy.contains("Verifique seu e-mail")
		cy.contains("Enviamos um link de verificação para o seu e-mail. Por favor, clique no link para ativar sua conta e concluir o seu cadastro.")
	})

	it("receives the verification email and validates the account successfully", () => {
		cy.wait(5000)

		cy.task("getLastEmail")
			.its("html")
			.then((html) => {
				cy.document({ log: false }).invoke({ log: false }, "write", html)
			})
		cy.log("**email has the user name**")

		cy.get("a").click()

		cy.get("p").should("contain.text", "Verificando e-mail...")

		cy.get("h1").should("contain.text", "E-mail verificado com sucesso!")
		cy.get("p").should("contain.text", "Você será redirecionado para a página inicial em breve.")

		cy.wait(5000)
		cy.contains("Dashboard")
	})
})

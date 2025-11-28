import { firebaseAdmin } from "../firebase/firebase"
import { Database } from "../database/Database"
import { Router } from "../http/HttpServer"

export class CypressController {
	constructor(private readonly router: Router, database: Database) {
		this.router.post("/setup-auth-integration-test", async (req, res) => {
			const { email, password } = req.body

			if (email !== process.env.INTEGRATION_TEST_EMAIL) {
				return res.status(400).json({ message: "Hi" })
			}

			if (password !== "**** **** **** ****") {
				return res.status(400).json({ message: "Hi" })
			}

			try {
				const user = await firebaseAdmin.auth().getUserByEmail(process.env.MAIL_USER)
				await firebaseAdmin.auth().deleteUser(user.uid)
			} catch (error) {}

			return res.json("Setup Complete. Go Ahead!")
		})
	}
}

import imaps from "imap-simple"
import { simpleParser } from "mailparser"

const config = {
	imap: {
		user: "integration-test@test.com",
		password: "**** **** **** ****",
		host: "imap.gmail.com",
		port: 993,
		tls: true,
		tlsOptions: { rejectUnauthorized: false },
		authTimeout: 3000,
	},
}

export const getLastEmail = async () => {
	const connection = await imaps.connect(config)
	await connection.openBox("INBOX")

	const searchCriteria = ["UNSEEN"]
	const fetchOptions = { bodies: [""], markSeen: true }

	const messages = await connection.search(searchCriteria, fetchOptions)
	if (messages.length === 0) return null

	const raw = messages[messages.length - 1].parts[0].body
	const parsed = await simpleParser(raw)

	return {
		subject: parsed.subject,
		text: parsed.text,
		html: parsed.html,
		from: parsed.from?.text,
		to: parsed.to instanceof Array ? parsed.to[0]?.text : parsed.to?.text,
	}
}

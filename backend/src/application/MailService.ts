import nodemailer from "nodemailer"

export class MailService {
	static async sendMail(mailOptions: any) {
		return new Promise((resolve, reject) => {
			this.getTransporter().sendMail(mailOptions, function (error: any, info: any) {
				if (error) {
					reject(error)
				} else {
					resolve(info)
				}
			})
		})
	}

	static getTransporter() {
		return nodemailer.createTransport({
			service: "gmail",
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_SECRET_PASSWORD,
			},
		})
	}
}

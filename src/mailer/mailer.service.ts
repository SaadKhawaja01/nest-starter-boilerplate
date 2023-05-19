import { SMTPTransport, Transporter } from "nodemailer";

import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");

@Injectable()
export class MailerService {
  private transport: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4e2d0f31b63826",
        pass: "d55ef34fd61226",
      },
    });
  }

  send(emails: string[] = [], subject, body: string) {
    const projectName = JSON.parse(readFileSync("./package.json", "utf8")).name;
    emails = emails.length > 0 ? emails : ["ahsantariq1713@gmail.com"];
    return this.transport.sendMail({
      from: `${projectName} <support@example.com>`,
      to: emails.toString(),
      subject,
      text: body,
    });
  }
}

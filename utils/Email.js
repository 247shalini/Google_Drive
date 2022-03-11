const fs = require("fs");
const path = require("path");
const handlebar = require("handlebars");
const nodemailer = require("nodemailer");
const { Console } = require("console");

const AVAILABLE_TEMPLATES = {
  REQUEST: "emailtemplates",
};

class Email {
  constructor(template = "") {
    this.body = "";
    this.subject = "";
    this.cc = [];
    if (template) {
      this.setTemplate(template);
    }
  }

  setTemplate(template) {
    if (!Object.values(AVAILABLE_TEMPLATES).includes(template)) {
      throw new Error("Invalid template");
    }

    this.template = template;
    switch (template) {
      case AVAILABLE_TEMPLATES.REQUEST:
        this.subject = "Welcome to our website";
        break;

      default:
        break;
    }
  }

  setBody(data) {
    if (!this.template) {
      throw new Error("Template not set");
    }
    const fileBody = fs
      .readFileSync(
        path.join(__dirname, "..", `views/templates/${this.template}.hbs`)
      )
      .toString();

    const template = handlebar.compile(fileBody);

    this.body = template(data);
  }

  setRawBody(body) {
    this.body = body;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setCC(email) {
    this.cc = email;
  }

  async send(email) {
    if (!email) {
      throw new Error("Email not set");
    }
    if (!this.body || !this.subject) {
      throw new Error("Body or subject not set");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Google-Drive" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Welcome to our website",
      html: this.body,
    });

    return info;
  }

  static sendEmail(template, data, email, cc = []) {
    const emailClient = new Email(template);
    emailClient.setBody(data);
    emailClient.setCC(cc);
    return emailClient.send(email);
  }
}

module.exports = {
  Email,
  AVAILABLE_TEMPLATES,
};
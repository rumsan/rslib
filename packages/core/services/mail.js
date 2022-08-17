const fs = require("fs");
const path = require("path");
var EventEmitter = require("events");

const { loadNodeModule } = require("../utils/core");
class MailService extends EventEmitter {
  constructor(options) {
    super();
    if (options) {
      this.setConfig(options);
      if (options.listeners) this.addListeners(options.listeners);
    }
  }

  setConfig(options) {
    if (!options?.transporter)
      throw new Error("Must send nodemailer transporter.");

    this.options = options;
  }

  getHtmlBody(template, data) {
    if (!template?.html) throw new Error("Template must have html.");
    const handlebars = loadNodeModule("handlebars");
    const templatePath = path.resolve(template.html);
    const text = fs.readFileSync(templatePath, { encoding: "utf-8" });
    const hTemplate = handlebars.compile(text);
    return hTemplate(data);
  }

  addListeners(listeners) {
    let event = Object.keys(listeners);
    event.forEach((e) => {
      this.on(e, listeners[e]);
    });
  }

  send({ to, subject, html, from, template, data }) {
    if (!this.options)
      throw new Error("Options not set. Please call setOptions once.");
    if (this.options?.disableEmail) {
      console.log(
        "Email service has been disabled from configuration. Please remove disableEmail config."
      );
      return;
    }

    const nodemailer = loadNodeModule("nodemailer");
    this.transporter = nodemailer.createTransport(options.transporter);

    if (template) html = this.getHtmlBody(template, data);

    subject =
      subject ||
      template?.subject ||
      this.options.defaultSubject ||
      "[NO SUBJECT]";
    from = from || template?.from || this.options.from || null;

    return this.transporter
      .sendMail({
        from,
        subject,
        to,
        html,
      })
      .then((response) => {
        this.emit("mail-sent", response);
        this.transporter.close();
      })
      .catch((err) => this.emit("mail-error", err.message));
  }
}

module.exports = new MailService();

const Transport = require("../Transport");
const { MailService } = require("@rumsan/core/services");

const requiredOptions = ["from", "mailTransport"];

module.exports = class ConsoleTransport extends Transport {
  constructor(options = {}) {
    super(options, requiredOptions);
    MailService.setConfig({
      from: this.options.from,
      transporter: this.options.mailTransport,
      disableEmail: this.options.disabled || false,
      defaultSubject: this.options.subject || "SMS Received",
    });
    this.options.toDomain = this.options.toDomain || "mailinator.com";
  }

  async send(phone, message) {
    return MailService.send({
      to: `${phone}@${this.options.toDomain}`,
      html: message,
    })
      .then((data) => {
        return { success: true, data };
      })
      .catch((error) => {
        return { success: false, message: error.message, error };
      });
  }
};

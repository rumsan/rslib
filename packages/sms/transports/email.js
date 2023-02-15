const Transport = require('../Transport');
const { MailService } = require('@rumsan/core/services');

const requiredOptions = ['from', 'transport'];

module.exports = class EmailTransport extends Transport {
  constructor(options = {}) {
    super(options, requiredOptions);
    if (typeof this.options.transport === 'string')
      this.options.transport = JSON.parse(this.options.transport);
    MailService.setConfig({
      from: this.options.from,
      transporter: this.options.transport,
      disableEmail: this.options.disabled || false,
      defaultSubject: this.options.subject || 'SMS Received',
    });
    this.options.toDomain = this.options.toDomain || 'mailinator.com';
  }

  async send(phone, message) {
    if (phone.indexOf('@') === -1) phone = `${phone}@${this.options.toDomain}`;

    return MailService.send({
      to: phone,
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

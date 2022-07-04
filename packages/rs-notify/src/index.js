class Notify {
  constructor({ notices = {} }) {
    this.notices = notices;
    if (!this.notices.default)
      this.notices.default = { carrier: "email", template: "" };
  }
}

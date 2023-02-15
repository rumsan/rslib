module.exports = {
  replacePlaceholders(message, values) {
    if (!message) return message;
    let newMessage = message;
    Object.keys(values).forEach((key) => {
      newMessage = newMessage.replace(`{{${key}}}`, values[key]);
    });
    return newMessage;
  },

  randomText(length) {
    let text = '';
    for (let i = 0; i < length; i++) {
      let random = Math.floor(Math.random() * 3);
      if (random == 0) {
        text += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      } else if (random == 1) {
        text += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      } else {
        text += Math.floor(Math.random() * 10);
      }
    }
    return text;
  },
};

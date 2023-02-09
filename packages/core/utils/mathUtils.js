module.exports = {
  randomNumber(length) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
  },

  randomText(length) {
    let text = "";
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

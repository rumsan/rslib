const PinService = require('../PinService');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const requiredOptions = ['sheetId', 'sheetName', 'googleCreds', 'addressField'];

module.exports = class GSheetService extends PinService {
  constructor(options = {}) {
    super(options, requiredOptions);
  }

  async getPin(id, callback) {
    this._checkId(id);
    const { sheetId, sheetName, googleCreds } = this.options;

    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(googleCreds);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    const rows = await sheet.getRows();
    const row = rows.find((d) => d.id.toUpperCase() === id.toUpperCase());
    if (!row) return { success: true, message: 'id does not exists' };
    if (callback) callback(row);
    return { success: true, deliveryAddress: row[this.options.addressField], pin: row.pin, row };
  }
};

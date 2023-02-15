const PinService = require('../PinService');
const { getValueByPath } = require('@rumsan/core/utils/objectUtils');

const requiredOptions = ['url', 'pinFieldMap', 'addressFieldMap'];

module.exports = class WebhookService extends PinService {
  constructor(options = {}) {
    super(options, requiredOptions);
  }

  async getPin(id, callback) {
    this._checkId(id);
    const { url, pinFieldMap, addressFieldMap, headers } = this.options;
    const axiosOpts = {};
    if (headers) axiosOpts.headers = headers;
    return axios
      .post(`${url}`, payload, axiosOpts)
      .then((res) => {
        const pin = getValueByPath(res.data, pinFieldMap);
        const deliveryAddress = getValueByPath(res.data, addressFieldMap);
        if (!pin) return { success: false, message: 'pin not found' };
        return { success: true, pin, data: res.data };
      })
      .catch((error) => {
        return { success: false, message: error.message, error };
      });
  }
};

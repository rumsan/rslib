module.exports = {
  convertToJson(data) {
    data = JSON.stringify(data);
    return JSON.parse(data);
  },

  addCreator(payload = {}, options = {}) {
    if (!options.currentUser) throw ERR.CURUSER_REQ;
    payload.created_by = ObjectId(options.currentUser);
    payload.updated_by = ObjectId(options.currentUser);
    return payload;
  },

  addUpdator(payload = {}, options = {}) {
    if (!options.currentUser) throw ERR.CURUSER_REQ;
    payload.updated_by = ObjectId(options.currentUser);
    return payload;
  },

  async paging({ table, data, order = [], where = {}, offset = 0, limit = 20 }) {
    const { count, rows } = data
      ? data
      : await table.findAndCountAll({
          order,
          limit,
          offset,
          where,
        });

    return {
      total: count,
      rows,
      limit,
      totalPages: Math.ceil(count / limit),
      page: Math.round(offset / limit) + 1,
      start: offset,
    };
  },

  pagingByData({ start = 0, limit = 20, data }) {
    const { count, rows } = data;
    return {
      total: count,
      data: rows,
      limit,
      totalPages: Math.ceil(count / limit),
      page: Math.round(start / limit) + 1,
      start,
    };
  },

  async updateOneWithEvent(record, eventName, caller) {
    const rec = await record;
    if (!rec) return rec;
    const [recCount, recs] = rec;
    if (recCount < 2) {
      const changedRec = recs?.[0];
      if (recCount > 0) caller.emit(eventName, changedRec?.get({ plain: true }));
      return changedRec;
    }
    return rec;
  },

  async createWithEvent(record, eventName, caller) {
    const rec = await record;
    if (!rec) return rec;
    caller.emit(eventName, rec.get({ plain: true }));
    return rec;
  },
};

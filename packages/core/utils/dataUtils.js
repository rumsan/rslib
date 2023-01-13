module.exports = {
  convertToJson(data) {
    data = JSON.stringify(data);
    return JSON.parse(data);
  },
  paging: async ({
    table,
    data,
    order = [],
    where = {},
    offset = 0,
    limit = 20,
  }) => {
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
};

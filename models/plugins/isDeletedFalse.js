module.exports = function isDeletedFalse(schema, options) {
  schema.pre(/^find/, function (next) {
    if (this._conditions["isDeleted"] === undefined)
      this._conditions["isDeleted"] = false;
    next();
  });
};

_.mixin({
  pickDeep: function (obj, key) {
    var keys = key.split('.'),
        i = 0,
        value = null,
        n = keys.length;

      while ((obj = obj[keys[i++]]) != null && i < n) {};
      value = i < n ? void 0 : obj;
      var result = {};
      result[key]=value;
      return result;
  }
});

_.mixin({
  pluckDeep: function (obj, key) {
    return _.map(obj, function (value) { return _.pickDeep(value, key); });
  }
});

CollectionBehaviours.define('trackable', function(behaviourOptions) {
  this.collection.before.update(_.bind(function (userId, oldDoc, fieldNames, modifier, options) {
    var behaviourOptionArray = _.isArray(behaviourOptions) ? behaviourOptions : new Array(behaviourOptions);
    _.each(behaviourOptionArray, _.bind(function(behaviourOptions) {
      behaviourOptions = _.defaults(behaviourOptions, this.options);

      var fieldName = behaviourOptions && behaviourOptions.fieldName || 'changes';
      fieldNames = _.union(modifier.$set && Object.keys(modifier.$set), modifier.$unset && Object.keys(modifier.$unset));
      fieldNames = _.map(_.compact(fieldNames), function(k){ return k.replace(/\b\d+\b/g, '$') });

      var includedFields = behaviourOptions && behaviourOptions.include ? behaviourOptions.include : fieldNames;
      var excludedFields = behaviourOptions && behaviourOptions.exclude ? behaviourOptions.exclude : [];

      var trackedFields = _.select(fieldNames, function(field){
        return _.any(includedFields, function(f){ return field.match(new RegExp('^' + f.replace(/\$/g, '\\$'))) });
      });
      trackedFields = _.reject(trackedFields, function(field){
        return _.any(excludedFields, function(f){ return field.match(new RegExp('^' + f)) });
      });

      if (! _.isEmpty(trackedFields) ) {
        var changes = _.reduce( Object.keys(modifier), function(memo, modifierKey) {
          var currentModifier = modifier[modifierKey];

          var modifierChanges = _.reduce(Object.keys(currentModifier), function(memo, k) {
            var preKey = k.scan(/^(?:(.*\.\d)+\.)?(.*)$/g)[0][0] || '';
            var postKey = k.scan(/^(?:(.*\.\d)+\.)?(.*)$/g)[0][1];

            var key = k.replace(/\b\d+\b/g, '$');
            var val = currentModifier[k];

            if (_.contains(trackedFields, key)) {
              // deepPick
              oldValue = _.reduce(k.split('.'), function(memo, field){
                return memo[field];
              }, oldDoc);

              if(!_.isEqual(oldValue, val) && !(isFalsey(oldValue) && isFalsey(val)) ) {
                change = {};
                change[preKey] = {};
                change[preKey][modifierKey.slice(1)] = {};

                change[preKey][modifierKey.slice(1)][postKey] = {
                  old: oldValue,
                  new: modifierKey === '$unset' ? null : val
                }

                change[preKey].changedAt = new Date();
                change[preKey].changedBy = userId;

                _.deepExtend(memo, change);
              }
            }
            return memo;
          }, {});

          return _.extend(memo, modifierChanges);
        }, {});

        if (!_.isEmpty(changes)) {
          if(!modifier.$push) modifier.$push = {};

          _.each(changes, function(v, k) {
            modifier.$push[ _.compact([ k, fieldName ]).join('.') ] = v;
          });
        }
      }
    }, this));
  }, this));
});

var isFalsey = function(val) {
  return !!val == false;
}

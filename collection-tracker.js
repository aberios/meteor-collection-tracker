CollectionBehaviours.define('trackable', function(options) {
  behaviourOptions = _.defaults(options, this.options);

  this.collection.before.update(function (userId, oldDoc, fieldNames, modifier, options) {
    var fieldName = behaviourOptions && behaviourOptions.fieldName || 'changes';
    var includedFields = behaviourOptions && behaviourOptions.include ? behaviourOptions.include : fieldNames;
    var excludedFields = behaviourOptions && behaviourOptions.exclude ? behaviourOptions.exclude : [];

    var trackedFields = _.difference( _.intersection(includedFields, fieldNames), excludedFields );

    if (! _.isEmpty(trackedFields) ) {
      var changes = _.reduce( Object.keys(modifier), function(memo, modifierKey) {
        var modifierChanges = _.compact(_.map(modifier[modifierKey], function(v, k) {
          var keys = k.split('.');

          if (_.contains(trackedFields, keys[0])) {
            oldValue = _.reduce(keys, function(memo, field){
              return memo[field];
            }, oldDoc);

            if(!_.isEqual(oldValue, v) && !(isFalsey(oldValue) && isFalsey(v)) ) {
              change = {};

              change[k] = {
                old: oldValue,
                new: v
              }

              return _.deepFromFlat(change);
            }
          }
        }));

        if (!_.isEmpty(modifierChanges)) {
          memo[modifierKey.slice(1)] = modifierChanges;
        }

        return memo;
      }, {});


      if (!_.isEmpty(changes)) {
        var track = { 
          changedAt: new Date(),
          changedBy: userId
        };

        _.extend(track, changes)

        if(!modifier.$push) {
          modifier.$push = {};
        }

        modifier.$push[ fieldName ] = track;
      }
    }
  });
});

var isFalsey = function(val) {
  return !!val == false;
}

CollectionBehaviours.defineBehaviour('trackable', function(getTransform, args) {
  this.before.update(function (userId, oldDoc, fieldNames, modifier, options) {
    var options = args[0];

    var fieldName = options && options.fieldName || 'tracked';
    var includedFields = options && options.include ? options.include : fieldNames;
    var excludedFields = options && options.exclude ? options.exclude : [];

    var trackedFields = _.difference( _.intersection(includedFields, fieldNames), excludedFields );

    if (! _.isEmpty(trackedFields) ) {
      var changes = _.reduce( Object.keys(modifier), function(memo, modifierKey) {
        var modifierChanges = _.compact(_.map(modifier[modifierKey], function(v, k) {
          var keys = k.split('.');

          if (_.contains(trackedFields, keys[0])) {
            oldValue = _.reduce(keys, function(memo, field){
              return memo[field];
            }, oldDoc);

            if(!_.isEqual(oldValue, v) && !isFalsey(oldValue) && !isFalsey(v) ) {
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
        var track = { changedAt: new Date() };

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

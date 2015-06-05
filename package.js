Package.describe({
  name: 'meteorblackbelt:collection-tracker',
  version: '0.0.4',
  summary: 'Extends Mongo.Collection with tracking of changes to documents',
  git: 'https://github.com/meteorblackbelt/meteor-collection-tracker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'mongo',
    'underscore',
    'meteorblackbelt:underscore-deep@0.0.3',
    'zimme:collection-behaviours@1.0.4'
  ]);

  api.imply('zimme:collection-behaviours');

  api.addFiles('collection-tracker.js');
});

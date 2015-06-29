# Tracking for collections

Add tracking to collections.

### Install
```sh
meteor add meteorblackbelt:collection-tracker
```

### Usage

Basic usage examples.

#### Attach

```js
Posts = new Mongo.Collection('posts');

//Attach behaviour with the default options
Posts.attachBehaviour('trackable');
// or
CollectionBehaviours.attach(Posts, 'trackable');

//Attach behaviour with custom options
Posts.attachBehaviour('trackable', {
  fieldName: 'postChanges',
  include: ['name']
});
// or
CollectionBehaviours.attach(Posts, 'trackable', {
    include: ['name']
});

CollectionBehaviours.attach(Posts, 'trackable', {
    exclude: ['search']
});
```

### Multiple trackers

More than one tracker can be defined on the same collection by passing
an array of options as follows

```
Posts.attachBehaviour('trackable', [
  {
    include: ['name']
  },
  {
    fieldName: 'commentChanges',
    include: ['comments']
  }
]);
```

### Options

The following options can be used:

* `include`: array of fields to include (default is all)

* `exclude`: array of fields to exclude (default is none)

* `fieldName`: name of field that changes are tracked under (default is 'changes')

### Global options

```js
CollectionBehaviours.configure('trackable', {
  include: ['createdAt']
});

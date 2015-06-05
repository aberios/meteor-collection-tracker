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

### Options

The following options can be used:

* `include`: array of fields to include (default is all)

* `exclude`: array of fields to exclude (default is none)

### Global options

```js
CollectionBehaviours.configure('trackable', {
  include: ['createdAt']
});

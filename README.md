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
Posts.trackable();

//Attach behaviour with custom options
Posts.trackable({ include: [ 'name' ]});

Posts.trackable({ exclude: [ 'updatedAt' ]});
```

### Options

The following options can be used:

* `include`: array of fields to include (default is all)

* `exclude`: array of fields to exclude (default is none)


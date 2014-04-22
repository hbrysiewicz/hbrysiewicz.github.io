---
layout:   post
title:    "Ember.js Ace Editor Component"
description: "Ember.js Ace Editor component"
comments: true
date:     2014-04-22 16:26
tags:     [emberjs, components, ace]
---

A few weeks ago there was a need to interface directly with raw json from the server. I immediately jumped on the chance to make an [Ace Editor](http://ace.c9.io/) component for Ember.js. I have been wanting to work with Ace for a while now and as expeted, getting setup with it was smooth much like integrating it with an Ember.Component.

<br>
<a class="jsbin-embed" href="http://emberjs.jsbin.com/lizez/8/embed?output">Ember.js Ace Editor Component</a><script src="http://static.jsbin.com/js/embed.js"></script>
<br><br>

## The Component
<br>
Similar to the [Summernote Wysiwyg Ember.js Component]({{ post_url }}/2014-04-18-summernote-ember-wysiwyg.html) I discussed earlier in the week this component wraps a simple `<pre>` tag and transforms it into an Ace Editor. The data is fully bound which makes previews just work.

For my simple example I did not use data from an [Ember.Model](https://github.com/ebryn/ember-model) but I did in the actual application I originally created. It is possible to take this simple example and run with it, using model data to back the content.

Most of what happens in `didInsertElement` is setup for the Ace Editor. The important line that works the binding magic is the editor's `on('change'...` event. Inside of this event is where the content is notified that it has changed.

The `content` attribute of the component is setup to get/set the content of the editor. There is a check in the beginning to ensure the editor has been initialized. If it hasn't yet, `content` data is stored in `preset` and used in `didInsertElement` after initialization.

## The Controller
<br>
Most of the logic in the Controller would be in the `Ember.Model` if using a model library to back the editor. In the controller, `rawData` is setup to return the string value of `data`, prettified for the editor.

The key is to ensure that `data` is only set when a proper JSON object is passed in as the `val`.

<br>
<a class="jsbin-embed" href="http://emberjs.jsbin.com/lizez/8/embed?js">Ember.js Ace Editor Component</a><script src="http://static.jsbin.com/js/embed.js"></script>
<br><br>

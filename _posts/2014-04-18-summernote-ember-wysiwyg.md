---
layout:   post
title:    "Ember.js Wysiwyg Component with Summernote"
description: "Ember.js wysiwyg component using summernote editor"
comments: true
date:     2014-04-18 10:25
tags:     [emberjs, components]
---

<div class='warning'>
<strong>Warning:</strong> This was created with older versions of Ember.js and is likely no longer relevant. Please tread lightly when referencing this article.
</div>

Users love wysiwyg editors. [Summernote](http://hackerwins.github.io/summernote/) has been my favorite to work with as a developer yet. Getting it hooked up as an Ember component was simple and fun, and the end result was rather nice.

<a class="jsbin-embed" href="http://emberjs.jsbin.com/sofum/13/embed?output">Ember Wysiwyg Component</a><script src="http://static.jsbin.com/js/embed.js"></script>

# The Component

All this does is wrap the basic [Ember.TextArea](http://emberjs.com/api/classes/Ember.TextArea.html). This example is rather bare to keep things simple but depending on the use-case the component and its logic could expand quite a bit. For example, when hooking up 'Insert Image' functionality.

I normally prefer to steer clear of using jQuery libraries in Ember. They cause a lot of overhead, don't often play nice, and can _generally_ be acheived in a few lines of code with Ember itself. However, a Wysiwyg editor is a bit of a beefy task.

I tried to keep the events on the component itself rather than using the provided Summernote callback methods. Summernote did not provide a way to watch changes initiated within the toolbar, but I was able to acheive this with the click event on the component.

The `btnSize` and `height` are bound attributes so that they can be passed in on component creation. Summernote populates a new element with the `content` so the udpating of preview has to be done a bit by hand as can be seen in the `keyUp` and `click` events.

<a class="jsbin-embed" href="http://emberjs.jsbin.com/sofum/13/embed?js">Ember Wysiwyg Component</a><script src="http://static.jsbin.com/js/embed.js"></script>


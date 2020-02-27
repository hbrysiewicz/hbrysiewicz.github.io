---
layout:   post
title:    "Ember.js Color Picker - Spectrum.js, HEX and RGB"
descirption: "Ember.js color picker using spectrum.js to bind picker, hex, and rgb"
comments: true
date:     2014-04-16 09:29:10
tags:     [emberjs, components]
---

<div class='warning'>
<strong>Warning:</strong> This was created with older versions of Ember.js and is likely no longer relevant. Please tread lightly when referencing this article.
</div>


I realized this week I have 'officially' been paid to make Ember.js apps for 13 months now. That is a long time considering the infancy of Ember.js. One of the first things I did that was fun and exciting was making a color picker, using Spectrum, that kept the hex, rgb, and color-picker in sync.


### The Template

Inside of the component template there is a div to represent the color picker with the `style` attribute bound. This is so that the `background-color` can be changed when the color changes.

There is also the hex input with the `value` bound to the hex representation of the color. Similar for the rgb inputs, except each one is bound to a different computed property for each r, g, b.


<a class="jsbin-embed" href="http://emberjs.jsbin.com/geyit/10/embed?html">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>


### The Component

In the `didInsertElement` the spectrum element is initialized. Since I am using a custom picker element I don't want the input or the button that Spectrum.js normally displays. This is turned off with the `showInput` and `showButtons` options.

The important part is the `change` option, a function that will be called every time the color is changed from within spectrum.

There are other events that could be used in place of change, such as `move` if you wanted to change the background as the user was moving inside the picker.

When any of the rgb inputs is changed, the `color` has to be updated. This is where the `watchRgb` observer comes in. The new hex value is calculated from the changed rgb values and `color` is updated.

Since `color` is being stored as the string html hex representation nothing too complicated happens inside the `hexValue` computed property but it does give a good example of how to do a computed property with both a set and get.


<a class="jsbin-embed" href="http://emberjs.jsbin.com/geyit/10/embed?js">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>


### Final Product


<a class="jsbin-embed" href="http://emberjs.jsbin.com/geyit/10/embed?output">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>

---
layout:   post
title:    "Ember.js Image-Zoom and Preview Components"
description: "Creating two components that interact with eachother to provide
an image preview and zoomed-in preview."
comments: true
date:     2014-06-11 00:00
tags:     [emberjs, components, image, ui]
---

<div class='warning'>
<strong>Warning:</strong> This was created with older versions of Ember.js and is likely no longer relevant. Please tread lightly when referencing this article.
</div>

Recently I was tasked in creating a large photo plotting tool. Part of this was the ability to preview a zoomed in portion of the full image to ensure the plotted point was in an accurate position.

There are two components I'll be talking about here that are using data bound in the controller between the both of them. One is the full-image preview and the other the zoomed-image preview.

# The Component Templates

...Are pretty straightforward. The high res image is displayed with a fixed height and width. In this example, I've made it 1/2 the size of the original. The `mouseX` and the `mouseY` coordinates are passed into the `ImagePreviewComponent` along with the image src. The mouse coordinates will allow the zoom to properly display at an accurate position.

`ImageZoomComponent` also gets `mouseX` and `mouseY` for the scaled coordinates, as well as the image source for the background.

When creating this there was actually a need for a boundary on the image so points could not be plotted on the edges, but I removed it for this example to keep it simple. It just adds more math to some of the calculations.


<a class="jsbin-embed" href="http://emberjs.jsbin.com/puhul/16/embed?html">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>


# The Component Code

The controller is going to keep the original source of `mouseX` and `mouseY`. These will be passed into both of the components.

As the mouse moves within the `ImagePreviewComponent` the actual offset is calculated. This is done because it is likely not the first thing on the page and the `clientX` and `clientY` returned on the mouseMove event are within the document and not the element itself. By finding out the elements offset within the document the true `x` and `y` within the scaled image can be calculated.

The `ImageZoomComponent` uses `background-image` and `background-position` on the full-size high res photo to display only the desired portion in the zoom preview box. The idea here is as the `mouseX` and `mouseY` values change scale them up, in this case double themselves, and then center them within the image zoom container. I made the container 316px by 246px so I subtract 1/2 of those values from their respective coordinate. Then, the background position can be set correctly.


<a class="jsbin-embed" href="http://emberjs.jsbin.com/puhul/16/embed?js">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>


# Live Demo

Here is the live demo from above code. If you like, please leave a comment!


<a class="jsbin-embed" href="http://emberjs.jsbin.com/puhul/16/embed?output">Ember Starter Kit</a><script src="http://static.jsbin.com/js/embed.js"></script>


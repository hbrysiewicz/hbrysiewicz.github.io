---
layout: post
title: "Inline SVG with Ember-Concurrency"
description: ""
comments: true
date: 2017-03-30 12:44
tags: [
  javascript,
  emberjs,
  ember-concurrency,
  svg
]
---

SVG is a vector graphic that scales well and is great for vibrant user interfaces. This post doesn't go into SVG per se, but there is a great article on SVG and it's application in Web Development over at [CSS Tricks][css-tricks]. <br><br>

SVG and Ember make for an exciting pair. Binding values and responding to events with SVG and Ember components just works and can create beautiful, fast, and responsive interfaces, easily. There was just a presentation on the matter at [EmberConf 2017][ember-conf] by [@jwwweber][jwwweber] that really showcases the flexibility of SVG with Ember. <br><br>

The crux here is that the SVGs be inline within the DOM which isn't always straightforward if you're working with remote assets. <br><br>

In my scenario, I had a model, let's call it `Location`, which had a `belongsTo('image')` for the `Image` model which contained a `url` attribute. This `url` was the asset url for the `Location`'s icon. This asset url could be a `png` or `jpg` or `svg` in certain cases but I knew the data coming into my component was only `Location` models with `svg` urls. <br><br>

An initial option may be to use an `<object>` tag with the external `svg` url in the component template and maybe even a fallback `<img>` tag inside it. This technique for rendering SVGs is covered in more detail in the [CSS Tricks][css-tricks] article for those unfamiliar. <br><br>

For this approach the component may look something like this. <br><br>

<script src="https://gist.github.com/hbrysiewicz/0dfa3403ead4ab1acc0a9d4cb97a6191.js"></script><br><br>

<script src="https://gist.github.com/hbrysiewicz/fbba804bde88f1be32efdace7c9a86d9.js"></script><br><br>

Ok, so this works but it isn't the best for a handful of reasons. You can check out the implementation in action at [Ember Twiddle: Part 1][ember-twiddle-1]. <br><br>

First, there are 70 external SVGs in this example being requested and then rendering and its slow. Noticeably slow.<br><br>

The other downside to doing things this way is that the SVG document is contained within the `<object>` tag, which means it isn't accessible for manipulation, data binding, or styling. The SVG elements I was working only contained a `path` and had no fill, which made them difficult to click by default. I had to add `pointer-events: all` to the `<svg>` element itself but with this SVG living inside it's own document inside the `<object>` this was a problem.<br><br>

If I could get the contents of the document via an Ajax request and then load the contents in the template directly, I would then have inline SVG which is what I ultimately wanted. This would allow me to manipulate the contained svg as desired.<br><br>

So I iterated towards using an [`ember-concurrency`][e-c] task to make the request for the SVG document body. Ember-concurrency allows for better control of async requests along with managing state and child tasks. Since learning about it I've used it quite frequently to manage my async tasks. <br><br>

Putting the SVG document request task within the component posed the same issue, the request was being made 70 times. I wanted it loaded once for the `Image` model as many of the `Location` models were sharing the same `Image` model. I considered finding a way to add it to the `ImageAdapter` but digging around in the [Ember Data][ember-data] adapter code didn't reveal any elegant way to chain two ajax requests together and coalesce a final response to be passed on to the serializer and pushed into the store.<br><br>

Instead, I decided to move the request logic into the `Image` model itself. This required I add an extra check to ensure the `Image` url was indeed an `svg`. Now only one request would be made per `Image` and the speed gain on render was enormous and obvious. I also now had inline `<svg>` which meant I could style to my hearts content.<br><br>

<script src="https://gist.github.com/hbrysiewicz/423018386f8c448e2d00232bd3e3e635.js"></script><br><br>

You can check out this final implementation in action at [Ember Twiddle: Part 2][ember-twiddle-2]. <br><br>

<div class='update'>
I am very interested in hearing about other solutions to this problem, especially if they hook into the model's Ember Data Adapter at all. I feel that requests for data should really belong there, but this achieved the result I was looking for. Please comment away!
</div>


[css-tricks]: https://css-tricks.com/using-svg/
[e-c]: http://ember-concurrency.com
[ember-conf]: http://emberconf.com/schedule.html#svg-animation-and-interaction-in-ember
[ember-twiddle-1]:https://ember-twiddle.com/d4e4aad8932df3c2bee9ea49ca173875?fileTreeShown=false&numColumns=2&openFiles=controllers.application.js%2Ctemplates.components.clickable-svg.hbs
[ember-twiddle-2]: https://ember-twiddle.com/ad6664ec5635f9fbf59a7045ed064590?fileTreeShown=false&numColumns=2&openFiles=models.image.js%2Ctemplates.components.clickable-svg.hbs
[jwwweber]: http://twitter.com/jwwweber



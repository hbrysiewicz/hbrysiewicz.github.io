---
layout:   post
title:    "Ember-CLI, Sass, and Bootstrap"
description: "Simple startup for your next project using Ember-CLI with Bootstrap, Sass, and Summernote"
comments: true
date:     2014-10-14 13:15
tags:     [emberjs, bootstrap, ember-cli, sass, glyphicons, fontawesome]
---

<div class='warning'>
<strong>Warning:</strong> Ember-CLI is still undergoing heavy construction. All of the posts I have read through are often soon out-dated, as this could likely be. Please note the versions I am using to make sure this is the resource you are looking for.
</div>

This post is a response to a comment from the [Ember.js Wysiwyg Summernote post]({% post_url 2014-04-18-summernote-ember-wysiwyg %}). Working with vendor libraries and ES6 modules and a build system like Broccoli should be relatively straight forward, and often is, but there are some gaps still.

<img src='/assets/img/ember-cli-bootstrap-comment.png' width='100%'>

I chose to stick to vanilla <a href='http://getbootstrap.com'>Bootstrap</a> for this solution. There are a few packaged modules out there specifically for <a href='http://www.ember-cli.com/'>Ember-CLI</a> but I have yet to find one that <strong>just works</strong>. This walkthrough will actually get Sass and Bootstrap-Sass working together. I'll also explain how to get the default <a href='http://getbootstrap.com/components/#glyphicons'>Bootstrap Glyphicons</a> pack working as well as how to add the <a href='http://fortawesome.github.io/Font-Awesome/'>FontAwesome</a> icon pack.

### New Ember-CLI Application

The first thing to do is create a new Ember-CLI application for this demonstration. If you already have a working Ember-CLI application, you can forgo this step.

<pre class='terminal'>
$ ember new ember-cli-bootstrap-example
$ cd ember-cli-bootstrap-example
</pre>

You may notice that running `ember new` takes care of the `npm install` and `bower install` steps.

### Add Sass and Bootstrap

Using Sass in place of CSS is extremely easy with the help of <a href='https://github.com/joliss/broccoli-sass'>joliss/broccoli-sass</a>. This is one of the many plugins for <a href='https://github.com/broccolijs/broccoli'>Broccoli</a> that <a href='https://twitter.com/jo_liss'>Jo Liss</a> has created, in addition to the work put towards Broccoli itself. This will also be necessary so that the `bootstrap-official-sass` package can work.

Once the install completes, be sure to rename the default `app/styles/app.css` file to `app/styles/app.scss`. If the server is running it will throw an error, simply restart the server.

<pre class='terminal'>
$ npm install --save broccoli-sass
$ mv app/styles/app.css app/styles/app.scss
</pre>

This example will use the `bootstrap-sass-official` <a href='http://bower.io/'>Bower</a> package. To get Glyphicons working we will need to also add another Broccoli plugin for static asset compilation called `broccoli-static-compiler`.

<pre class='terminal'>
$ bower install --save bootstrap-sass-official
$ npm install --save broccoli-static-compiler
</pre>

That is all of the dependencies.

Include the Bootstrap styles in your application by adding an `@import` line to your `app/styles/app.scss` file.

{% highlight CSS %}
@import 'bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap';

html, body {
  margin: 20px;
}
{% endhighlight %}

Add an import statement for the javascript inside the `Brocfile.js`.

{% highlight js linenos %}
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var app = new EmberApp();

// Bootstrap
app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

module.exports = app.toTree();
{% endhighlight %}

Now, to get the Glyphicons working the font assets need to be moved into the `dist/fonts` directory. This can be configured inside the `Brocfile.js` by using the module `broccoli-static-compiler`. This module will take all of the font files and move them into `/fonts`.

Since the first argument, the tree, is the direct location of the Bootstrap Glyphicon fonts the `srcDir` is just the root of this tree. Broccoli builds everything into the `dist` directory so we don't need to preface the `destDir` with this value.

It is important to note the addition of `bootstrapFonts` on line 14. Ember-CLI provides the `toTree()` method which can take any number of trees to be merged into your app tree. The argument passed into toTree must be a single tree or an array of trees.

{% highlight js linenos %}
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var app = new EmberApp();

// Bootstrap
app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

// Glyphicons
var pickFiles = require('broccoli-static-compiler');
var bootstrapFonts = pickFiles('bower_components/bootstrap-sass-official/assets/fonts/bootstrap', {
    srcDir: '/',
    destDir: '/fonts'
});

module.exports = app.toTree(bootstrapFonts);
{% endhighlight %}

### FontAwesome

A lot of people prefer FontAwesome over Glyphicons. They do provide more options than the Glyphicon pack for Bootstrap. I especially like their social icons. Using FontAwesome instead of Glyphicon is actually simpiler than getting Glyphicon to work. All that is needed is to install the Bower package and add the `@import` statement to `app/styles/app.scss`.

<pre class='terminal'>
$ bower install --save fontawesome
</pre>

{% highlight CSS linenos %}
@import 'bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap';
@import 'bower_components/fontawesome/scss/font-awesome';

html, body {
  margin: 20px;
}
{% endhighlight %}

### Example Repository

In response to the aforementioned comment I created an example repository with Ember-CLI, Bootstrap, Sass, Fontawesome, and Summernote which can be found at <a href='https://github.com/hbrysiewicz/ember-cli-summernote'>hbrysiewicz/ember-cli-summernote</a>.

I realized when writing this blog post that the Ember-CLI Version for that project was `0.0.46` which is a bit old. For this example I used version `0.1.1` which is the newest at time of writing. It can be found at <a href='https://github.com/hbrysiewicz/ember-cli-bootstrap-example'>hbrysiewicz/ember-cli-bootstrap-example</a>
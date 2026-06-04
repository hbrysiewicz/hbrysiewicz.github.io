---
layout:   post
title:    "Scope jQuery Selection"
description: "Getting a handle on context with jQuery"
comments: true
date:     2016-02-17 10:33
tags:     [jquery, scope, babel, selector, trick, abstraction]
categories:
- code
---

Here is a simple and effective way to pass different [jQuery](https://jquery.com/) contexts around for manipulation in client packages. Recently I was presented with the issue of instantiating multiple iframes within a single page, all of which would have a small package loaded inside them to run and manipulate itself. These packaged units needed a handle on their own iframe as well as the parent document.

`$` is setup to work off the current `document`. When no context is provided to [the `jQuery()` selector method](https://github.com/jquery/jquery/blob/master/src/core/init.js#L18) then the context of `document` is used. I could have manipulated the selector or used other `jQuery` helper methods to get a handle on the parent document, but that would get messy very fast and could make the packaged code difficult to read.

A cleaner solution is to have two seperate selector handles, one on the unit iframe document and one on the `top.document`. This approach can be used to limit the selector for anything but for my case I needed `top.document`.

{% highlight js %}
import $unit from 'jquery'
import $top from 'utils/jquery-top'
{% endhighlight %}

In the above example `jquery` is just the defacto `jquery` installed as a dependency via `npm`. The second `import` statement is a custom abstraction to the defacto `jquery` library which allows me to override the [seletor method](http://devdocs.io/jquery/jquery#jQuery1) and limit the context to `top.document`.

<div class='warning'>
<strong>Updated (02-22-2016):</strong> The following snippet of code was updated to now use default args, available with ES2015, instead of an or operator in the bling method. Thank you to <a href=http://twitter.com/treyhunner>@treyhunner</a> <a href=https://twitter.com/treyhunner/status/701887839718342656>for pointing this out</a>!
</div>

{% highlight js %}
import jQuery from 'jquery'

jQuery.noConflict()
let bling = function(selector, context = top.document) {
  return new jQuery.fn.init(selector, context)
}
bling.fn = bling.prototype = jQuery.fn
jQuery.extend(bling, jQuery)

export default bling
{% endhighlight %}

Now when I'm in the unit packaged code I can have a handle on both the `top.document` as well as the individual unit iframe `document`.

{% highlight js %}
$unit('.content-body').text('This is an example')
$top('.unit-iframe').addClass('showing')
{% endhighlight %}

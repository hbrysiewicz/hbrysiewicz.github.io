---
layout:   post
title:    "Ember Facebook Components"
description: "Integrate your Ember application with Facebook UI in minutes"
comments: true
date:     2014-12-16 13:03
tags:     [emberjs, components, facebook, ember-cli]
---

Getting Facebook integrated into an existing website may sound daunting but using the Facebook UI API and Ember together was entirely to easy.

<a href='http://ember-cli.com'>Ember-CLI</a> has a directory called initializers that are loaded at app start up. This proves useful for things such as Google Analytics or Facebook SDK initialization.

Here is what my `facebook-sdk.js` initializer looks like. Note the use of global FB. This is used so that JSHint doesn't freak out when building the project.

{% highlight JavaScript linenos %}
/* global FB */
export default {
  name: 'facebook',

  initialize: function() {
    var fbAsyncInit = function() {
      FB.init({
        appId      : '<your app id>',
        xfbml      : true,
        version    : 'v2.2'
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = fbAsyncInit;
  }
};
{% endhighlight %}

Now I can use the global FB.ui in components with ease. So far I've only integrated the Facebook Send Dialogue into the application, but this alone can show how easy it is for the Facebook SDK to now integrate with your Ember Application.

{% highlight JavaScript linenos %}
/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['facebook-send'],

  actions: {
    sendLink: function() {
      FB.ui({
        method: 'send',
        link: 'http://imgur.com',
      });
    }
  }
});
{% endhighlight %}

Check out what other pieces you could use in your Ember application by visiting the <a href='https://developers.facebook.com/docs/javascript/quickstart/v2.2?locale=es_ES'>Facebook JS SDK Documentation</a>

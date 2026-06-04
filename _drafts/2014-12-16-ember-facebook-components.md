---
layout:   post
title:    "Ember Facebook Components"
description: "Integrate your Ember application with Facebook UI in minutes"
comments: true
date:     2014-12-16 13:03
tags:     [emberjs, components, facebook, ember-cli]
---

<div class='warning'>
<strong>Warning:</strong> This was created with older versions of Ember.js and is likely no longer relevant. Please tread lightly when referencing this article.
</div>

Getting Facebook integrated into an existing website may sound daunting but using the Facebook UI API and Ember together was entirely too easy.

<a href='https://ember-cli.com'>Ember-CLI</a> has a directory called initializers that are loaded at app start up. This proves useful for things such as Google Analytics or Facebook SDK initialization.

Here is what my `facebook-sdk.js` initializer looks like. Note the use of global FB. This is used so that JSHint doesn't freak out when building the project.

```javascript
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
```

Now I can use the global FB.ui in components with ease. So far I've only integrated the Facebook Send Dialogue into the application, but this alone can show how easy it is for the Facebook SDK to now integrate with your Ember Application.

```javascript
/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['facebook-send'],

  actions: {
    sendLink: function() {
      FB.ui({
        method: 'send',
        link: 'https://imgur.com',
      });
    }
  }
});
```

Check out what other pieces you could use in your Ember application by visiting the <a href='https://developers.facebook.com/docs/javascript/quickstart/v2.2?locale=es_ES'>Facebook JS SDK Documentation</a>
<br><br>

I need the url sent in the FB send dialogue to be relative to the environment I am in so I added a little mixin I can use throughout the site to generate proper links for each environment. Check it out!

```javascript
import Ember from 'ember';

export default Ember.Mixin.create({
  currentBaseUrl: function() {
    var pathArray = window.location.href.split( '/' );
    return '%@//%@'.fmt(pathArray[0], pathArray[2]);
  }.property()
});
```


<div class='update'>
<strong>Update:</strong> I expand on this post in a talk I gave for a <a href="https://sandiegojs.org">SanDiego.js</a> and <a href="https://www.meetup.com/sandiego-ember/">San Diego Ember</a> talk in February 2015. Watch it <a href="https://youtu.be/W73kfT-G7Cs">here</a> or view the slides <a href="https://hbrysiewicz.github.io/ember-fbcomp/#/">here</a>
</div>

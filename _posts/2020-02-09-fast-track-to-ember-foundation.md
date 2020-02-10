---
layout: post
title: "Fast-track to Solid Ember Foundations"
description: "Your cheat sheet to getting a new Ember app up and running, right"
comments: true
date: 2020-02-09 0:00
tags: [
  emberjs,
  cheat,
  beginner,
  postcss,
  tailwindcss
]
---

This quick run through will get you setup with a new ember app, using pods structure, [TailwindCSS][tailwind], and [PostCSS][postcss] in no time, flat. 


Everything is TL;DR.

Bonus [PurgeCSS][purge] setup. 
Enjoy!


### Initialization

`ember new {name}`

This initializes the directory and all dependencies for getting started.

`cd {name}`

`yarn install`

Will install dependencies for application. Newer versions of ember-cli should use yarn by default, but in older versions you may need to pass `--yarn true` to your `ember new` command.


### PostCSS & Tailwind

Add some swag to your code base.

`yarn add tailwindcss postcss autoprefixer postcss-mixins postcss-nested postcss-simple-vars postcss-import -D`

This adds [Tailwind][tailwind], [PostCSS][postcss], and PostCSS plugins that we use for every project. If you want to learn more about the plugins being used:
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [postcss-mixins](https://github.com/postcss/postcss-mixins)
* [postcss-nested](https://github.com/postcss/postcss-nested)
* [postcss-simple-vars](https://github.com/postcss/postcss-simple-vars)
* [postcss-import](https://github.com/postcss/postcss-import)

Update `ember-cli-build.js` and add these to the build pipeline with PostCSS and the plugin options.

```javascript
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./config/tailwind.js'),
          require('autoprefixer'),
          require('postcss-mixins'),
          require('postcss-nested'),
          require('postcss-simple-vars')
        ]
      }
    }
  });

  return app.toTree();
};
```

Add Tailwind to `app/styles/app.css`

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Initialize an empty config file for TailwindCSS at `app/config/tailwind.js`

```javascript
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
```

This would be where all the fun Tailwind configuration would happen when you're ready to dive into it. Tailwind is also great as it is just out of the box with defaults.


### Transition to Pods

Create a new directory inside `app/` called `pods/` and another directory inside `pods/` called `components`.

```
mkdir -p pods pods/components
```

Move the `application.hbs` from the `app/templates` directory into the `app/pods` directory and rename it to `template.hbs`.

```
mv app/templates/application.hbs pods/template.hbs
```

Remove `app/controllers`, `app/components`, `app/routes` and `app/templates` directories.

Update the `config/environment.js` file to be aware of the new pods name.

```javascript
module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'new-app-name',
    podModulePrefix: 'new-app-name/pods'
    environment,
    ...
  };

  ...

  return ENV;
};
```

Disable analytics and add pods to `.ember-cli` config file:

```javascript
{
  "disableAnalytics": true,
  "usePods": true
}
```

### Bonus Points with PurgeCSS

Tailwind is pretty big when you get down to it, so you can use [PurgeCSS][purge] to really slim down your style files in production. Add this to your PostCSS build plugin pipeline and watch your css file shrink.

```javascript
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './app/index.html',
      './app/templates/**/*.hbs'
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
}

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./config/tailwind.js'),
          require('autoprefixer'),
          require('postcss-mixins'),
          require('postcss-nested'),
          require('postcss-simple-vars'),
          ...isProduction ? [purgeCSS] : []
        ]
      }
    },
  });

  return app.toTree();
};
```

[tailwind]: https://tailwindcss.com/
[postcss]: https://postcss.org/
[purge]: https://github.com/FullHuman/purgecss

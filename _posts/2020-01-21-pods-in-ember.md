---
layout: post
title: "Pods in Ember"
description: "Yes we are still using them and they are still great"
comments: true
date: 2020-01-21 0:00
tags: [
  emberjs,
  pods,
  beginner
]
---

Once upon a time (2016), we heard that pods and classical structured Ember projects would form a new union and there would no longer be a divide<sup>[1](https://github.com/emberjs/rfcs/blob/master/text/0143-module-unification.md)</sup>. Unfortunately, since then, nothing has changed and the divide continues.

So if you're starting a new Ember app and are ready to try (or already using) pods structure, then here is a quick how to.

## New project

I wish there was a way to `ember new --pods {my-project}` or something, so all this was automagically done for you, but there isn't yet, so we have to procede manually.

`ember new --no-welcome --yarn {my-project}`

This will till the land and lay the foundation. 

## Configuration

There are two files that need to be updated to initialize pods in the build process: `.ember-cli` and `config/environment.js`

<script src="https://gist.github.com/hbrysiewicz/4c155196a560ced551b1792f6e77689f.js"></script>

<script src="https://gist.github.com/hbrysiewicz/e361af11c6c1daaf9ae4debd7fe4b64a.js"></script>

## Delete everything

When you start a new ember project, it likes to make out all the classical structure for you with some nice `.gitkeep` files that force git to track empty folders (which otherwise it wouldn't). Delete all the stuff we don't need.

`rm -rf app/components app/controllers app/routes app/templates`

## Make room for pods

Create a folder for your pods.

`mkdir app/pods`

## Get that party started

Now you're free to do what you will with this project in pod land.

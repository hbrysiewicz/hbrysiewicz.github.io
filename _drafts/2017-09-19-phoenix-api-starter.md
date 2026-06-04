---
layout: post
title: "Just Beginning: JSON API with Phoenix 1.3"
description: "Getting started with bare Phoenix 1.3 JSON API"
comments: true
date: 2017-09-21 13:06
tags: [
  elixir,
  phoenix,
  backend,
  json-api,
  api
]
---

I can't remember the last time I dabbled with Phoenix. Whenever it was, I was
messing with channels and all the real time goodness.

This year at [Elixir Conf][elixir-conf] I heard about a lot of new changes in Phoenix from [Chris McCord][chris] and sure enough, when I sat down to create a Phoenix JSON API, most of the tutorials and examples I found were outdated.

[Phoenix 1.3][phx-1.3] was released in July and with it came Contexts. They land with an admittedly bad name (says Chris), but provide a beneficial grouping of related functionality and a good foundation for application growth. The addition of Contexts also means one extra parameter for the `mix phx.gen.json` generator to specify its grouping.

# Getting setup

Be sure to have the dependencies for creating a new Phoenix app installed. If you're not sure what that means, take a look at the [guides for installation][install].

Once Phoenix is installed you can verify the version with `mix`.

```bash
> mix phx.new --version
Phoenix v1.3.0
```

# Generate default application

`mix phx.new` also happens to be the command to create a new Phoenix project. [Brunch.io][brunch] is included in a default Phoenix app for compiling assets and uses `npm`, but when developing strictly a JSON API there are no assets and thus, brunch can be omitted. There is also no visual piece and the html layer can also be omitted.

```bash
> mix phx.new --no-brunch --no-html {api_name}
```

This will kick off creation of the API and prompt to download dependencies. Once completed there are just a few minor "clean up" items to make it truly an API-only Phoenix application.

1. Remove `lib/{api_name}_web/channels` directory
```bash
> rm -rf lib/{api_name}_web/channels
```
2. Remove `test/{api_name}_web/channels` directory
```bash
> rm -rf test/{api_name}_web/channels
```
3. In `lib/{api_name}_web/endpoint.ex` file, remove this line:
```elixir
socket "/socket", {ApiName}Web.UserSocket
```
4. In `lib/{api_name}_web/endpoint.ex` file, remove this line:
```elixir
only: ~w(css fonts images js favicon.ico robots.txt)
```
and be sure to remove the `,` on the preceding line.
5. In `lib/{api_name}_web.ex` file, remove these lines:
```elixir
def channel do
    quote do
      use Phoenix.Channel
      import TossWeb.Gettext
    end
end
```

# Update Database Config

Inside of `config/dev.exs` the settings for the database connection in development can be found. Be sure the `username` and `password` properties reflect your environment.

```elixir
username: "postgres",
password: "",
```

The next step is to create the database for this API: run `mix ecto.create`.

# Create first resource

This example will provide blog post records, so we will need a `Post` module. To create the module the `mix phx.gen.json` generator will be used. It requires the Context, the singular module name, and the plural table name. Everything after the initial 3 arguments will be attributes for the model. For this example `Post` will be grouped inside the `Blog` context, and we will start with just `title` and an `is_published` boolean flag.

As mentioned earlier, having context now allows us to group logical pieces of the API together. If later a `Comment` module was added to this API, for example, it could also be grouped within the `Blog` context. I'm sure you can think of other useful progressions of this grouping as the API grows.

```bash
> mix phx.gen.json Blog Post posts title:string is_published:boolean
```

Remove the functions in the newly generated `post_controller` that will not be used for this example: the `create`, `update`, and `delete` methods.

Removing these methods means we can also remove the `alias` for the `Post` module on line 5.

```elixir
alias {ApiName}.Blog.Post
```

 Be sure to run `mix ecto.migrate`.

# Add resource routes

The API now has the changes in the database and the `Post` module and controller. In order to now hit the controller, the routes need to be added into the `lib/{api_name}_web/router.ex` file.

When writing an API I prefer to namespace resources into a specific API version. In order to do this, the `scope "/api"` block needs to be expanded a bit.

```elixir
scope "/api", {ApiName}iWeb, as: :api do
  pipe_through :api

  scope "/v1", V1, as: :v1 do
    resources "/posts", PostController, only: [:index, :show]
  end
end
```

To confirm that the new routes exist as expected, run `mix phx.routes` and see
them listed out:
```bash
> mix phx.routes
v1_post_path  GET  /api/v1/posts      {ApiName}Web.V1.PostController :index
v1_post_path  GET  /api/v1/posts/:id  {ApiName}Web.V1.PostController :show
```

# Update the Post controller and view

When looking closely at the routes that are listed above, you can see a naming difference. The listed controller name is `{ApiName}Web.V1.PostController` but opening the `lib/{api_name}_web/controllers/posts_controller.ex` shows a different module name: `{ApiName}Web.PostController`.

This will have to be renamed to match and to group controllers within the same API version, it can be contained within its own `lib/{api_name}_web/controllers/v1` folder.

```bash
> mkdir v1
> mv posts_controller.ex v1/
```

And then rename the controller module to `{ApiName}Web.V1.PostController`.

A similar thing will have to happen for the corresponding view. Right now we don't have to worry too much about the contents of the `lib/{api_name}_web/views/post_view.ex` because it will be replaced soon enough - but this file will have to also belong to a `lib/{api_name}_web/views/v1` folder and the module renamed to `{ApiName}Web.V1.PostView`.

```bash
> mkdir v1
> mv posts_view.ex v1
```

And then rename the view module to `{ApiName}Web.V1.PostView`. In the View module, there also is an alias that needs to be updated on line 3 to reflect the new namespace:

```elixir
alias {ApiName}Web.V1.PostView
```

# Test out JSON response

Spin up the server with `mix phx.server` and using your preferred REST client try and hit `http://localhost:4000/api/v1/posts`. Make sure you have `Content-Type: application/json` in whatever REST client you happen to use.

You should receive an empty response.

```json
{
  "data": []
}
```

## Add seed data

Seed data in a Phoenix app is straightforward and there is some foundation laid to create consistency. There is a file named `priv/repo/seeds.ex` which we can put our seed data for the database.

We can just write direct inserts to our database in here and then we can run it with `mix run`.

```elixir
alias {ApiName}.Repo
alias {ApiName}.Blog.Post

Repo.insert!(%Post{title: "Getting started with Phoenix and JSON API", is_published: true})
Repo.insert!(%Post{title: "Next steps with Phoenix and JSON API", is_published: false})
```

This can be executed with `mix run priv/repo/seeds.ex`.

Now hit `http://localhost:4000/api/v1/posts` again and you should see the two records returned as JSON.

```json
{
  "data": [
    {
      "id": 1,
      "is_published": true,
      "title": "Getting started with Phoenix and JSON API"
    },
    {
      "id": 2,
      "is_published": false,
      "title": "Next steps with Phoenix and JSON API"
    }
  ]
}
```

# JSON API Serializers

This is all great and it's almost a good beginning. All that needs to happen now is for the response to be in the [JSON-API][json-api] specification. This is made easier with the use of the [jaserializer][ja-serializer] package.

Dependencies for a Phoenix app get added to `mix.exs` in the `defp deps do` block. At the time of writing this, the newest version of `jaserializer` is `0.12.0` so be sure to confirm your versions are up to date.

Add a line in the `defp deps do` block of `mix.exs` to include this new dependency.

```elixir
{:ja_serializer, "~> 0.12.0"}
```

Whenever a new dependency is added to an Elixir app, `mix deps.get` needs to be run.

## Add `json-api` mime-type

We need to configure the `json-api` mime-type to serialize JSON API. This can be done inside `config/config.exs`

```elixir
config :phoenix, :format_encoders,
  "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}
```

After modifying Plug, we have to recompile:

```bash
> mix deps.clean plug --build
> mix deps.get
```

And now we can add the `json-api` plug to the `api` pipeline defined in `lib/{api_name}_web/router.ex`. If you know for sure your API will only accept `json-api` then you can remove the existing `json` from the plug list.

```elixir
pipeline :api do
  plug :accepts, ["json-api"]
end
```

## Use jaserializer in View

There are two different ways to configure the views in a Phoenix API to serialize with `jaserializer`. One is by adding a `use` statement to each individual View module:

```elixir
use JaSerializer.PhoenixView
```

This is useful if you want to pick and choose when you will be serializing in JSON API or something else. If this is an evergreen API, though, chances are you plan on building everything out as a JSON API endpoint, so you'll need this for each View.

We can add the `use` statement collectively to all View modules by adding it to the `lib/{api_name}_web.ex` file under the `def view do` block:

```elixir
  def view do
    quote do
      use Phoenix.View, root: "lib/{api_name}_web/templates",
                        namespace: {ApiName}Web
      use JaSerializer.PhoenixView

...
```

Now the alteration to the `lib/{api_name}_web/views/v1/post_view.ex` can happen. Now that we are using `jaserializer` our views become a definition of what we want to serialize. Inside the view file we could define relationships or individual attributes. The `Post` model in this API is simple and just has two attributes but more info on how to serialize relationships can be found in the [jaserializer][jaserializer] github README. Update the View file to serialize the attributes for our model:

```elixir
defmodule {ApiName}Web.V1.PostView do
  use {ApiName}Web, :view

  attributes [:title, :is_published]
end
```

## Update controller

Right now the controller is rendering `index.json` and `show.json` in the respective action handlers. This needs to be updated with the correct content type of `json-api`, and the `posts` and `post` attributes need to be replaced with `data` to correspond to the JSON API specification.

Update the `index` block:

```elixir
render(conn, "index.json-api", data: posts)
```

Update the `show` block:
```elixir
render(conn, "show.json-api", data: posts)
```

## Test it out

Now if we hit `http://localhost:4000/api/v1/posts` we will see the expected response for our inserted data returned in JSON API format!

```json
{
  "data": [
    {
      "attributes": {
        "is-published": true,
        "title": "Getting started with Phoenix and JSON API"
      },
      "id": "1",
      "type": "post"
    },
    {
      "attributes": {
        "is-published": false,
        "title": "Next steps with Phoenix and JSON API"
      },
      "id": "2",
      "type": "post"
    }
  ],
  "jsonapi": {
    "version": "1.0"
  }
}
```

And similarly, if we travel to `http://localhost:4000/api/v1/posts/1` our first record will be returned in JSON API format as well.

```json
{
  "data": {
    "attributes": {
      "is-published": true,
      "title": "Getting started with Phoenix and JSON API"
    },
    "id": "1",
    "type": "post"
  },
  "jsonapi": {
    "version": "1.0"
  }
}
```

Congratulations! You have your first JSON API with Phoenix!

Please feel free to kindly share your corrections, misinformations, or suggestions in the comments.

[elixir-conf]: https://elixirconf.com/
[phx]: http://phoenixframework.org/
[chris]: https://twitter.com/chris_mccord?lang=en
[nerves]: http://nerves-project.org/
[phx-1.3]: http://phoenixframework.org/blog/phoenix-1-3-0-released
[install]: https://hexdocs.pm/phoenix/installation.html#content
[brunch]: http://brunch.io/
[json-api]: http://jsonapi.org/
[jaserializer]: https://github.com/vt-elixir/ja_serializer

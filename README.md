<img src="logo.png?raw=true" width="256" align="right" />

## [Mazmorra.io](https://mazmorra.io): Retro Multiplayer Roguelite RPG

[Mazmorra.io](https://mazmorra.io) has a long history with Colyseus. This project has started to validate the very first vesions of Colyseus, as you can see in [commits dating back from 2015](https://github.com/endel/mazmorra/commit/7d2f631a48f8907f5031a3c9a1936d012bbe2090), when the Colyseus version was **0.2**

I've decided to make the **source code available** for mazmorra.io, for educational purposes. It is not open-sourced under a permissive license, though. You are **not allowed** to host your own version, or a modified version of [Mazmorra.io](https://mazmorra.io).

Beware. There are a lot of bad code and bad practices in here, which I'm not very proud of.

## System requirements

- NodeJS
- Ruby 2.x
- imagemagick (`brew install imagemagick`)
- ffmpeg (`brew install ffmpeg`)

# Steps to run the project

- `npm install`
- `bundle install`
- `npm run soundtracks`
- `ruby export_layers.rb`
- `npm run favicons` 
- `npm start` (start cliet-side)
- `npm start --prefix server` (start server-side)


## LICENSE

Copyright © Endel Dreyer. See [LICENSE.md](LICENSE.md) for more details.

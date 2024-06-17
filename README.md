# Livmojis

This repo contains the source SVG files for all my emoji packs.

## Emoji packs

### Blobbee

Blobbee was the first of these packs, and was originally designed to just be
pride flag bees but was then expanded to become a full set.

![A grid of bee emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-blobbee.png)

### Neobread

Neobread started as a single emoji, `neobread_woozy`, inspired by
[a fedi post](https://meow.woem.cat/notes/9qq5pizgf0bff23a), which I then
expanded to contain the same emojis as blobbee due to popular demand.

![A grid of bread emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-neobread.png)

### NeoDLR

NeoDLR is not a full emoji set but a few very specific emojis designed to look
like
[DLR rolling stock](https://en.wikipedia.org/wiki/Docklands_Light_Railway_rolling_stock),
also inspired by [a fedi post](https://meow.woem.cat/notes/9tkftowim4l7k08p).

![A grid of red and black train emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-neoDLR.png)

### Neocat

Neocat was originally created by [Volpeon](https://volpeon.ink/emojis/). These
are just a few additions I made while creating the other sets.

![A grid of cat emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-neocat.png)

### Neofox

Neofox was originally created by [Volpeon](https://volpeon.ink/emojis/). These
are just a few additions I made while creating the other sets.

![A grid of fox emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-neofox.png)

### Fox

Fox is based on the
[Twemoji fox face](https://commons.wikimedia.org/wiki/File:Twemoji12_1f98a.svg)
and started with `fox_plead_collar` based on
[a fedi post](https://fox.nexus/@theresnotime/112418372868714476).

![A grid of fox emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-fox.png)

### NeoSSB

NeoSSB was requested by [Ente on fedi](@Erpel@hat-eine.entenbru.st) and is based
on the [SSB DT 8.12](https://en.wikipedia.org/wiki/SSB_DT_8) light rail system.

![A grid of yellow train emojis making various expressions.](https://github.com/olivvybee/emojis/releases/latest/download/preview-neossb.png)

### Misc

The pack called "misc" contains emojis that don't fit in any one specific pack.
For example `:thought_bubble_close:` can be used with either
`:blobbee_thought_bubble:` or `:neobread_thought_bubble:`.

![A grid of emojis in the same style as the others.](https://github.com/olivvybee/emojis/releases/latest/download/preview-misc.png)

## Adding to a fedi instance

A `.zip` file containing 256x256px PNGs of each emoji is available on the
[releases page](https://github.com/olivvybee/emojis/releases/latest). The
simplest (but most tedious) way to add the emojis to an instance is to download
that archive, extract it, and upload the emojis you want.

If you already have some of the emojis and just need the newer ones, each
release contains an `updates-XYZ.zip` and an `updates-XYZ.tar.gz` that contain
only the emojis changed in that release.

### Mastodon and glitch-soc

**Note: this method requires command line access to the instance. If you don't
have that, unfortunately you will need to add each emoji manually.**

Using
[Mastodon's `tootctl` CLI](https://docs.joinmastodon.org/admin/tootctl/#emoji-import)
lets you import the entire set at once from the command line.

If you trust random shell commands from the internet, run this from your
instance's `live` directory, replacing PACK_NAME with the name of the pack (e.g.
`blobbee` or `neobread`):

```
wget https://github.com/olivvybee/emojis/releases/latest/download/PACK_NAME.tar.gz
RAILS_ENV=production bin/tootctl emoji import --category PACK_NAME ./PACK_NAME.tar.gz
```

Otherwise:

1. Download the
   [latest `.tar.gz` archive](https://github.com/olivvybee/emojis/releases/latest)
   for the pack you want.
2. Run `tootctl emoji import` on the archive you downloaded.

### Misskey and its many forks (firefish, iceshrimp, sharkey, etc)

The PNG archive includes a `meta.json` that these instances can use to import
the entire archive at once.

1. Download the
   [latest `.zip` archive](https://github.com/olivvybee/emojis/releases/latest)
   for the pack you want.
2. In the custom emoji area of your instance, import the `.zip`.

The emojis will be categorised automatically.

## Licensing

Unless otherwise stated, all emojis and parts of emojis were created by me and
released here under the
[CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/).

The code in this repo used to package the emojis is licensed under the
[MIT license](https://opensource.org/license/mit).

- [Neocat by volpeon](https://volpeon.ink/emojis/neocat/) is used under the
  CC-BY-NC-SA license
- [Neofox by volpeon](https://volpeon.ink/emojis/neofox/) is used under the
  CC-BY-NC-SA license
- [BunHD by volpeon](https://volpeon.ink/emojis/bunhd/) is used under the
  CC-BY-NC-SA license
- The
  [twemoji mouse emoji](https://commons.wikimedia.org/wiki/File:Twemoji_1f401.svg)
  has been used and modified under the CC-BY license

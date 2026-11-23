---
title: "Porting Quirks"
date: '2026-11-21'
slug: porting-quirks
summary: "Porting the 1979 arcade game Galaxian to Mac means emulating the original hardware (sprite handling, a dedicated scrolling starfield) as well as the Z80 code. I examine quirks rooted in the machine's constraints, such as bullets drawn on alternating frames, a one-frame sprite lag, and invisible re-entering ships. For each, I weigh keeping the hardware artifact for fidelity against simplifying the code."
description: "Porting Galaxian to Mac by emulating its Z80 hardware, quirks and all, while weighing fidelity against simpler code."
image: /og/porting-quirks.png
tags:
  - porting
  - C
  - Z80
  - arcade
  - galaxian
  - MAME
---

I'm porting the 1979 NAMCO arcade game "[Galaxian](https://en.wikipedia.org/wiki/Galaxian)" to mac. I have a sort of vague idea of an art project based on it which will likely never be finished, but in the meantime, I'm having a fascinating time getting to 'know' the original programmers who had to squeeze it into the Z80 and were working on cutting edge technology at the time (1K of working RAM, and another 1K of video RAM).

![](/images/porting-quirks-red-50.gif)


## Arcade game history

For context, [Space Invaders](https://en.wikipedia.org/wiki/Space_Invaders) had dropped the year before and revolutionised arcade games with its success. Galaxian was a big step up with it's use of real colour, and having the aliens swoop and attack the player's ship. If you were around then, but don't recall Galaxian, that's because you probably played [Galaga](https://en.wikipedia.org/wiki/Galaga) which is basically the same game as Galaxian, but better. I only have nostalgia for Galaxain because that's the game they had at the pub where I spent almost every Sunday afternoon for a year or so after high school.

If you want it play it legally, okay options are [Steam](https://store.steampowered.com/app/1250250/NAMCO_MUSEUM_ARCHIVES_Vol_1/) or a good one is the [Nintendo Store](https://ec.nintendo.com/AU/en/titles/70010000043842?utm_source=chatgpt.com) with the Switch port looking much more like the original arcade version. There's also an Atari port on Steam that is very low fidelity to the original.

## Back in time

It's fun seeing that the Steam recommended minimum rig is an Intel Core i3 3120M with the Intel on board HD Graphics 4000, since the [arcade machine](https://segaretro.org/Galaxian-based_hardware) was a Zilog Z80 running at 3.072 MHz. Sounds were synthesized in an analog board and the video was a whole thing as well - sprites loaded into hardware and pulled in as they were needed, colours separate from the graphics, and a dedicated circuit to make the scrolling starfield background.

Porting such a thing isn't just decompiling the Z80 ROM code, all that hardware needs emulated in your code as well. In the process of digging into all this I've gained great respect for the people behind the [MAME](https://github.com/mamedev/mame) project that have figured all this out for all the different versions of arcade machines build over the years.

## Project Goals

My intention is to end up with a mac port written in maintainable C code I understand that's true to the original, and only then to mess with it. That seemed pretty straightforward, but I keep discovering things, usually related to the hardware limitations, and need to decide if I want to keep a complicated piece of code that's only there to reproduce a quirk of the hardware, and possibly doesn't represent the intent of the engineer at the time, *or*, should I simplify the code, 'improve' the program and lose some fidelity to the original?

Let's look at some examples.

## Quirks

### Bullet drawing

Due to a limit in the sprite drawing hardware, only seven bullets can be drawn on a frame. As the game progresses and the alien attack gets intense, there's sometimes up to 14 bullets heading towards your ship. To get around this, the original ROM alternates the bullet updating and drawing in each frame. For example, when processing the first frame, update the odd numbered bullets, then on the next frame skip those seven and update the remaining even numbered bullets, then repeat. At the game tick rate of 60.6Hz you are probably not going to notice this, especially on the CRT screens in the original machines. When it's slowed down, on a modern screen it's very obvious - scroll down to have a look.

That's the sort of quirk I'm comfortable to remove - no meaningful experience difference, it probably only exists to deal with hardware limitations, and removing it results in simpler code.

### Sprites & tiles sync errors

The custom graphics hardware (like an early precursor of graphics cards) in the machines could place whole tiles and sprites into the video RAM (instead of drawing them pixel by pixel in software) and in the case of sprites, manipulate them a little. Tiles are used for text output and the aliens when in formations, and sprites for attacking aliens, the player ship and explosions. 

For some reason, the sequence is that when the Z80 'Non maskable interrupt' fires, it first copies the object RAM (sprites, bullets, scroll/ship registers) to the hardware, *then* runs the game logic that updates all the positions and checks for collisions, then copies the tile RAM changes to the video hardware. The result of this is that the sprites view is one frame behind. At 60Hz, I can't see the difference, so I'm happy to 'fix' it by doing all the drawing after the updates, but it's interesting to wonder about how it came about.

### Zero (0) for capital O

This one I suspect is just a typo.

![](/images/porting-quirks-player-one.png)

At the start of a game, 'Player One' uses the numeral zero for the capital 'o' (you can match it against the digits in the score above). I assumed this was to save a glyph, but you can see in the "HIGH SCORE" at the top that we already had the bitmap for it, in fact here's one of the sprite bitmaps extracted from the ROM.

![](/images/porting-quirks-palette0.png)

"PLAYER TWO" gets a real letter 'o' so I guess this is just a straight up error that got through unnoticed. Maybe someone typed 0x00 instead of 0x1F - that sort of thing.

### Formation drawing spread out

The tiles for the formation of aliens is not redrawn every frame. I guess that would have just taken too long, so instead the redrawing of each column is done one column at a time in each frame. Since the alien ships are also running through their wing flapping animation this results in a sort of Mexican wave as they are animated. 

To reproduce this, I have to keep track of which column I'm updating across all the redraws; so it's extra code to understand and maintain, but if I take it out and just update the whole formation every frame, it doesn't look like my memories of Galaxian. So I guess that quirk stays. Here's a slowed down side by side comparison.

![](/images/porting-quirks-q2-split.gif)

### Reentry gap

If you fail to kill an attacking group (often happens to me) and they escape off the bottom of the screen, they will reappear at the top and go back to their spots in the formation. 

Although you could see the star field scrolling under the high scores, the returning ships were invisible until they slid out from underneath them. This was just because the video buffer for the sprites was just clipped 17 pixels down the screen - not drawing things under the scores seems reasonable to save some time I guess - it just looks odd since the star field (which was its own hardware thing) does go underneath the hud.

![](/images/porting-quirks-q9-split.gif)


Once again, maintaining this behaviour takes more code than eliminating it. I decided to eliminate this behaviour and have them slide in from above to match the stars, but when I did, I found another problem - the sprites x values were wrong for the first frame of their entry so they'd come in then flash across. 

I think the wrong x position was just the one they'd flown off the bottom of the screen with.  It makes sense the programmer hadn't burnt up CPU cycles on updating a value that wasn't being drawn anyway, but I had to go ahead and fix that.

In the gif above, you can see I still have work to do since the returning ships are still not appearing at the first pixel. Fixing this will require inventing their arriving paths in the cycles before what's currently shown - which looks like just straight down.

## Fun

Prompting SSR Javascript CRUD apps does not bring me as much joy as programming used to, but this project that I can pick up and do an hour on here and there certainly has. Definitely one of those things where the journey is the important part.
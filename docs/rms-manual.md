# Age of Empires 2 Random Map Scripting

The AoE2 game presents you with two options for creating custom maps:

- A built-in visual map editor. Maps created in the editor will always look exactly as you create them.
- Creating randomly generated maps as separate files and placing them in a specific folder inside the game.

We recommend you to try out the map editor first to get an idea of all the stuff you can place on the map.

This guide will tell you everything you need to create random maps on AoE2 HD.

## Creating and editing RMS files

A random map is a simple text file. Inside it, you write instructions on how the game should generate the map. A real example:

```RMS
<LAND_GENERATION>
base_terrain DESERT
```

This is called a random map script, or RMS. To add it to your copy of the game, just move it into the game folder:

- Rename the map file to `<name>.rms` - make sure the file name ends with `.rms` and not `.txt`.
- Place the map file in `<game>/resources/_common/random-map-scripts/`.

Use any plain text editor, e.g. Notepad. We recommend to use something more powerful like [Visual Studio Code](https://code.visualstudio.com/) with [the AoE2 extension](https://marketplace.visualstudio.com/items?itemName=deltaidea.aoe2-rms). Check out [this online editor](https://mangudai.github.io/) to see how much syntax highlighting and hints help.

Try it now: open your text editor, copy the example above and save it to the mentioned folder. After that, launch the game, choose map style "Custom", and you should see your map in the list.

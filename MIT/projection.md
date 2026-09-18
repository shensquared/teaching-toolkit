# Projection setup

What to check before lecturing from a laptop, so the picture on the screen is as sharp as the room can make it, and how small the type on a slide can get before the back row loses it.

Room capacity and the AV inventory are in [room-availability/classrooms.tsv](room-availability/classrooms.tsv). Getting the lecture recorded is [recording.md](recording.md).

## Check what the room told your laptop

macOS reports the display mode it negotiated with the room's receiver:

```sh
system_profiler SPDisplaysDataType | grep -A6 -E "Displays:|Resolution|UI Looks like|Mirror"
```

Read two things off that. `Mirror: Off`, and the room display running at the resolution the receiver actually declares rather than whatever macOS picked.

## What to set

**Run the displays extended, not mirrored.** Under mirroring macOS makes the built-in panel the master and pushes its shape to the room. A laptop panel is rarely 16:9, so a 16:9 receiver pillarboxes that image inside its own frame and resamples it, and the picture arrives smaller and softer than either display can manage. Extending also gives back the presenter view that mirroring costs.

**Match the receiver's aspect ratio.** Any mode whose aspect differs from the receiver's fails regardless of its pixel count, because the resampling that corrects the shape is what softens the image. A 1280x720 deck on a 1920x1080 receiver maps at exactly 1.5x with no fractional resampling.

**Keep the refresh rate inside the declared window.** Slides do not care, but a demo with drag interaction redraws on every pointer move, so a stable 60 Hz beats a higher number that the receiver has to adapt.

**Use a cable.** A wireless presentation path adds compression, and it lands hardest on thin plot lines and small tick labels, which is the content most likely to be doing real work on a technical slide.

## How small the type can be

Two standard AV conventions set the floor, so this is arithmetic rather than taste.

1. The 4/6/8 rule bounds how far the last row sits from the screen as a multiple of image height `H`. Distance `D` should satisfy `D/H ≤ 4` for analytical content, `≤ 6` for ordinary decision-making content, `≤ 8` for passive viewing.
2. Text is comfortably readable when its height is at least `D/150`.

Combining them, for a deck whose canvas is 720 pixels tall:

```
min height in deck px  =  720 × (D/H) / 150
```

| D/H | Content it suits | Exact | Floor in deck px |
|---|---|---|---|
| 4 | analytical, front section | 19.2 | 20 |
| 6 | general lecture audience | 28.8 | 29 |
| 8 | passive viewing only | 38.4 | 39 |

The last column rounds up, because these are minimums and rounding down puts you under the floor you just computed.

Reveal.js picks 30px as its base size for that geometry, which clears the `D/H = 6` floor. Two independent routes to nearly the same number is the reason to trust it.

In a large hall, treat `D/H = 6` as the design point and `D/H = 4` as the floor for anything a student is expected to read. Axis tick labels are the usual casualty. Raise them to 20px and design the slide so its point survives without them, because shape, motion, and relative position carry from the back row where digits do not.

## 10-250

Measured from the room's Crestron receiver over HDMI:

```
ProductName="Crestron"   ManufacturerID="CEI"   HasHDMILegacyEDID=Yes
MaxHorizontalImageSize=80  MaxVerticalImageSize=45     → 80:45, exactly 16:9
MinimumRefreshRate=57      MaximumRefreshRate=73
```

So the settings are the Crestron at 1920x1080, 60 Hz, extended, over a cable. `HasHDMILegacyEDID` confirms this is a cable path.

Three numbers would replace the `D/H = 6` assumption with a measurement.

1. Projected image height, floor to the top of the visible image.
2. Distance from the screen to the back row.
3. The projector's native resolution, which decides whether 1920x1080 is a 1:1 path or is rescaled again inside the room hardware.

With the first two, `D/H` is direct and the table above gives the floor without guessing.

## What this does not cover

One room's measurements and the general arithmetic, and nothing about a particular deck. Slide dimensions, embedded demo behavior, and per-demo type sizes belong with the deck source.

Other rooms need their own EDID reading. The `system_profiler` command above produces it in about a minute if you get into the room early.

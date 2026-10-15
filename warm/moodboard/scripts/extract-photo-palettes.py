"""Bake 16 representative, exact source pixels per website direction.

Run from any directory with Python and Pillow:
    python3 scripts/extract-photo-palettes.py
    python3 scripts/extract-photo-palettes.py --check --verbose

Only photo-palettes.json is written. Source images are never modified.
Rectangles are normalized (left, top, right, bottom), based on PhotoCrop in
Websites.tsx. The clean campaign plates contain no composited page typography.
Masks exclude the remaining real-world lettering on signs and packaging.
"""

import argparse
from collections import Counter
from dataclasses import dataclass
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/assets"
OUTPUT = ROOT / "src/photo-palettes.json"
COLORS_PER_DIRECTION = 16
SAMPLE_STEP = 4
Rect = tuple[float, float, float, float]


@dataclass(frozen=True)
class Source:
    path: str
    include: tuple[Rect, ...]
    exclude: tuple[Rect, ...] = ()


SOURCES = {
    "0": (
        Source("website-layers/oriel-clean-photo.png", ((0, 0, 1, 1),)),
        # The three real material samples inside Oriel's native material card.
        Source("websites/04-oriel-spatial-practice.png", (
            (.7847, .7179, .8442, .8259),
            (.8477, .7179, .9072, .8259),
            (.9107, .7179, .9702, .8259),
        )),
    ),
    "1": (
        Source("websites/02-rill-and-rye-bakery.png",
               ((.466, .198, .984, .916),), (
                   (.63, .43, .82, .51),   # Lettering on the rose awning.
                   (.52, .62, .61, .80),   # Chalkboard beside the doorway.
                   (.83, .52, .90, .68),   # Bakery sign on the right wall.
               )),
    ),
    "2": (
        Source("websites/03-room-and-ritual-interiors.png", ((0, .37, 1, 1),)),
    ),
    "6": (
        Source("website-layers/sundrop-clean-photo.png", ((0, .072, 1, 1),),
               ((.745, .49, .883, .805),)),  # Can logo, product name, and volume.
    ),
    "7": (
        Source("website-layers/avela-clean-photo.png", ((0, 0, 1, 1),)),
        Source("websites/06-serein-botanical-care.png", (
            (.365, .068, .529, .918),  # Botanical window.
            (.530, .068, 1, .918),    # Portrait window.
            (.243, .526, .415, .880), # Bottle photograph, excluding its label below.
        ), ((.299, .719, .391, .856),)),
    ),
}

# Preserve three visually salient material regions, including small accents that
# area-weighted clustering could miss (for example the orange interiors lamp).
# Each tuple is (source index, source x, source y); all are inside the masks above.
ANCHORS = {
    "0": ((0, 1528, 237), (0, 1192, 289), (0, 904, 423)),
    "1": ((0, 1235, 340), (0, 1012, 414), (0, 850, 268)),
    "2": ((0, 1199, 776), (0, 1210, 614), (0, 523, 424)),
    "6": ((0, 1203, 480), (0, 875, 339), (0, 628, 781)),
    "7": ((0, 825, 539), (0, 1432, 172), (1, 1128, 511)),
}


def inside(x: float, y: float, rect: Rect) -> bool:
    left, top, right, bottom = rect
    return left <= x < right and top <= y < bottom


def source_samples(source: Source):
    image = Image.open(ASSETS / source.path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    for y in range(0, height, SAMPLE_STEP):
        for x in range(0, width, SAMPLE_STEP):
            nx, ny = x / width, y / height
            if any(inside(nx, ny, box) for box in source.include) and not any(
                inside(nx, ny, box) for box in source.exclude
            ):
                yield pixels[x, y], (source.path, x, y)


def distance(left, right):
    return sum((a - b) ** 2 for a, b in zip(left, right))


def extract_direction(direction, sources):
    samples = [sample for source in sources for sample in source_samples(source)]
    # Quantization defines candidate clusters only. Its synthesized averages are
    # never exported: each candidate is replaced by an actual sampled source pixel.
    analysis = Image.new("RGB", (len(samples), 1))
    analysis.putdata([rgb for rgb, _ in samples])
    clustered = analysis.quantize(colors=64, method=Image.Quantize.MEDIANCUT)
    palette = clustered.getpalette()
    indices = list(clustered.getdata())
    counts = Counter(indices)
    closest = {}
    for (rgb, provenance), index in zip(samples, indices):
        center = palette[index * 3:index * 3 + 3]
        score = distance(rgb, center)
        if index not in closest or score < closest[index][0]:
            closest[index] = (score, rgb, provenance)
    candidates = [
        (counts[index], closest[index][1], closest[index][2])
        for index in sorted(counts, key=lambda index: (-counts[index], index))
    ]
    selected = []
    for source_index, x, y in ANCHORS[direction]:
        source = sources[source_index]
        image = Image.open(ASSETS / source.path).convert("RGB")
        width, height = image.size
        nx, ny = x / width, y / height
        assert any(inside(nx, ny, box) for box in source.include)
        assert not any(inside(nx, ny, box) for box in source.exclude)
        selected.append((1, image.getpixel((x, y)), (source.path, x, y)))
    if candidates[0][1] not in [old[1] for old in selected]:
        selected.append(candidates.pop(0))
    while candidates and len(selected) < COLORS_PER_DIRECTION:
        # Prefer both substantial photo regions and distinct visible color values.
        # Deterministic tie-breaking follows the population/index order above.
        best = max(range(len(candidates)), key=lambda i:
                   min(distance(candidates[i][1], old[1]) for old in selected)
                   * candidates[i][0] ** .5)
        candidate = candidates.pop(best)
        if all(candidate[1] != old[1] for old in selected):
            selected.append(candidate)
    assert len(selected) == COLORS_PER_DIRECTION

    # Independently verify each exported RGB against its exact source coordinate.
    images = {source.path: Image.open(ASSETS / source.path).convert("RGB")
              for source in sources}
    for _, rgb, (file, x, y) in selected:
        assert images[file].getpixel((x, y)) == rgb
    return selected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="Verify reproducibility without writing output.")
    parser.add_argument("--verbose", action="store_true",
                        help="Print exact source coordinates for every color.")
    args = parser.parse_args()
    result = {}
    for direction, sources in SOURCES.items():
        selected = extract_direction(direction, sources)
        result[direction] = ["#" + "".join(f"{channel:02x}" for channel in rgb)
                             for _, rgb, _ in selected]
        print(f"Direction {direction}: {len(selected)} verified source colors")
        if args.verbose:
            for color, (_, rgb, (file, x, y)) in zip(result[direction], selected):
                print(f"  {color} {rgb}: {file} at ({x}, {y})")
    encoded = json.dumps(result, indent=2) + "\n"
    if args.check:
        assert OUTPUT.read_text() == encoded, "Baked photo palettes differ; regenerate."
        print("Baked palettes exactly match deterministic extraction.")
    else:
        OUTPUT.write_text(encoded)
        print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

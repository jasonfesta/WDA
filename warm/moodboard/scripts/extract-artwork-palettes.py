"""Representative real pixels from selected texture/object artwork, grouped by direction."""
from collections import Counter
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
refs = json.loads((root / 'src/registry.json').read_text())
result = {}
for direction in range(10):
    pixels = []
    for entry in refs:
        if entry['theme'] != direction or entry['kind'] not in ('texture', 'object'):
            continue
        image = Image.open(root / 'public' / entry['image'].lstrip('/')).convert('RGBA')
        # Nearest-neighbor sampling preserves real source RGB values; skip transparent pixels.
        image.thumbnail((100, 100), Image.Resampling.NEAREST)
        pixels.extend((r, g, b) for r, g, b, alpha in image.getdata() if alpha > 245)
    if not pixels:
        continue
    image = Image.new('RGB', (len(pixels), 1))
    image.putdata(pixels)
    quantized = image.quantize(colors=48, method=Image.Quantize.MEDIANCUT)
    palette = quantized.getpalette()
    samples = list(Counter(pixels))
    chosen = []
    for count, index in sorted(quantized.getcolors(), reverse=True):
        average = palette[index * 3:index * 3 + 3]
        actual = min(samples, key=lambda pixel: sum((a - b) ** 2 for a, b in zip(pixel, average)))
        if all(sum((a - b) ** 2 for a, b in zip(actual, old)) > 400 for old in chosen):
            chosen.append(actual)
        if len(chosen) == 16:
            break
    result[str(direction)] = ['#' + ''.join(f'{channel:02x}' for channel in pixel) for pixel in chosen]
(root / 'src/artwork-palettes.json').write_text(json.dumps(result, indent=2) + '\n')

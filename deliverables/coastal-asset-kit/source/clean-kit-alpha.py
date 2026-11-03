"""Remove detached gutter contamination while preserving original source files."""
from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter

for name in ['tree-coastal-pine', 'tree-almond', 'tree-banyan']:
    output = Path('deliverables/coastal-asset-kit/png') / (name + '.png')
    image = Image.open(output).convert('RGBA')
    width, height = image.size
    pixels = image.getchannel('A').filter(ImageFilter.MaxFilter(9)).tobytes()
    seen = bytearray(width * height)
    largest = []
    for start in range(width * height):
        if seen[start] or pixels[start] <= 24:
            continue
        queue = deque([start])
        seen[start] = 1
        component = []
        while queue:
            current = queue.popleft()
            component.append(current)
            x = current % width
            for neighbor in (current-width, current+width, current-1 if x else -1, current+1 if x<width-1 else -1):
                if 0 <= neighbor < width*height and not seen[neighbor] and pixels[neighbor] > 24:
                    seen[neighbor] = 1
                    queue.append(neighbor)
        if len(component) > len(largest):
            largest = component
    keep = bytearray(width * height)
    for current in largest:
        keep[current] = 1
    alpha = bytearray(image.getchannel('A').tobytes())
    for current in range(width * height):
        if not keep[current]:
            alpha[current] = 0
    image.putalpha(Image.frombytes('L', (width, height), bytes(alpha)))
    image.save(output)

from PIL import Image, ImageDraw

BG = (79, 70, 229, 255)      # indigo-600
CARD = (255, 255, 255, 255)
RING = (249, 115, 22, 255)   # orange-500
TEXT = (79, 70, 229, 255)

def draw_calendar(size, pad_ratio=0.12):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    pad = int(size * pad_ratio)
    r = int(size * 0.22)
    d.rounded_rectangle([pad, pad, size-pad, size-pad], radius=r, fill=BG)

    card_pad = int(size * 0.20)
    card_top = int(size * 0.32)
    card_bottom = size - int(size * 0.16)
    cr = int(size * 0.08)
    d.rounded_rectangle([card_pad, card_top, size-card_pad, card_bottom], radius=cr, fill=CARD)

    header_bottom = card_top + int(size * 0.10)
    d.rectangle([card_pad, card_top, size-card_pad, header_bottom], fill=RING)
    d.rounded_rectangle([card_pad, card_top, size-card_pad, header_bottom], radius=cr, fill=RING)
    d.rectangle([card_pad, card_top + cr, size-card_pad, header_bottom], fill=RING)

    ring_r = int(size * 0.022)
    ring_y = card_top - int(size*0.02)
    for fx in (0.34, 0.66):
        cx = int(size*fx)
        d.rounded_rectangle([cx-ring_r, ring_y-int(size*0.05), cx+ring_r, ring_y+int(size*0.05)], radius=ring_r, fill=(255,255,255,255))

    dot_r = int(size * 0.028)
    xs = [card_pad + int((size-2*card_pad)*fx) for fx in (0.22, 0.5, 0.78)]
    ys = [header_bottom + int((card_bottom-header_bottom)*fy) for fy in (0.35, 0.7)]
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            if i == 1 and j == 2:
                continue
            d.ellipse([x-dot_r, y-dot_r, x+dot_r, y+dot_r], fill=BG if (i+j) % 2 == 0 else RING)
    return img

for size, name in [(192, "pwa-192x192.png"), (512, "pwa-512x512.png")]:
    draw_calendar(size).save(f"public/{name}")

# maskable: smaller safe-zone icon centered with more padding
draw_calendar(512, pad_ratio=0.22).save("public/maskable-icon-512x512.png")

# apple touch icon: no transparency, flat background
apple = Image.new("RGBA", (180,180), (0,0,0,0))
apple.paste(draw_calendar(180, pad_ratio=0.06), (0,0), draw_calendar(180, pad_ratio=0.06))
bgflat = Image.new("RGB", (180,180), BG[:3])
bgflat.paste(apple, (0,0), apple)
bgflat.save("public/apple-touch-icon.png")

print("icons generated")

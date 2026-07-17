"""
원본 픽셀아트 시트(20개 캐릭터, 4행 5열)를 자르고:
1. 배경 회색 → 투명 처리
2. 실제 캐릭터의 bounding box 찾아 정사각 캔버스 중앙에 배치
3. 배경을 하얀색으로 채운 정사각 PNG로 저장
"""
from PIL import Image
from pathlib import Path

SRC = Path("/Users/ascentkorea/.claude/image-cache/6641c2c7-7152-4084-8e51-119af80f64c1/12.png")
OUT_DIR = Path("/Users/ascentkorea/git/oppa-lab/frontend/public/avatars")
OUT_DIR.mkdir(parents=True, exist_ok=True)

ROWS = 4
COLS = 5

# 최종 저장 이미지 사이즈 (정사각)
FINAL_SIZE = 256
# 캐릭터가 캔버스에서 차지할 비율 (0.7 = 70%, 여백 15%씩)
CHAR_RATIO = 0.75
# 배경 색상 (하얀색)
BG_COLOR = (255, 255, 255, 255)


def detect_bg_color(img: Image.Image) -> tuple:
    """왼쪽 상단 코너 픽셀을 배경색으로."""
    return img.getpixel((0, 0))[:3]


def make_bg_transparent(cell: Image.Image, bg: tuple, tolerance: int = 15) -> Image.Image:
    """배경색과 비슷한 픽셀을 투명하게."""
    cell = cell.convert("RGBA")
    px = cell.load()
    w, h = cell.size
    br, bgn, bb = bg
    for y in range(h):
        for x in range(w):
            r, g, b, _a = px[x, y]
            if abs(r - br) < tolerance and abs(g - bgn) < tolerance and abs(b - bb) < tolerance:
                px[x, y] = (0, 0, 0, 0)
    return cell


def bbox_of_visible(img: Image.Image) -> tuple[int, int, int, int]:
    """투명하지 않은 픽셀의 bounding box 반환."""
    return img.getbbox()  # (x0, y0, x1, y1)


def center_on_white(char_img: Image.Image, final_size: int, char_ratio: float) -> Image.Image:
    """
    캐릭터를 하얀 정사각 캔버스 중앙에 배치.
    캐릭터는 char_ratio 비율로 스케일링 (nearest neighbor로 픽셀아트 유지).
    """
    bbox = bbox_of_visible(char_img)
    if bbox is None:
        # 완전 빈 이미지, 그냥 하얀색 정사각형
        return Image.new("RGBA", (final_size, final_size), BG_COLOR)

    cropped = char_img.crop(bbox)
    cw, ch = cropped.size

    # 캐릭터의 가장 긴 변이 (final_size * char_ratio)에 맞도록 스케일
    target = int(final_size * char_ratio)
    if cw >= ch:
        new_w = target
        new_h = max(1, int(ch * target / cw))
    else:
        new_h = target
        new_w = max(1, int(cw * target / ch))

    resized = cropped.resize((new_w, new_h), Image.NEAREST)

    # 하얀 캔버스에 중앙 배치
    canvas = Image.new("RGBA", (final_size, final_size), BG_COLOR)
    x = (final_size - new_w) // 2
    y = (final_size - new_h) // 2
    canvas.paste(resized, (x, y), resized)  # resized의 알파채널을 마스크로 사용
    return canvas


def main():
    img = Image.open(SRC).convert("RGBA")
    W, H = img.size
    bg = detect_bg_color(img)
    print(f"source: {W}x{H}, bg: {bg}")

    cw = W // COLS
    ch = H // ROWS

    for r in range(ROWS):
        for c in range(COLS):
            idx = r * COLS + c + 1
            box = (c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)
            cell = img.crop(box)
            transparent = make_bg_transparent(cell, bg)
            centered = center_on_white(transparent, FINAL_SIZE, CHAR_RATIO)
            out_path = OUT_DIR / f"char{idx:02d}.png"
            centered.save(out_path)
            print(f"saved {out_path.name}")


if __name__ == "__main__":
    main()

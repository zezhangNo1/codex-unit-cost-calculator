#!/usr/bin/env python3
"""
裁掉截图底部的空白。

Chrome headless 的 --screenshot 只按 --window-size 截固定区域，页面比它矮时
底部会留一大片背景色。这个脚本从下往上找到最后一行「非背景色」像素，据此裁切。

用法：
  python3 marketing/trim-shots.py marketing/screenshots/*.png
  python3 marketing/trim-shots.py --pad 40 marketing/screenshots/01-*.png
  python3 marketing/trim-shots.py --bg 247,247,245 shot.png

注意：默认按「底边中点」的像素当背景色。如果截图下方还有别的色块
（例如 iframe 容器露出的白底），这个参考就取错了，页面的正常底色会被
误判成内容。这种情况用 --bg 显式指定页面背景色，并先把多余的色块裁掉。
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops


def parse_bg(s: str) -> tuple[int, int, int]:
    parts = [int(x) for x in s.split(",")]
    if len(parts) != 3:
        raise ValueError("--bg 需要 R,G,B 三个值")
    return (parts[0], parts[1], parts[2])


def trim(
    path: Path, pad: int = 24, tol: int = 6, bg_override: tuple[int, int, int] | None = None
) -> tuple[int, int, int, int]:
    im = Image.open(path).convert("RGB")
    w, h = im.size

    bg = bg_override if bg_override is not None else im.getpixel((w // 2, h - 1))
    bg_img = Image.new("RGB", (w, h), bg)

    diff = ImageChops.difference(im, bg_img).convert("L")
    # 容差二值化：低于 tol 的视为背景
    mask = diff.point(lambda p: 255 if p > tol else 0)

    bbox = mask.getbbox()
    if not bbox:
        return (0, 0, w, h)

    _, top, _, bottom = bbox
    new_h = min(h, bottom + pad)
    if new_h >= h:
        return (0, 0, w, h)

    im.crop((0, 0, w, new_h)).save(path)
    return (w, h, w, new_h)


def main() -> int:
    args = sys.argv[1:]
    pad = 24
    bg_override = None
    while args and args[0].startswith("--"):
        if args[0] == "--pad":
            pad = int(args[1])
            args = args[2:]
        elif args[0] == "--bg":
            bg_override = parse_bg(args[1])
            args = args[2:]
        else:
            print(f"未知参数 {args[0]}", file=sys.stderr)
            return 2

    if not args:
        print("用法: trim-shots.py [--pad N] [--bg R,G,B] <png...>", file=sys.stderr)
        return 2

    for pattern in args:
        for path in sorted(Path().glob(pattern)) if "*" in pattern else [Path(pattern)]:
            if not path.exists():
                print(f"跳过（不存在）{path}")
                continue
            ow, oh, nw, nh = trim(path, pad, bg_override=bg_override)
            tag = "已裁剪" if nh < oh else "无空白"
            print(f"{tag}  {path}  {ow}x{oh} -> {nw}x{nh}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

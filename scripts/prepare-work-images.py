"""Export the portfolio's original project screenshots as web-sized WebP files.

Requires Pillow. Usage: python scripts/prepare-work-images.py --source "Gio Portfolio"
Composition, cropping and parallax belong to the React/CSS layout; these exports
only resize and compress the supplied originals, preserving their proportions.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


SOURCES = {
    "serenity": [
        "Serenity UI/creation_3813912538.png",
        "Serenity UI/creation_3813912167.png",
    ],
    "avancode": [
        "Avancode Website/Challenge Landing Page.png",
        "Avancode Website/mockups/behance/avancode-website-01-portada-final-v01.png",
        "Avancode Website/Mobile Website Screenshot.png",
    ],
    "noches": [
        "Noches de Gloria/Dashboard Overview.png",
        "Noches de Gloria/Events Dashboard.png",
        "Noches de Gloria/Events Screen.png",
    ],
    "compra": [
        "CompraToday/Homepage marketplace.png",
        "CompraToday/Home Page.png",
    ],
    "papeleta": [
        "La Papeleta/Festival Event Screen.png",
        "La Papeleta/Reservations Screen.png",
        "La Papeleta/Login Screen.png",
    ],
    "cuba": [
        "Cuba Adventures/Travel Adventures Landing Page-1.png",
        "Cuba Adventures/Travel Experience Page.png",
        "Cuba Adventures/Travel Destination Screen.png",
    ],
    "socia": [
        "SocIA/Landing Page.png",
        "SocIA/Chat interface screen.png",
    ],
    "habana": [
        "Habana Cultral/News Page.png",
        "Habana Cultral/Article Page.png",
    ],
    "qhay": [
        "QHay/Dark Price Comparison Screen.png",
        "QHay/Price Comparison Screen.png",
        "QHay/Product Recommendation Screen.png",
    ],
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    args = parser.parse_args()
    output = Path(__file__).resolve().parents[1] / "src/assets/images"
    # Check every source before exporting, so missing material is explicit.
    for files in SOURCES.values():
        for name in files:
            if not (args.source / name).is_file():
                raise FileNotFoundError(args.source / name)
    total = 0
    for project, files in SOURCES.items():
        for index, name in enumerate(files, 1):
            with Image.open(args.source / name) as original:
                image = ImageOps.exif_transpose(original)
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                target = output / f"work-{project}-{index}.webp"
                image.save(target, "WEBP", quality=84, method=6)
                total += target.stat().st_size
        print(f"{project}: {len(files)} original views exported")
    print(f"Total: {total / 1024:.0f} KiB")


if __name__ == "__main__":
    main()

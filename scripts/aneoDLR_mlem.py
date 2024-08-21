import subprocess
import xml.etree.ElementTree as ET
import re
import os
import shutil
from PIL import Image

INKSCAPE_PATH = "C:\\Program Files\\Inkscape\\bin\\inkscape.com"

ET.register_namespace('', "http://www.w3.org/2000/svg")

dlr = ET.parse("./neoDLR/neoDLR_blep.svg")
tongue = dlr.find(".//{http://www.w3.org/2000/svg}g/*[@id='tongue_mover']")

os.mkdir("temp")
for offset in range(0, 10):
    tongue.set("transform", f"translate(0 {offset*-32})")
    dlr.write(f"temp/temp.svg")
    subprocess.run(f"{INKSCAPE_PATH} .\\temp\\temp.svg --export-area-page -w 256 -h 256 --export-filename=.\\temp\\aneoDLR_mlem{offset:02d}.png")

frames = []
for offset in range(10):
    frames.append(Image.open(f"temp/aneoDLR_mlem{offset:02d}.png"))

frame_order = [frames[f] for f in (8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8)]

frames[9].save(
    "aneoDLR_mlem.apng",
    save_all=True,
    append_images=[f for f in frame_order],
    loop=0,
    duration=(160, 16, 16, 16, 16, 16, 16, 16, 16, 160, 16, 16, 16, 16, 16, 16, 16, 16),
)

shutil.rmtree("temp")

from PIL import Image
from PIL.ExifTags import TAGS as EXIF_TAGS
from os.path import join, basename, dirname, realpath
import os
import sys
import time

def get_img_data(img):
    try:
        img_exif = img._getexif()
        return {
            EXIF_TAGS[k]: v for k, v in img_exif.items() if k in EXIF_TAGS
        }
    except AttributeError:
        return {}

def process_image(img_name):
    # This is called when the image is uploaded
    # Look for the image in tmp/
    if not os.path.exists(join(dirname(__file__), "../tmp/%s" % img_name)):
        # If the image isn't there, just return
        print("ERROR: File DNE")
        return

    # Image comes in as <postID>.<hash>.jpg/png
    (postID, hash, fileExt) = img_name.split('.')

    img = Image.open(join(dirname(__file__), "../tmp/%s" % img_name))
    metadata = get_img_data(img)

    ORIENTATIONS = [None, None, None, -180, None, None, -90, None, -270]

    degree_to_rotate = ORIENTATIONS[metadata.get('Orientation', 0)]
    if degree_to_rotate is not None:
        img = img.rotate(degree_to_rotate, expand = True)
    width, height = img.size
    larger_dimension = width if width > height else height
    scales = [ x / larger_dimension for x in [ 320.0, 640.0, 960.0, 1280.0 ] ]
    new_sizes = [ (int(round(width * s)), int(round(height * s))) for s in scales ]
    new_images = [ img.resize(size, Image.LANCZOS) for size in new_sizes ]
    widths = [ img.size[0] for img in new_images ]

    try:
        os.mkdir(join(dirname(__file__), "../static/images/%s" % postID))
    except OSError:
        pass

    new_files = [ join(dirname(__file__), '../static/images/%s' % postID, '%s.%d.jpg' % (hash, w)) for w in widths ]

    for img, name in zip(new_images, new_files):
        img.save(name, optimize=True, progressive=True)
        img.close()
    os.remove(join(dirname(__file__), "../tmp/%s" % img_name))

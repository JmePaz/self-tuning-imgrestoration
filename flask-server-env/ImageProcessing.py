import base64
from PIL import Image
import io
import cv2
import numpy as np
import matplotlib.pyplot as plt
import piexif as p

#from skimage import color


def conv2Img(base64_enc: str):
    base64_dec = base64.b64decode(base64_enc)
    buf = io.BytesIO(base64_dec)
    img = Image.open(buf).convert('L')
    return img

def np2Img(img_array):
    return Image.fromarray(img_array)

def conv2B64(img):
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return base64.b64encode(buf.getvalue()).decode('utf-8')

def show(img):
    img.show()

def clip_color(channel, vmin=0, vmax=255): 
  c_mm = (channel.min(), channel.max())
  channel = (channel-c_mm[0])/(c_mm[1]-c_mm[0])
  channel *= (vmax - vmin)
  return channel

def _asUInt8(img):
    img = np.floor(clip_color(img, 0, 1) * 255)
    return img.astype(np.uint8)

"""
   Convolutional Filter
"""

#=========KERNEL=============
KERNELS = dict()

KERNELS['Sharpen'] = np.asarray([
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
    ])

KERNELS['BoxBlur'] = np.ones((3,3))*(1/9)

KERNELS['GausBlur'] = np.asarray([
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
])*(1/16)
KERNELS['Emboss'] = np.asarray([
     [-1, 0, 0],
     [0, 0, 0],
    [0, 0, 1]
    ])

KERNELS['SampleBlur'] = np.ones((5, 5))/25

#=========/KERNEL=============


from scipy import signal

class FilterImg:
  # convolve filter
  @classmethod
  def conv_filter(cls, img, spec_kernel):
    return signal.convolve2d(img, spec_kernel, mode='same', boundary='fill')
    
  @classmethod
  def save_info(cls, path, img_buff, enc_kernel):
    new_img = Image.open(img_buff)
    exif = ExifImg()
    return exif.save_exifInfo(path, new_img, enc_kernel)



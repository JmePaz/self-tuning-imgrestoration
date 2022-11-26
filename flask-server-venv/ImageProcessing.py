import base64
from PIL import Image
import io
import cv2
import numpy as np
import matplotlib.pyplot as plt
import piexif as p
import sys

from skimage import color
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
    img = np.rint(clip_color(img, 0, 1) * 255)
    return img.astype(np.uint8)

def kernel_tostr(kernel: np.ndarray):
    lst = []
    for x in kernel:
      str_arr = np.array2string(x)
      lst.append(str_arr[1:-1].strip())
    return "\n".join(lst)

def str_to_kernel(str_arr):
    data_lst = []
    for elem in str_arr.split('\n'):
      curr_lst = list(map(float, elem.strip().split()))
      data_lst.append(curr_lst)
    return np.array(data_lst)

def extract_exifData(img):
    if ('exif' not in img.info):
        return (None, None)

    exif_info = p.load(img.info['exif'])
    if('Exif' not in exif_info):
        return (None, None)
    elif 37510 not in exif_info['Exif'] :
        return (None, None)
    
    raw_data = exif_info['Exif'][37510].decode("utf-8").split("@\n")
    
    try:
        filter_type = raw_data[0]
        kernel = str_to_kernel(raw_data[1])
    except Exception as e:
        return (None, None)

    return (filter_type, kernel)

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


KERNELS['SampleBlur'] = np.ones((5, 5))/25

#=========</KERNEL>=============


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


#===============Sequence Function ===========
def applyFilter(imgB64, spec_k):
    img = conv2Img(imgB64)
    img = FilterImg.conv_filter(np.array(img)/1.0, spec_k)
    img = Image.fromarray(_asUInt8(img))
    return conv2B64(img)

from skimage import img_as_float
from skimage import restoration
rng = np.random.default_rng()

def restore_img(img, spec_kernel):
    img += 0.1 * img.std() * rng.standard_normal(img.shape)
    deconvolved, stat = restoration.unsupervised_wiener(img, spec_kernel)
    return deconvolved

def image_restoration(img, spec_kernel):
    img = np.asarray(img)
    img = clip_color(img, 0, 1)
    img = img_as_float(img)
    restored = restore_img(img, spec_kernel) 
    restored = clip_color(restored, 0, 1)
    restored_img = Image.fromarray(_asUInt8(restored)) 
    return restored_img
#=============================================
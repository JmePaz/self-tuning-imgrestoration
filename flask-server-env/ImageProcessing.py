import base64
from PIL import Image
import io

def conv2Img(base64_enc: str):
    base64_dec = base64.b64decode(base64_enc)
    buf = io.BytesIO(base64_dec)
    img = Image.open(buf).convert('L')
    return img

def conv2B64(img):
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return base64.b64encode(buf.getvalue()).decode('utf-8')

def show(img):
    img.show()
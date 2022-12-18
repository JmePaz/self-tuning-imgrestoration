from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import sys
import ImageProcessing as imp
import numpy as np

app =  Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"

#Members API Route
@app.route('/test', methods=['GET', 'POST'])
@cross_origin()
def members():
    return {"test": ["Member1", "Member2", "Member3"],
     "status": True, "remarks":"Working"
    }

#Image Filter API Route
@app.route('/filterRequest', methods=['GET', 'POST'])
@cross_origin()
def filterRequest():
    #fetching data
    data = request.json
    if(data['filterType'] == 'default' or data['filterStrength'] == 0 or data['img']==""):
        return jsonify({'status':False})

    #data vars
    filter_type = data['filterType']
    filter_strength = data['filterStrength']

    # img processing
    spec_k = imp.KERNELS[filter_type] * (filter_strength)
    filtered_b64Img = imp.applyFilter(data['img'], spec_k)
    spec_k_enc = imp.kernel_tostr(spec_k)

    #returning as json object
    return jsonify({'status': True, 'mod-img': filtered_b64Img
    ,'spec-kernel':spec_k_enc})

#Image Grayscale API Route
@app.route('/grayscaleRequest', methods=['GET', 'POST'])
@cross_origin()
def grayscaleRequest():
    #data request
    data = request.json
    if(data['img']==""):
        return jsonify({'status':False})
    
    # img processing
    img = imp.conv2Img(data['img'])
    gray_img = img.convert('L')
    B64_img = imp.conv2B64(gray_img)

    #returning as json object
    return jsonify({'status': True, 'mod-img':B64_img})


#Image Restoration API Route
@app.route('/restorationRequest', methods=['GET', 'POST'])
@cross_origin()
def restorationRequest():
    #data request
    data = request.json
    if(data['img']=="" or data['kernel']==""):
        return jsonify({'status':False, 'remarks':'Image is empty'})

     # img processing
    try:
        img = imp.conv2Img(data['img']).convert('L')
    except Exception as e:
        return jsonify({'status':False, 'remarks':'Image encoded error'})

    kernel = imp.str_to_kernel(data['kernel'])
    restored =  imp.image_restoration(img, kernel)
    restored_imgB64 = imp.conv2B64(restored)

    return jsonify({'status':True, 'restored-img': restored_imgB64})

#RUN APP
if __name__ == '__main__':
    app.run(debug=True)
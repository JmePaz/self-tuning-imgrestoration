from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

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

    filter_type = data['filterType']
    filter_strength = data['filterStrength']

    # img processing
    img = imp.conv2Img(data['img'])
    spec_k = imp.KERNELS[filter_type] * (filter_strength * 10)
    img = imp.FilterImg.conv_filter(np.array(img), spec_k)
    img = imp._asUInt8(img) 
    img = imp.np2Img(img)
    b64_img = imp.conv2B64(img)
    return jsonify({'status': True, 'mod-img':b64_img})

#Image Grayscale API Route
@app.route('/grayscaleRequest', methods=['GET', 'POST'])
@cross_origin()
def grayscaleRequest():
    data = request.json
    if(data['img']==""):
        return jsonify({'status':False})
    
    # img processing
    img = imp.conv2Img(data['img'])
    b64_img = imp.conv2B64(img)
    return jsonify({'status': True, 'mod-img':b64_img})

if __name__ == '__main__':
    app.run(debug=True)
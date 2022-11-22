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
    b64_img = imp.conv2B64(img)

    #returning as json object
    return jsonify({'status': True, 'mod-img':b64_img})


#RUN APP
if __name__ == '__main__':
    app.run(debug=True)
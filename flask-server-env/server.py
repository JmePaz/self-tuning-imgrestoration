from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import ImageProcessing as imp

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
def test():
    data = request.json
    if(data['filterType'] == 'default'):
        return jsonify({'status':False})

    img = imp.conv2Img(data['img'])
    b64_img = imp.conv2B64(img)
    return jsonify({'status': True, 'mod-img':b64_img})

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify

app = Flask(__name__)


#Test API Route
@app.route("/test")
def test():
    return {"status": [True, True, True]}



if __name__ == "__main__":
    app.run(debug=True)
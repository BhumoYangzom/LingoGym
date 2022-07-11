from PIL import Image
from flask import Flask,request,jsonify
import offline
# from feature_extractor import FeatureExtractor


app = Flask(__name__)

@app.route("/api/query_img", methods=["POST"])
def index():
    if request.method == "POST":
        queryImage = request.files["query_img"]
        img = Image.open(queryImage.stream)
        # print (offline.get_feature_QI(img))
        print (offline.get_similar_img(img))
        # print(type(img))
        print ("-------------------------------------------------")
        return {"201": "Image recieved"}
    
    else:
        return {"500": "Error"}

    

       



if __name__ == '__main__':
    app.run(debug=True)
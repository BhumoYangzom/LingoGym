
# from distutils.errors import LinkError
# from xml.sax.handler import feature_external_ges
# from pandas import array
# from psutil import users
import pyrebase
from PIL import Image
from feature_extractor import FeatureExtractor
from pathlib import Path
import numpy as np
import ast
import requests
from io import BytesIO

"""
Two main tasks
- put_feature_data to firebase, only done during image data set update (CMS)
- get_similar_img returns the most similar image (tags, link, score)
"""

config = {
      'apiKey': "AIzaSyBazt2gIqkdNpvU8e4t_oJD-BNq0tOtowM",
      'authDomain': "cs5990sp22.firebaseapp.com",
      'databaseURL': "https://cs5990sp22-default-rtdb.firebaseio.com",
      'projectId': "cs5990sp22",
      'storageBucket': "cs5990sp22.appspot.com",
      'messagingSenderId': "622617212731",
      'appId': "1:622617212731:web:a9cf206aa33159a292291e",
      'measurementId': "G-0YHMPKFEQW"
      }
  
def put_feature_data():
	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	imgs = db.child("Imgs").get()
	fe = FeatureExtractor()	
	all_features = {}
	for e in imgs.each():
		individual_feature = {}
		val = e.val()
		key = e.key()
		link = val["link"]
		feature = fe.extract(link)
		c = 0
		for x in feature:
			individual_feature[c] = x
			c = c+1
		print(key)
		all_features[key] = str(individual_feature) 
	db.child ("Features").set(all_features)

def get_feature_data():
	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	feature_list = []
	features = db.child("Features").get()
	for f in features.each():
		val = f.val()
		# feature values from dictionary values
		val_dict = ast.literal_eval(val)

		# change to float
		values = [float(x) for x in list(val_dict.values())]
		# ndarray of feature vectors
		f_vec = np.array(values)

		# add to feature list for similarity computation
		feature_list.append(f_vec)
	return feature_list

def get_feature_QI (img_qi):
  fe = FeatureExtractor()
  return fe.extractQI(img_qi)
  

def get_similar_img(img_QI):
	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	imgs = db.child("Imgs").get()
	image_data = []
	for e in imgs.each():
		val = e.val()
		# key = e.key()
		# print(val)
		# link = val["link"]
		image_data.append(val)
	feature_set = get_feature_data()
	feature_QI =  get_feature_QI(img_QI) # feature_set[0]
	dists = np.linalg.norm(feature_set-feature_QI, axis=1)
	rank_index = np.argsort(dists)[:1]
	scores = [(dists[id], image_data[id]) for id in rank_index]
	scores[0][1].update({"scores":scores[0][0]})
	# print("***** Scores ", scores[0][1])
	# the most similar image to the QI
	return scores[0][1]
 
# if __name__ == '__main__':
	# firebase = pyrebase.initialize_app(config)
	# db = firebase.database()
	# get_similar_img()

# worked locally
def similarity_rt(imgs):
	dict_s = feature_data_rt(imgs)
	query = dict_s[0]
	print(type(query))
	print(type(dict_s))
	dists = np.linalg.norm(dict_s-query, axis=1)
	rank_index = np.argsort(dists)[:2]
	scores = [(dists[id]) for id in rank_index]
	target = scores[0][1]
	# target["scores"] = scores[0][0]
	# target.update({"scores":scores[0][0]})
	# print("***** Scores ", target)
	return target
	
def feature_data_rt(imgs):
	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	fe = FeatureExtractor()
	dict = []
	for e in imgs.each():
		val = e.val()
		key = e.key()
		link = val["link"]
		feature = fe.extract(link)
		dict.append(feature)
	return dict

# worked for firebase
def similar_img():
	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	fe = FeatureExtractor()
	feature_list = []
	features = db.child("Features").get()
	for f in features.each():
		val = f.val()
		# feature values from dictionary values
		val_dict = ast.literal_eval(val)

		# change to float
		values = [float(x) for x in list(val_dict.values())]
		# ndarray of feature vectors
		f_vec = np.array(values)

		# add to feature list for similarity computation
		feature_list.append(f_vec)
	
	query = feature_list[0]
	dists = np.linalg.norm(feature_list-query, axis=1)
	rank_index = np.argsort(dists)[:2]
	scores = [(dists[id]) for id in rank_index]
	print("***** Scores ", scores)
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
#import scrape_mission_to_mars
import pymongo

db_name = "restaurants_data"

app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/"+db_name)

restaurants_data = mongo.db.collection.find_one()
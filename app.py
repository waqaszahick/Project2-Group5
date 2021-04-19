from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
#import scrape_mission_to_mars
import pymongo
import pandas as pd
import json
db_name = 'restaurants_data'
# Create an instance of Flask
app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/"+db_name)


# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database

    restaurants_data = mongo.db.collection.find_one()
    print(restaurants_data)
    # Return template and data
    return render_template("index.html", vacation=restaurants_data)

@app.route("/data")
def data():

    return render_template("data.html")

@app.route("/visual")
def visual():

    return render_template("visual.html")

@app.route("/resturants")
def getAllRestaurants():
    restaurants_data = mongo.db.collection.find_one()
    print(restaurants_data)
    names = restaurants_data['name']
    #df = pd.read_sql(query, conn)
    names = pd.DataFrame(names)
    names = names.to_json(orient="records")
    #names = json.dumps(list(names))
    return names

@app.route("/states")
def getAllStates():
    restaurants_data = mongo.db.collection.find_one()
    states = restaurants_data['state']
    states = pd.DataFrame(states)
    states = states.drop_duplicates()
    states = states.to_json(orient="records")
    
    return states


@app.route("/cities")
def getAllCities():
    restaurants_data = mongo.db.collection.find_one()
    cities = restaurants_data['city']
    cities = pd.DataFrame(cities)
    cities = cities.drop_duplicates()
    cities = cities.to_json(orient="records")
    return cities

@app.route("/cuisine")
def getAllCuisine():
    restaurants_data = mongo.db.collection.find_one()
    cuisine = restaurants_data['Cuisine Type']
    cuisine = pd.DataFrame(cuisine)
    cuisine = cuisine.drop_duplicates()
    cuisine = cuisine.to_json(orient="records")
    return cuisine


@app.route("/countByState")
def countByState():
    restaurants_data = mongo.db.collection.find_one()
    
    data = pd.DataFrame(restaurants_data)
    data_cnt = list(data.groupby(['state']).count()['city'])
    
    data_cnt = json.dumps(data_cnt)
    return data_cnt

@app.route("/countByCity")
def countByCity():
    restaurants_data = mongo.db.collection.find_one()
    
    data = pd.DataFrame(restaurants_data)
    data_cnt = list(data.groupby(['city']).count()['state'])
    
    data_cnt = json.dumps(data_cnt)
    return data_cnt

@app.route("/coordinates")
def coordinates():
    restaurants_data = mongo.db.collection.find_one()
    
    data = pd.DataFrame(restaurants_data)
    data_cdt = list(data['coordinates'])#list(data.groupby(['city']).count()['state'])
    data_lst = []
    for dt in data_cdt:
        data_lst.append({'lat':dt.split(', ')[0],'lon':dt.split(', ')[1]})
    data_lst = json.dumps(data_lst)
    return data_lst


@app.route("/fullData")
def fulldata():
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    
    data_lst = []
    for j in range(len(data['state'])):
        new_dt = {}
        a=0
        for rw in data:
            if a > 0:
                if rw == 'coordinates':
                    new_dt[rw] = list(data[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data[rw])[j]
            a+=1
        data_lst.append(new_dt)
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst


@app.route("/filterByCity/<city>")
def filterbycity(city):
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    data_gb = data.groupby(['city'])
    data_group = data_gb.get_group(city)
    
    data_lst = []
    for j in range(len(data_group['state'])):
        new_dt = {}
        a=0
        for rw in data_group:
            if a > 0:
                if rw == 'coordinates':
                    new_dt[rw] = list(data_group[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data_group[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data_group[rw])[j]
            a+=1
        data_lst.append(new_dt)
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst


@app.route("/filterByState/<state>")
def filterbystate(state):
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    data_gb = data.groupby(['state'])
    data_group = data_gb.get_group(state)
    data_lst = []
    for j in range(len(data_group['state'])):
        new_dt = {}
        a=0
        for rw in data_group:
            if a > 0:
                if rw == 'coordinates':
                    new_dt[rw] = list(data_group[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data_group[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data_group[rw])[j]
            a+=1
        data_lst.append(new_dt)
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst


@app.route("/filterByName/<name>")
def filterbyname(name):
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    data_gb = data.groupby(['name'])
    data_group = data_gb.get_group(name)
    
    data_lst = []
    for j in range(len(data_group['state'])):
        new_dt = {}
        a=0
        for rw in data_group:
            if a > 0:
                if rw == 'coordinates':
                    new_dt[rw] = list(data_group[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data_group[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data_group[rw])[j]
            a+=1
        data_lst.append(new_dt)
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst

@app.route("/filterByCuisine/<cuisine>")
def filterbycuisine(cuisine):
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    data_gb = data.groupby(['Cuisine Type'])
    data_group = data_gb.get_group(cuisine)
    
    data_lst = []
    for j in range(len(data_group['state'])):
        new_dt = {}
        a=0
        for rw in data_group:
            if a > 0:
                if rw == 'coordinates':
                    new_dt[rw] = list(data_group[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data_group[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data_group[rw])[j]
            a+=1
        data_lst.append(new_dt)
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst

@app.route("/filterByRating/<rating>")
def filterbyrating(rating):
    print(rating)
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    #data_gb = data.groupby(['rating'])
    #data_group = data_gb.get_group(cuisine)
    
    data_lst = []
    for j in range(len(data['state'])):
        new_dt = {}
        a=0
        for rw in data:
            if a > 0 and float(data['rating'][j])<=float(rating) and float(data['rating'][j])>(float(rating)-1):
                if rw == 'coordinates':
                    new_dt[rw] = list(data[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data[rw])[j]
                data_lst.append(new_dt)
            a+=1
        
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst

@app.route("/filterByUbereats/<ubereats>")
def filterbyubereats(ubereats):
    print(ubereats)
    restaurants_data = mongo.db.collection.find_one()
    #cities = restaurants_data['city']
    data = pd.DataFrame(restaurants_data)
    #data_gb = data.groupby(['rating'])
    #data_group = data_gb.get_group(cuisine)
    
    data_lst = []
    for j in range(len(data['state'])):
        new_dt = {}
        a=0
        for rw in data:
            if a > 0 and data['ubereats'][j]=='True':
                if rw == 'coordinates':
                    new_dt[rw] = list(data[rw])[j].split(', ')
                elif rw == 'opening_hours':
                    new_dt[rw] = list(data[rw])[j][-5:-1]
                else:
                    new_dt[rw] = list(data[rw])[j]
                data_lst.append(new_dt)
            a+=1
        
    data_lst = json.dumps(data_lst)
    #cities = cities.to_json(orient="records")
    return data_lst



if __name__ == "__main__":
    app.run(debug=True)

import pymongo
import pandas as pd

db_name = "restaurants_data"

myclient = pymongo.MongoClient('mongodb://localhost:27017')
if not db_name in myclient.list_database_names():
    mydb = myclient[db_name]

mydb = myclient[db_name]
mycol = mydb["collection"]

rest_data = pd.read_csv('resources/data.csv')

rest_data_dct = {}
a = 0
for dt in rest_data:
    if a>0:
        rest_data_dct[dt] = []
        for j in range(len(rest_data[list(rest_data)[0]])):
            rest_data_dct[dt].append(str(rest_data[dt][j]))
    a+=1

x = mycol.insert_one(rest_data_dct)
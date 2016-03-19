# -*- coding: utf-8 -*-

import codecs
from collections import OrderedDict
import pymongo
import glob

client = pymongo.MongoClient("localhost", 27017, connect=False)

db = client.politesch


listing = glob.glob('*.csv')
for filename in listing:
    if filename.find('CANDIDATOS') >= 0:
        continue
    collection = filename.replace('.csv', '').lower()

    db[collection].drop()

    file = codecs.open(filename,'r','utf-8')

    lines = file.readlines()
    headers = lines[0].strip().split(',')
    content = lines[1:]
    counter = len(headers)
    data = []
    #print collection
    for doc in content:
        elems = doc.strip().split(',')
        temp = [(headers[cnt].lower(),elems[cnt].lower())for cnt in range(counter)]
        #temp.append((u'NOMBRE_COMPLETO'.lower(), u'CONGRESISTA'.lower()))
        temp = OrderedDict(temp)
        temp['nombre_completo'] = "%s %s" % (temp['nombres'], temp['apellidos'])
        #data.append(temp)
        id = db[collection].insert(temp)
        #db[collection].update({'_id':id},{'$set':{'nombre_completo': }})
        #print id

# -*- coding: utf-8 -*-

import codecs
from collections import OrderedDict
import pymongo

client = pymongo.MongoClient("localhost", 27017, connect=False)

db = client.politesch
candidatos = db.candidatos

file = codecs.open('CANDIDATOS_CONGRESO.csv','r','utf-8')

lines = file.readlines()
headers = lines[0].strip().split(',')
content = lines[1:]
counter = len(headers)
data = []
for doc in content:
    elems = doc.strip().split(',')
    temp = [(headers[cnt].lower(),elems[cnt].lower())for cnt in range(counter)]
    temp.append((u'CARGO_AUTORIDAD'.lower(), u'CONGRESISTA'.lower()))
    temp = OrderedDict(temp)
    #data.append(temp)
    candidatos.insert(temp)
#print data
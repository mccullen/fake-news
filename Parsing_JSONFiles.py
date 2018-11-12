#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Oct 17 12:27:03 2018

@author: Navidmms
"""

import json
from os import listdir
from os.path import isfile,join

import csv

directory = 'News Articles'

onlyFiles = [f for f in listdir(directory) if isfile(join(directory,f))]

News_article = {}
News_article['Title'] = [];
News_article['Description'] = [];
News_article['Publish_time'] = [];
News_article['Source_URL'] = [];
News_article['Authors'] = [];
#News_article['Text'] = [];
News_Seconds = {}
News_Seconds['Title']  = []
News_Seconds['Text'] = []

Titles = []
Texts = []
title = []
text = []
desci = []
author = []
time = []
url = []


for j in range(1,len(onlyFiles)):
 
 if(j%20==0):
     print("20 More Analyzed!")
    

 with open(directory+"/"+ onlyFiles[j]) as json_data:
    d = json.load(json_data)
    try:
      #Text        = d['text']
      #News_article['Text'].append(Text)
      text        = d['text']
      title_second = d['title']
      News_Seconds['Text'].append(text)
      News_Seconds['Title'].append(title_second)
      Titles.append(title_second)
      Texts.append(text)
      Title       = d['meta_data']['og']['title']
      Description = d['meta_data']['og']['description']
      desci.append(Description)
      Publish_time = d['publish_date']
      Source_URL   = d['source_url']
      Authors      = d['authors']
      #print(d['meta_data'])
      title.append(Title )
      time.append(Publish_time)
      url.append(Source_URL)
      author.append(Authors)
    except:
         print("this row had issue"+ str(j))
         pass

    
#with open('dict.csv', 'wb') as csv_file:
#    writer = csv.writer(csv_file)
#    for value in News_Seconds.values():
#       writer.writerow([value])   
with open('title.csv','w') as csv_file:
  fieldnames = ['Title','Text']  
  writer = csv.DictWriter(csv_file,fieldnames=fieldnames)
  writer.writeheader()
  for row in range(0,len(Titles)):
      writer.writerow({'Title':Titles[row],'Text':Texts[row]})

with open('Complete.csv','w') as csv_file:
  fieldnames = ['Title','Description','Time','URL','Author']  
  writer = csv.DictWriter(csv_file,fieldnames=fieldnames)
  writer.writeheader()
  for row in range(0,len(title)):
      writer.writerow({'Title':title[row],'Description':desci[row],'Time':time[row],'URL':url[row],'Author':author[row]})
#import csv
#
#with open('names.csv', 'w') as csvfile:
#    fieldnames = ['first_name', 'last_name']
#    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#
#    writer.writeheader()
#    writer.writerow({'first_name': 'Baked', 'last_name': 'Beans'})
#    writer.writerow({'first_name': 'Lovely', 'last_name': 'Spam'})
#    writer.writerow({'first_name': 'Wonderful', 'last_name': 'Spam'})
    

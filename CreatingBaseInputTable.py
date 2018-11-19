# -*- coding: utf-8 -*-
"""
Created on Mon Nov 19 12:31:18 2018

@author: Navid
"""

# Analyzing Current Data Table 

import pandas as pd
import numpy as np
import csv

from tqdm import tqdm_notebook

from textblob import TextBlob

# Importing the Excel Having the Claim Links List

Excel_File_Claimed = pd.read_excel('Copy of Fake News List and Claim.xlsx','ClaimLinks')
Excel_File_Fake1   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList1')
Excel_File_Fake2   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList2')

input_user = pd.read_csv('Complete (1).csv')

Claimed_Links = [Excel_File_Claimed.Sites][0].tolist()
Fake_List_1   = [Excel_File_Fake1.Name][0].tolist()
Fake_List_2   = [Excel_File_Fake2.Name][0].tolist()
titles        = [input_user.Title][0].tolist()
texts         = [input_user.Text][0].tolist()
descriptions  = [input_user.Description][0].tolist()
urls          = [input_user.URL][0].tolist()
authors       = [input_user.Author][0].tolist()
PotentialFake = []
NumberAuthor  = []
TitleLength   = []
FullTextLength = []
TextLength    = []
CapitalWordTitle = []
NumberOfQuotes = []
Title_sentiment = []
Text_sentiment = []
Description_sentiment = []



for i in range(len(input_user)):
    

#Potential Fake

 if any(input_user.URL[i] in u for u in Claimed_Links):
    PotentialFake.append(0)
 elif any(input_user.URL[i] in u for u in Fake_List_1) or any(input_user.URL[i] in u for u in Fake_List_2):
    PotentialFake.append(1)
 else:
    PotentialFake.append(0.5)

#Number of Authors
 if input_user.Author[i] == '[]':
     NumberAuthor.append(0)
 else:
     NumberAuthor.append(len(input_user.Author[i].split(',')))
    
#Title Length
 TitleLength.append( len(input_user.Title[i].split()))
#Text Length
 FullTextLength.append(len(input_user.Text[i].split()))
#Description Length
 TextLength.append( len(input_user.Description[i].split()))
#CapitalWordTitle
 if any(s.isupper() for s in input_user.Title[i].split()):
    CapitalWordTitle.append(1)
 else:
    CapitalWordTitle.append(0)

#NumberOfQuotes
 NumberOfQuotes.append( input_user.Text[i].count('@'))

#Title Sentiment 
 Title_sentiment.append(TextBlob(input_user.Title[i]).sentiment.polarity)
#Text Sentiment
 Text_sentiment.append(TextBlob(input_user.Text[i]).sentiment.polarity)
#Description Sentiment 
 Description_sentiment.append(TextBlob(input_user.Description[i]).sentiment.polarity)

with open('input.csv', mode='a', newline="") as input_file:
            #Title,Text,Description,Author,URL,AdvertisementCount,UpdatedDate
            input_writer = csv.writer(input_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            input_writer.writerow([self.title, self.text, self.description, self.author, self.url, self.adCount, self.updatedDate])

Output_DataFrame = pd.DataFrame([titles],[texts],[descriptions],[authors],[urls],[PotentialFake],[NumberAuthor]
                                ,[TitleLength],[FullTextLength],[TextLength],[CapitalWordTitle],[NumberOfQuotes]
                                ,[Title_sentiment],[Text_sentiment],[Description_sentiment],columns=['Title','Text','Description'
                                ,'Author','URL','PotentialFake','NumberAuthor','TitleLength','FullTextLength','TextLength'
                                ,'CapitalWordTitle','NumberOfQuotes','Title_sentiment','Text_sentiment','Description_sentiment'])
Output_DataFrame.to_csv('Fake-news-original.csv',sep=',',index=False)
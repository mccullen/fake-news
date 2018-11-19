# -*- coding: utf-8 -*-
"""
Created on Mon Nov 19 12:31:18 2018

@author: Navid
"""

# Analyzing Current Data Table 

import pandas as pd
import numpy as np

from tqdm import tqdm_notebook

from textblob import TextBlob

# Importing the Excel Having the Claim Links List

Excel_File_Claimed = pd.read_excel('Copy of Fake News List and Claim.xlsx','ClaimLinks')
Excel_File_Fake1   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList1')
Excel_File_Fake2   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList2')

Claimed_Links = [Excel_File_Claimed.Sites][0].tolist()
Fake_List_1   = [Excel_File_Fake1.Name][0].tolist()
Fake_List_2   = [Excel_File_Fake2.Name][0].tolist()
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

input_user = pd.read_csv('Complete (1).csv')

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
 Title_sentiment.append(TextBlob(input_user.Title[0]).sentiment.polarity)
#Text Sentiment
 Text_sentiment.append(TextBlob(input_user.Text[0]).sentiment.polarity)
#Description Sentiment 
 Description_sentiment.append(TextBlob(input_user.Description[0]).sentiment.polarity)


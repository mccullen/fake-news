# -*- coding: utf-8 -*-
"""
Created on Mon Nov 19 10:52:25 2018

@author: Navid
"""

import pandas as pd
import numpy as np

from tqdm import tqdm_notebook

from textblob import TextBlob

# Importing the Excel Having the Claim Links List

Excel_File_Claimed = pd.read_excel('Copy of Fake News List and Claim.xlsx','ClaimLinks')
Excel_File_Fake1   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList1')
Excel_File_Fake2   = pd.read_excel('Copy of Fake News List and Claim.xlsx','FakeNewsList2')

# Importing the Input File

input_user = pd.read_csv('input.csv')

Claimed_Links = [Excel_File_Claimed.Sites][0].tolist()
Fake_List_1   = [Excel_File_Fake1.Name][0].tolist()
Fake_List_2   = [Excel_File_Fake2.Name][0].tolist()

#Potential Fake

if any([input_user.URL][0].tolist() in u for u in Claimed_Links):
    PotentialFake = 0
elif any([input_user.URL][0].tolist() in u for u in Fake_List_1) or any([input_user.URL][0].tolist() in u for u in Fake_List_2):
    PotentialFake = 1
else:
    PotentialFake = 0.5

#Number of Authors
    
#Title Length
TitleLength = len(input_user.Title[0].split())
#Text Length
FullTextLength = len(input_user.Text[0].split())
#Description Length
TextLength  = len(input_user.Description[0].split())
#CapitalWordTitle
if any(s.isupper() for s in input_user.Title[0].split()):
    CapitalWordTitle = 1
else:
    CapitalWordTitle = 0

#NumberOfQuotes
NumberOfQuotes = input_user.Text[0].count('@')

#Title Sentiment 
Title_sentiment = TextBlob(input_user.Title[0]).sentiment.polarity
#Text Sentiment
Text_sentiment = TextBlob(input_user.Text[0]).sentiment.polarity
#Description Sentiment 
Description_sentiment = TextBlob(input_user.Description[0]).sentiment.polarity








        
    
    


    

        







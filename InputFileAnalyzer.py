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

Excel_File = pd.read_excel('Copy of Fake News List and Claim.xlsx')


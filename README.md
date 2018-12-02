TODO:
- Add processing for url using beautiful soup to classify articles during presentation
- Collapse: Use weka to show statistics, association rules, etc. on the side of the visualization
- Add ability to select attributes to consider.
- Remove points, zoom in/out
- Add filters collapse
- In report, mention bad-data in data-cleaning, etc.
- Are you assuming that the data will have ground truth (fakeness measure) associated with it?  How?  How will you measure emotional content, etc?


input: Title,Text,Description,Author,URL,AdvertisementCount,UpdatedDate
output: Title,Text,Description,Author,URL,AdvertisementCount,UpdatedData,PotentialFake(0=not trustworthy, 0.5=unknown, 1=trustworthy),NumberAuthor,TitleLength,TextLength,FullTextLength,CapitalWordTitle,NumberOfQuotes,TotalSentiment,EmotionalLanguage
 - No AuthorTrustworthiness

git add -A # Add all files
git commit -m "My commit message"
git push

git pull


pip install -r requirements.txt
python app.py
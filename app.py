# pip install beautifulsoup4
import http.server
import socketserver
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import cgi
import json
from urllib.parse import urlparse, parse_qs
import csv
#import urllib.request

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    url = ""
    author = ""
    json_response = {}
    article = ""

    def do_POST(self):
        self.__set_post_data()
        if self.persist == True:
            self.__persist()
        self.__respond()
        return

    def __set_post_data(self):
        print(self.path)
        content_length = int(self.headers['Content-Length'])
        post_data = str(self.rfile.read(content_length).decode("utf-8"))
        parsed = parse_qs(post_data)
        print(post_data)
        self.title = parsed["title"][0].strip()
        self.text = parsed["text"][0].strip()
        self.description = parsed["description"][0].strip()
        self.author = parsed["author"][0].strip()
        self.url = parsed["url"][0].strip()
        self.adCount = int(parsed["adCount"][0])
        self.updatedDate = int(parsed["updateDate"][0])
        self.persist = bool(parsed["persist"][0])
        print(self.persist)
        print(self.url)
        print(self.author)

    def __respond(self):
        self.json_response = {"hello": self.url}
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(self.json_response).encode())
    
    def __persist(self):
#Title,Text,Description,Author,URL,AdvertisementCount,PotentialFake,NumberAuthor,TitleLength,TextLength,FullTextLength,CapitalWordTitle,NumberOfQuotes,TotalSentiment,EmotionalLanguage,UpdatedDate
        with open('input.csv', mode='a', newline="") as input_file:
            #Title,Text,Description,Author,URL,AdvertisementCount,UpdatedDate
            input_writer = csv.writer(input_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            input_writer.writerow([self.title, self.text, self.description, self.author, self.url, self.adCount, self.updatedDate])
        with open('fake-data.csv', mode='a', newline="") as input_file:
            input_writer = csv.writer(input_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            input_writer.writerow([self.title, self.text, self.description, self.author, self.url, self.adCount, self.updatedDate, ])
        



Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()

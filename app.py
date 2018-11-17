# pip install beautifulsoup4
import http.server
import socketserver
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import cgi
import json
from urllib.parse import urlparse, parse_qs
import urllib.request

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    url = ""
    author = ""
    json_response = {}
    article = ""

    def do_POST(self):
        self.__set_post_data()
        self.__respond()
        return

    def __set_post_data(self):
        print(self.path)
        content_length = int(self.headers['Content-Length'])
        post_data = str(self.rfile.read(content_length).decode("utf-8"))
        parsed = parse_qs(post_data)
        print(post_data)
        self.url = parsed["url"][0]
        self.author = parsed["author"][0]
        print(self.url)
        print(self.author)

    def __respond(self):
        with urllib.request.urlopen(self.url) as response:
            html = response.read()
            print(html)
        self.json_response = {"hello": self.url}
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(self.json_response).encode())


Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
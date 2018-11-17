import http.server
import socketserver
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import cgi

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        print(self.path)
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        print(post_data)

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
import http.server
import socketserver
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler
import cgi
import json

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        print(self.path)
        content_length = int(self.headers['Content-Length'])
        post_data = str(self.rfile.read(content_length).decode("utf-8"))
        print(post_data)
        data = {"hello": post_data}
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
        return

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
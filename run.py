#!/usr/bin/env python3
"""
Student Expense Tracker - Local Web Server Runner
Runs a lightweight local web server and automatically opens the application in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

DEFAULT_PORT = 8000

def find_available_port(start_port):
    import socket
    port = start_port
    while port < start_port + 100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
            port += 1
    return start_port

def run_server():
    # Change working directory to the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    port = find_available_port(DEFAULT_PORT)
    url = f"http://127.0.0.1:{port}"

    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # Disable caching for seamless local development
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            super().end_headers()

        def log_message(self, format, *args):
            # Cleaner terminal logs
            sys.stdout.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")

    print("=" * 60)
    print(" 🎓  Student Expense Tracker - Local Development Server")
    print("=" * 60)
    print(f" • Serving files from: {script_dir}")
    print(f" • Local URL:          {url}")
    print(" • Press Ctrl+C in this terminal to stop the server.")
    print("=" * 60)

    # Open browser automatically
    webbrowser.open(url)

    try:
        with socketserver.TCPServer(("127.0.0.1", port), CustomHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Server stopped by user. Goodbye!")
        sys.exit(0)

if __name__ == '__main__':
    run_server()

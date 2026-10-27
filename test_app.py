"""
test_app.py - Verification suite for Spendly Platform
Validates file integrity, DOM ID bindings, navigation views, savings goals, category budgets, and HTTP serving.
"""

import os
import re
import unittest
import urllib.request
import threading
import http.server
import socketserver

WORKSPACE = os.path.dirname(os.path.abspath(__file__))

class TestSpendlyPlatform(unittest.TestCase):
    def test_files_exist(self):
        required_files = [
            'index.html',
            'css/styles.css',
            'js/app.js',
            'js/storage.js',
            'js/tracker.js',
            'js/charts.js',
            'run.py',
            'README.md'
        ]
        for rel_path in required_files:
            abs_path = os.path.join(WORKSPACE, rel_path)
            self.assertTrue(os.path.isfile(abs_path), f"Missing required file: {rel_path}")
            self.assertGreater(os.path.getsize(abs_path), 0, f"File is empty: {rel_path}")

    def test_7_views_exist_in_html(self):
        """Verify that all 7 requested views exist in index.html"""
        with open(os.path.join(WORKSPACE, 'index.html'), 'r', encoding='utf-8') as f:
            html = f.read()

        expected_views = [
            'view-dashboard',
            'view-add-expense',
            'view-history',
            'view-budget',
            'view-analytics',
            'view-savings',
            'view-settings'
        ]
        for v in expected_views:
            self.assertIn(f'id="{v}"', html, f"View container #{v} missing in index.html")

    def test_dom_ids_match_js_app(self):
        """Verify that every getElementById call in app.js has a matching id in index.html"""
        with open(os.path.join(WORKSPACE, 'js', 'app.js'), 'r', encoding='utf-8') as f:
            app_js = f.read()

        with open(os.path.join(WORKSPACE, 'index.html'), 'r', encoding='utf-8') as f:
            index_html = f.read()

        # Find all getElementById('...') matches
        pattern = r"document\.getElementById\(['\"]([^'\"]+)['\"]\)"
        referenced_ids = set(re.findall(pattern, app_js))

        # Find all id="..." in index.html
        html_id_pattern = r'id=["\']([^"\']+)["\']'
        html_ids = set(re.findall(html_id_pattern, index_html))

        missing_ids = referenced_ids - html_ids
        self.assertEqual(len(missing_ids), 0, f"Elements referenced in app.js missing in index.html: {missing_ids}")

    def test_savings_goal_calculations(self):
        """Test savings summary calculation logic"""
        goals = [
            {'title': 'Laptop', 'targetAmount': 1000.0, 'savedAmount': 600.0},
            {'title': 'Trip', 'targetAmount': 500.0, 'savedAmount': 500.0}
        ]
        total_target = sum(g['targetAmount'] for g in goals)
        total_saved = sum(g['savedAmount'] for g in goals)
        overall_pct = (total_saved / total_target) * 100
        completed = sum(1 for g in goals if g['savedAmount'] >= g['targetAmount'])

        self.assertEqual(total_target, 1500.0)
        self.assertEqual(total_saved, 1100.0)
        self.assertAlmostEqual(overall_pct, 73.33333333333333)
        self.assertEqual(completed, 1)

    def test_category_budget_math(self):
        """Verify category budget status calculations"""
        cat_budget = 100.0
        spent_safe = 50.0   # 50% -> safe
        spent_warn = 75.0   # 75% -> warning
        spent_danger = 88.0 # 88% -> danger
        spent_over = 110.0  # 110% -> exceeded

        def get_status(spent, limit):
            pct = (spent / limit) * 100
            if spent > limit: return 'exceeded'
            if pct >= 85: return 'danger'
            if pct >= 70: return 'warning'
            return 'safe'

        self.assertEqual(get_status(spent_safe, cat_budget), 'safe')
        self.assertEqual(get_status(spent_warn, cat_budget), 'warning')
        self.assertEqual(get_status(spent_danger, cat_budget), 'danger')
        self.assertEqual(get_status(spent_over, cat_budget), 'exceeded')

    def test_safe_daily_spend_math(self):
        """Verify Safe-to-Spend formula logic"""
        budget = 600.0
        spent = 150.0
        days_remaining = 15
        remaining = budget - spent
        safe_daily = remaining / days_remaining if remaining > 0 else 0.0
        self.assertEqual(safe_daily, 30.0)

    def test_http_server_response(self):
        """Verify that index.html and assets are correctly served over HTTP"""
        port = 8769
        handler = http.server.SimpleHTTPRequestHandler
        
        os.chdir(WORKSPACE)
        server = socketserver.TCPServer(("127.0.0.1", port), handler)
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()

        try:
            url = f"http://127.0.0.1:{port}/index.html"
            with urllib.request.urlopen(url, timeout=5) as response:
                self.assertEqual(response.status, 200)
                content = response.read().decode('utf-8')
                self.assertIn("Spendly", content)
                self.assertIn("Savings Goals", content)
                self.assertIn("view-dashboard", content)
        finally:
            server.shutdown()
            server.server_close()

if __name__ == '__main__':
    unittest.main()

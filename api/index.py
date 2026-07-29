import os
import sys

# Add backend and project root to Python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, 'backend')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application

_application = get_wsgi_application()

_migrated = False

def app(environ, start_response):
    global _migrated
    if not _migrated:
        _migrated = True
        try:
            from django.core.management import call_command
            call_command('migrate', interactive=False)
        except Exception as e:
            print(f"Lazy migration error: {e}")
    return _application(environ, start_response)

handler = app

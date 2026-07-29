import os
import sys

# Ensure backend and root directories are in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, 'backend')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application

_django_app = get_wsgi_application()

# Run database migrations on container initialization
try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
except Exception as e:
    print(f"Migration log: {e}")

def app(environ, start_response):
    path = environ.get('PATH_INFO', '')
    # Normalize Vercel internal path prefixes if present
    if path.startswith('/api/index.py'):
        environ['PATH_INFO'] = path.replace('/api/index.py', '') or '/'
    elif path.startswith('/api/index'):
        environ['PATH_INFO'] = path.replace('/api/index', '') or '/'

    return _django_app(environ, start_response)

handler = app

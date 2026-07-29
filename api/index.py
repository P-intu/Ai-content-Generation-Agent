import os
import sys

# Add the backend directory to sys.path so Django apps can be found
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from core.wsgi import application

app = application

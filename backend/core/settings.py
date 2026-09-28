from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-4p6(cs++r!_@)t=@=(tfqf6ikwfnl$lx1g1u%sqnfdgn2vkabr"

DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party apps
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    # Local apps
    "sourcing",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Doit rester en première position
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# Database
import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("MYSQL_DATABASE", "trafiq_db"),
        "USER": os.environ.get("MYSQL_USER", "trafiq_user"),
        "PASSWORD": os.environ.get("MYSQL_PASSWORD", "trafiq_password"),
        "HOST": os.environ.get("DB_HOST", "db"),
        "PORT": os.environ.get("DB_PORT", "3306"),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "sourcing" / "static",
]

# Custom User Model
AUTH_USER_MODEL = "sourcing.User"

# Configuration Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTING = {
    'TITLE': 'Trafiq Sourcinf API',
    'DESCRIPTION': 'Documentation de l\'API REST pour Trafiq Sourcing Agent',
    'VERSION': '1.0.O',
    'SERVE_INCLUDE_SCHEMA': False,
}

# Configuration JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Configuration CORS (pour le dev React)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Personnalisation de l'interface Djando-Admin
JAZZMIN_SETTINGS = {

    
    # 1. Remplis site_header pour réactiver le menu haut
    "site_title": "Trafiq Sourcing Admin",
    "site_header": "Trafiq Sourcing",
    "welcome_sign": "Bienvenue sur l'interface d'administration Trafiq Sourcing",
    "copyright": "Trafiq Sourcing Ltd",

    # Fichier JS
    "custom_js": "js/custom_admin.js",

    # Fichier CSS
    "custom_css": "css/custom_admin.css",
    
    # Logo
    "site_logo": "img/logo-trafiq.jpeg",
    "site_logo_classes": "img-fluid",
    
    # 2. Configure le User Menu (menu déroulant sous le nom d'utilisateur)
    "use_google_fonts_muli": True,
    "user_avatar": None,
    "usermenu_links": [
        {"name": "Déconnexion", "url": "admin:logout", "icon": "fas fa-sign-out-alt"},
        {"name": "App React", "url": "http://localhost:5173", "new_window": True, "icon": "fas fa-arrow-left"},
    ],
    
    # 3. Top Menu (barre du haut)
    "topmenu_links": [
        {"name": "App React", "url": "http://localhost:5173", "new_window": True},
        {"name": "Déconnexion", "url": "admin:logout", "icon": "fas fa-sign-out-alt"},
    ],

    # Navigation
    "show_ui_builder": False,
    "show_sidebar": True,
    "navigation_expanded": True,


    # Icônes FontAwesome
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "sourcing.Company": "fas fa-building",
        "sourcing.Campaign": "fas fa-bullhorn",
        "sourcing.SourceProfile": "fas fa-filter",
        "sourcing.Signal": "fas fa-bolt",
        "sourcing.Contact": "fas fa-address-card",
        "sourcing.ProspectScore": "fas fa-star",
        "sourcing.Activity": "fas fa-tasks",
        "sourcing.ModelVersion": "fas fa-code-branch",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
}

JAZZMIN_UI_TWEAKS = {
    "navbar": "navbar-white navbar-light",  # Navbar blanche avec texte sombre visible
    "theme": "default",
    "sidebar": "sidebar-dark-primary",
    "accent": "accent-primary",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },
    "brand_colour": "navbar-primary",
    "sidebar_nav_small_text": False,
    "depth_one": False,
    "sidebar_nav_compact_flat": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_child_indent": True
}

# Redirection après une connexion réussie
LOGIN_REDIRECT_URL = "/admin/"

# Redirige directement vers la page de connexion de l'admin après la déconnexion
LOGOUT_REDIRECT_URL = "/admin/login/"
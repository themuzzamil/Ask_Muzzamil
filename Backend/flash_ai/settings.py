from starlette.config import Config
from starlette.datastructures import Secret

try:
    config = Config(".env")

except FileNotFoundError:
    config = Config()

GEMINI_API_KEY = config("GEMINI_API_KEY",cast=str)
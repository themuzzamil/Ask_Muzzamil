import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown
from flash_ai import settings
from fastapi import FastAPI,HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel

class ChatRequest(BaseModel):
    prompt: str

# class ChatResponse(BaseModel):
#     response: str
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Fastapi app started...")
    
    yield
    


app = FastAPI(lifespan=lifespan,
              title="Zia Mart User Service...",
              version='1.0.0'
              )
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as necessary
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # This allows all headers
)

@app.get('/')
async def root():
   return{"welcome to zia mart","order_service"}




def to_markdown(text):
    text = text.replace("•", "  *")
    return Markdown(textwrap.indent(text, "> ", predicate=lambda _: True))

API_KEY = str(settings.GEMINI_API_KEY)

genai.configure(api_key=API_KEY)

for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        m

model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])
chat


@app.post("/chat")
async def chatbot(request: ChatRequest):
    try:
        response = chat.send_message(request.prompt)
        print(response.text)
          # Ensure this is correct
        return {"text": response.text}  # Return as a dictionary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# response = model.generate_content("What are the most popular cities of pakistan ?",stream=True)
# for chunk in response:
#     print(chunk.text)
#     print("_" * 80)

# response.candidates    

    

    

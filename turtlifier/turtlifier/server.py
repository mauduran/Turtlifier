import os
from fastapi.datastructures import UploadFile
from fastapi.params import File, Form
from starlette.background import BackgroundTask
import uvicorn
import webbrowser
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

templates = Jinja2Templates(directory="front")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/turtlify")
async def turtlify(file: UploadFile = File(...), separator: str = Form(...)):
    # Get filename
    file_name = file.filename
    # Remove ext from filename
    file_name_no_ext = file_name.split('.')[0]
    # Read incoming file
    data = await file.read()
    file_text = []
    
    # Parse csv
    #read data line by line
    for line in data.splitlines():
        file_text.append(str(line, 'utf-8'))

    # Generate Turtl

    # Write turtl into temp file
    output_file_name = file_name_no_ext + ".ttl"

    f = open(output_file_name, "w")
    f.write('\n'.join(file_text))
    f.close()

    return FileResponse(
        path= output_file_name, 
        media_type="text/turtle", 
        filename=output_file_name, 
        background=BackgroundTask(cleanup, output_file_name)
    )

@app.get("/{full_path:path}")
async def webApp(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def cleanup(file_name: str):
    os.remove(file_name)
    
def start():
    """Launch server for turtlifier"""
    uvicorn.run("turtlifier.server:app", host="0.0.0.0", port=8000, reload=True)
    webbrowser.open_new("http://localhost:8000")
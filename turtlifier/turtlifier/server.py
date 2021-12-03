import os
import uvicorn
import webbrowser
from fastapi import FastAPI, Request
from starlette.background import BackgroundTask
from fastapi.datastructures import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from turtlifier.config import Config
from turtlifier.converter import Converter

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
async def turtlify(
    file: UploadFile = File(...), 
    separator: str = Form(...), 
    # has_titles: bool = Form(...),
    # prefix_data: str = Form(...),
    # prefix_data_uri: str = Form(...),
    # prefix_predicate: str = Form(...),
    # prefix_predicate_uri: str = Form(...),
    # title_line_num: int = Form(...),
    # data_line_num: int = Form(...),
    # first_line_to_process: int = Form(...),
    # last_line_to_process: int = Form(...),
    ):
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
    turtlified_text = Converter.turtlify(file_text)

    # Write turtl into temp file
    output_file_name = file_name_no_ext + ".ttl"

    f = open(output_file_name, "w")
    f.write(turtlified_text)
    f.close()

    return FileResponse(
        path= output_file_name, 
        media_type="text/turtle", 
        filename=output_file_name, 
        background=BackgroundTask(cleanup, output_file_name)
    )

@app.get("/config")
def get_config():
    return Config.get_config()

@app.get("/{full_path:path}")
async def webApp(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def cleanup(file_name: str):
    os.remove(file_name)
    
def start():
    """Launch server for turtlifier"""
    webbrowser.open_new("http://localhost:8000")
    uvicorn.run("turtlifier.server:app", host="0.0.0.0", port=8000, reload=True)
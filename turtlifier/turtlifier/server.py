############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################

import uvicorn
import webbrowser
import os
from os import path
from fastapi import FastAPI, Request, HTTPException
from starlette.background import BackgroundTask
from fastapi.datastructures import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from turtlifier.config import Config
from turtlifier.converter import Converter
from turtlifier.file_utils import FileUtils

# Instanciation of API server
app = FastAPI()

# Set front as the directory to grab html templates from (only contains the index.html with is the form to turtlify)
templates = Jinja2Templates(
    directory=path.join(path.dirname(__file__), 'front'))

# Cors Config to allow API calls from different origins
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make static dir static for it to be accesible for the UI application.
app.mount(
    "/static",
    StaticFiles(directory=path.join(path.dirname(__file__), 'static')),
    name="static")


@app.post("/turtlify")
async def turtlify(
    file: UploadFile = File(...),
    separator: str = Form(...),
    has_titles: bool = Form(...),
    prefix_data: str = Form(...),
    prefix_data_uri: str = Form(...),
    prefix_predicate: str = Form(...),
    prefix_predicate_uri: str = Form(...),
    title_line_num: int = Form(...),
    data_line_num: int = Form(...),
    last_line_to_process: int = Form(...),
):
    """Endpoint that receives the files and params from the client and returns turtl version of the file."""
    try:
        # Remove extension from filename
        file_name_no_ext = file.filename.split('.')[0]

        # Read incoming file
        data = await file.read()

        # Treat the data file, generate headers if they are not defined and return array of lines
        file_text = Converter.read_csv_and_setup(
            file_string=data,
            separator=separator,
            has_titles=has_titles,
            title_line_num=title_line_num,
            data_line_num=data_line_num,
            last_line_to_process=last_line_to_process
        )
        
        # Generate Turtl. Requires the file_text, separator and prefizes for data and predicate.
        turtlified_text = Converter.turtlify(
            file_text=file_text,
            separator=separator,
            dataPrefix=(prefix_data, prefix_data_uri),
            predPrefix=(prefix_predicate, prefix_predicate_uri)
        )

        # Write turtl into temp file
        output_file_name = file_name_no_ext + ".ttl"

        FileUtils.write_file(
            output_file_name=output_file_name,
            file_content=turtlified_text
        )

        # Return generated file to client
        return FileResponse(
            # Location where temp file is stored
            path=output_file_name,
            # Define mime type of file
            media_type="text/turtle",
            filename=output_file_name,
            # After sending the response, run background task to delete the temporary file
            background=BackgroundTask(FileUtils.file_cleanup, output_file_name)
        )
    except Exception as error:
        # Should any error be encountered, return error response to client.
        raise HTTPException(
            status_code=400,
            detail=repr(error)
        )


@app.get("/config")
def get_config():
    """Get default configuration for turtlifier from config.ini"""
    try:
        return Config.get_config()
    except:
        # Return error response message to client if config.ini is not able to be parsed.
        raise HTTPException(
            status_code=400, detail="Could not read config from config.ini")


@app.get("/{full_path:path}")
async def webApp(request: Request):
    """Return Web UI when any other route  is hit."""
    return templates.TemplateResponse("index.html", {"request": request})


def start():
    """Launch server for turtlifier"""

    # Define port to run app on.
    port = 8000

    # Open new tab in browser with the web app.
    webbrowser.open_new(f"http://localhost:{port}")

    # Launch and execute server
    uvicorn.run(
        "turtlifier.server:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        workers=1
    )

# Start server if the file is executed 
if __name__ == "__main__":
    start()

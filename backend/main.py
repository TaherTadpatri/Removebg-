from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from PIL import Image
import io
import numpy as np
from core.inference import P3Net 
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
model = P3Net()  # Instantiate your P3Net model
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.post("/remove_background/")
async def remove_background(file: UploadFile = File(...)):
    """
    Removes the background from an uploaded image using P3Net and returns the processed image directly.
    Without saving.
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

        result =  await model.predict(file)  
        print(type(result))
        result_image = Image.fromarray(result.astype('uint8')) # ensure it is uint8
        
        # # Save the processed image to a byte stream
        output_stream = io.BytesIO()
        result_image.save(output_stream, "PNG")
        output_stream.seek(0)  

       
        return Response(content=output_stream.read(), media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
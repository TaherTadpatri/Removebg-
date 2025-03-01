# Image Background Removal with P3M-Net

This project demonstrates a web application for removing backgrounds from images using a FastAPI backend and a ReactJS frontend. The backend utilizes the P3M-Net model for image segmentation and background removal.

## Project Description

The application allows users to upload an image through a ReactJS frontend. The image is sent to a FastAPI backend, where the P3M-Net model processes it to remove the background. The resulting image with a transparent background is then sent back to the frontend for display.

## Technologies Used

* **Backend:**
    * FastAPI
    * P3M-Net
* **Frontend:**
    * ReactJS
   

## P3M-Net Model

P3M-Net is a deep learning model specifically designed for portrait matting. It excels at accurately separating foreground objects (typically people) from their backgrounds, even in complex scenarios. In this project, P3M-Net is used to generate an alpha matte (transparency mask) that is then used to create the final image with a transparent background.

## Setup Instructions

### Backend (FastAPI)

1.  **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd <your_repository_directory>/backend
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    venv\Scripts\activate  # Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the FastAPI server:**

    ```bash
    uvicorn main:app --reload
    ```

    (Replace `main` with your Python file name if needed.)

### Frontend (ReactJS)

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the React development server:**

    ```bash
    npm run dev
    ```

4.  **Access the application:**

    Open your web browser and navigate to `http://localhost:5173`.

## Configuration

* **Backend:**
    * Modify the `origins` list in the FastAPI `CORSMiddleware` setup (`main.py`) to include the origins of your frontend application.
    * Ensure that the P3M-Net model weights are located in the correct directory (backend/models/).
* **Frontend:**
    * Change the base URL in the `axios` requests (`ImageBackgroundRemoval.js`) to match the URL of your FastAPI backend.

## Usage

1.  Open the web application in your browser.
2.  Click the "Choose File" button to select an image.
3.  Click the "Remove Background" button.
4.  The processed image with a transparent background will be displayed below the button.

## Dependencies

* See `backend/requirements.txt` for backend dependencies.
* See `frontend/package.json` for frontend dependencies.

## Notes

* Ensure that the P3M-Net model weights are correctly placed in the backend directory.
* Configure CORS settings in the FastAPI backend to allow requests from your ReactJS frontend.
* Raise a issue if stuck somewhere
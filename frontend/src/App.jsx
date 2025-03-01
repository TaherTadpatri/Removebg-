import React, { useState } from 'react';
import axios from 'axios';

function ImageBackgroundRemoval() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setProcessedImage(null); // Clear previous image
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/remove_background/', formData, {
                responseType: 'blob', // Important: Receive binary data
            });

            const imageUrl = URL.createObjectURL(response.data);
            setProcessedImage(imageUrl);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error('Error uploading image:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('An error occurred during upload.');
            }
            setProcessedImage(null);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Remove Background</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {processedImage && (
                <div>
                    <h2>Processed Image:</h2>
                    <img src={processedImage} alt="Processed" style={{ maxWidth: '500px' }} />
                </div>
            )}
        </div>
    );
}

export default ImageBackgroundRemoval;
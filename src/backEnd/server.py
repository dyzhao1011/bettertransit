from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure uploads folder exists

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)  # Save the file

    # Parse CSV
    try:
        df = pd.read_csv(file_path)
        expected_columns = {"datetime", "day", "ridership"}

        # Check if CSV has the correct columns
        if expected_columns.issubset(df.columns):
            df = df[["datetime", "day", "ridership"]]  # Ensure correct column order
            data = df.to_dict(orient="records")  # Convert to list of dictionaries
            return jsonify({"message": "File uploaded successfully", "data": data})
        else:
            return jsonify({"error": "Invalid CSV format. Expected columns: datetime, day, ridership"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

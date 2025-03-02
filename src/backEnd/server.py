from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import *
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.metrics import RootMeanSquaredError
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure uploads folder exists

filepath = 0

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)  # Save the file

    global filepath
    filepath = file_path

    # Parse CSV
    try:
        df = pd.read_csv(file_path)
        expected_columns = {"datetime","ridership"}

        # Check if CSV has the correct columns
        if expected_columns.issubset(df.columns):
            df = df[["datetime", "ridership"]]  # Ensure correct column order
            data = df.to_dict(orient="records")  # Convert to list of dictionaries
            return jsonify({"message": "File uploaded successfully", "data": data})
        else:
            return jsonify({"error": "Invalid CSV format. Expected columns: datetime, day, ridership"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():
    selected_date = request.data.decode('utf-8')  # Read raw body data
    print(f"Received date: {selected_date}")  # Debugging

    df_grouped = pd.read_csv(filepath)
    df_grouped['datetime'] = pd.to_datetime(df_grouped['datetime'])  # Ensure the 'datetime' column is in datetime format

    # Extract date, hour, month-year, and day of the week separately
    df_grouped['date'] = df_grouped['datetime'].dt.date
    df_grouped['hour'] = df_grouped['datetime'].dt.hour
    df_grouped['month_year'] = df_grouped['datetime'].dt.to_period('M')  # Extract month-year for grouping
    df_grouped['day_of_week'] = df_grouped['datetime'].dt.dayofweek  # Extract day of the week (0=Monday, 6=Sunday)

    # Create a full range of dates and hours
    all_dates = pd.date_range(start=df_grouped['datetime'].min().date(), end=df_grouped['datetime'].max().date(), freq='D')
    all_hours = range(24)

    # Create a full DataFrame with all date-hour combinations
    full_data = pd.DataFrame([(date, hour) for date in all_dates for hour in all_hours], columns=['date', 'hour'])

    # Merge with original data
    df_grouped['date'] = pd.to_datetime(df_grouped['date'])  # Ensure consistency in merging
    full_data = pd.merge(full_data, df_grouped, on=['date', 'hour'], how='left')

    # Add month-year, day_of_week, and hour to full_data for grouping purposes
    full_data['month_year'] = full_data['date'].dt.to_period('M')  # Add month-year to full_data
    full_data['day_of_week'] = full_data['date'].dt.dayofweek  # Add day_of_week to full_data

    # Calculate the average ridership for each (month_year, day_of_week, hour) combination
    # Group by month_year, day_of_week, and hour, then calculate the mean ridership for each group
    monthly_weekday_hour_avg_ridership = full_data.groupby(['month_year', 'day_of_week', 'hour'])['ridership'].transform('mean')

    # Fill missing ridership values with the calculated average for that day of the week, month-year, and hour
    full_data['ridership'] = full_data['ridership'].fillna(monthly_weekday_hour_avg_ridership)

    # Replace any remaining NaN ridership values with 0
    full_data['ridership'] = full_data['ridership'].fillna(0)

    # Recreate the datetime column
    full_data['datetime'] = pd.to_datetime(full_data['date']) + pd.to_timedelta(full_data['hour'], unit='h')

    # Drop unnecessary columns
    full_data = full_data[['datetime','ridership']]

    full_data.index = full_data['datetime']
    full_data = full_data['ridership']

    # function to generate windows (lags)
    def df_to_X_y(df, window_size=23):
        df_as_np = df.to_numpy()
        X = []
        y = []
        for i in range(len(df_as_np)-window_size):
            row = [[a] for a in df_as_np[i:i+window_size]]
            X.append(row)
            label = df_as_np[i+window_size]
            y.append(label)
        return np.array(X), np.array(y)

    WINDOW_SIZE = 23
    X1, y1 = df_to_X_y(full_data, WINDOW_SIZE)
    
    num_samples = full_data.shape[0]
    train_size = int(0.70 * num_samples)  # 70% for training
    val_size = int(0.15 * num_samples)    # 15% for validation
    test_size = num_samples - train_size - val_size  # Remaining for testing

    X_train1, y_train1 = X1[:train_size], y1[:train_size]

    #fit_transofrm X_train1

    X_val1, y_val1 = X1[train_size:train_size + val_size], y1[train_size:train_size + val_size]
    X_test1, y_test1 = X1[train_size + val_size:], y1[train_size + val_size:]

    #Model
    model1 = Sequential()
    model1.add(InputLayer((5, 1)))
    model1.add(LSTM(64))
    model1.add(Dense(8, 'relu'))
    model1.add(Dense(1, 'relu'))

    cp1 = ModelCheckpoint('model1.keras', save_best_only=True, monitor='val_loss', mode='min', verbose=1)
    model1.compile(loss=MeanSquaredError(), optimizer=Adam(learning_rate=0.001), metrics=[RootMeanSquaredError()])
    model1.fit(X_train1, y_train1, validation_data=(X_val1, y_val1), epochs=10, callbacks=[cp1])


    selectedDate = datetime.strptime(selected_date, '%Y-%m-%d')
    selectedDateDay = selectedDate.strftime('%A')
    last_7_dates = np.unique(full_data.index.date)[-7:]

    day_dict = {}
    for date in last_7_dates:
        day_dict[date.strftime('%A')] = date.strftime("%Y-%m-%d")

    refDate = day_dict[selectedDateDay]

    def getDayBefore(refDate):
        refDate_obj = datetime.strptime(refDate, '%Y-%m-%d')

        # Subtract one day to get the day before
        day_before = refDate_obj - timedelta(days=1)

        # Convert the result back to a string in the same format
        day_before_str = day_before.strftime('%Y-%m-%d')
        return day_before_str
    
    filtered_df = full_data[(full_data.index.date == pd.to_datetime(refDate).date()) | (full_data.index.date == pd.to_datetime(getDayBefore(refDate)).date())]
    filtered_df = filtered_df.drop(filtered_df.index[0])
  
    lastest_data = [X_test1[len(X_test1)-1]]
    lastest_data = np.reshape(lastest_data, (1, 23, 1))


    X2, y2 = df_to_X_y(filtered_df, WINDOW_SIZE)

    #predict
    train_predictions = model1.predict(X2).flatten()
    train_results = pd.DataFrame(data={'Train Predictions':train_predictions, 'Actuals':y2})


    return jsonify({"message": "File uploaded successfully", "prediction": train_results['Train Predictions'].tolist(), "actual": train_results['Actuals'].tolist()})
    

if __name__ == "__main__":
    app.run(debug=True, port=5555)

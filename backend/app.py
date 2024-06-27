from flask import Flask, request, jsonify
import pandas as pd
import requests

app = Flask(__name__)

@app.route('/clean-csv', methods=['POST'])
def clean_csv():
    download_url = request.json['downloadURL']

    # Download the CSV file from Firebase
    response = requests.get(download_url)
    csv_file_path = 'uploaded.csv'

    with open(csv_file_path, 'wb') as f:
        f.write(response.content)

    df = pd.read_csv(csv_file_path)

    # Cleaning logic: remove rows where the "Image" column has NULL values
    df = df.dropna(subset=['Image'])

    cleaned_csv_path = 'cleaned_csv.csv'
    df.to_csv(cleaned_csv_path, index=False)

    # Return the cleaned data and a link to download the cleaned CSV
    download_link = '/download-cleaned-csv'

    return jsonify({
        'cleanedData': df.to_dict(orient='records'),
        'downloadLink': download_link,
    })

@app.route('/download-cleaned-csv', methods=['GET'])
def download_cleaned_csv():
    return app.send_static_file('cleaned_csv.csv')

if __name__ == '__main__':
    app.run(debug=True)  # Enable debugging mode for easier troubleshooting
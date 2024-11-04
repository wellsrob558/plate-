from flask import Flask, request, jsonify
from flask_cors import CORS  # Importe o CORS
import easyocr
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)  # Configura o CORS globalmente para a aplicação

reader = easyocr.Reader(['en'])

@app.route('/recognize', methods=['POST'])
def recognize_plate():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    # Ler a imagem enviada
    file = request.files['image'].read()
    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Executa o reconhecimento
    result = reader.readtext(img)
    text = " ".join([detection[1] for detection in result])

    return jsonify({"recognized_text": text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

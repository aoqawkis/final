import logging
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATA_FILE = 'bookings.json'


def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as file:
            json.dump([], file)
    with open(DATA_FILE, 'r') as file:
        return json.load(file)


def save_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


@app.route('/api/book-room', methods=['POST'])
def book_room():
    if not request.is_json:
        return jsonify({"error": "Неверный формат данных. Ожидается JSON"}), 400

    data = request.get_json()
    name = data.get('name')
    room = data.get('room')
    message = data.get('message')

    if not all([name, room, message]):
        return jsonify({"error": "Все поля обязательны для заполнения"}), 400

    bookings = load_data()
    new_booking = {"name": name, "room": room, "message": message}
    bookings.append(new_booking)
    save_data(bookings)

    app.logger.info("Бронирование успешно создано для клиента: %s, комната: %s", name, room)
    return jsonify({"success": "Бронирование успешно создано"}), 201


@app.route('/api/check-room-status', methods=['GET'])
def check_room_status():
    room = request.args.get('room')
    if not room:
        return jsonify({"error": "Не указан тип номера"}), 400

    bookings = load_data()
    booked = any(booking["room"] == room for booking in bookings)
    status = "Забронирован" if booked else "Доступен"

    app.logger.info("Статус комнаты %s проверен: %s", room, status)
    return jsonify({"room": room, "status": status}), 200


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(host='0.0.0.0', port=5000)

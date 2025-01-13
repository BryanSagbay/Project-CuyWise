from flask import Flask
from flask import jsonify


def create_app():
    app=Flask(__name__)
    return app

app = create_app()

@app.route('/camera', methods=['POST'])
def camera():
    # do something
    return jsonify({'result': 'success'}), 200
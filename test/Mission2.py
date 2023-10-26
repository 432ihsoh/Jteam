from flask import Flask, request, jsonify

# Flaskをappという変数で動かす宣言
app = Flask(__name__)

@app.route('/')
def hello():
   name = "Flask Hello World"
   return name


@app.route('/stock/detail/1', methods=['GET']) 
def stock_detail():
    item = {
        "id": 1,
        "name": "pen",
        "price": 100,
        "on_sale": True,
        "count": 100
    }
    response = {
        "status_code": 200,
        "method": "GET",
        "item": item
    }
    return jsonify(response)

@app.route('/init', methods=['PUT'])
def init():
    response = {
        "status_code": 200,
        "method": "PUT"
    }
    return jsonify(response)

@app.route('/stock/detail/2', methods=['GET'])
def handle_request():
    response_data = {
        "status_code": 404,
        "method": "GET"
    }
    return jsonify(response_data)

@app.route('/stock/detail/1', methods=['GET'])
def stock_detail_1():
    item = {
        "id": 1,
        "name": "pen",
        "price": 100,
        "on_sale": True,
        "count": 100
    }
    response = {
        "status_code": 200,
        "method": "GET",
        "item": item
    }
    return jsonify(response)
    
    
# appの実行
if __name__ == "__main__":
   app.run()
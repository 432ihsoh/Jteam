from flask import Flask, jsonify, request

app = Flask(__name__)

create_num = 1

@app.route('/')
def hello():
   name = "Flask Hello World"
   return name

@app.route('/check', methods=['GET'])
def check():
    response = {
        "status_code": 200,
        "method": "GET"
    }
    return jsonify(response)

@app.route('/init', methods=['GET', 'PUT'])
def init():
    if request.method == 'PUT':
        method = "PUT"
    else:
        method = "GET"

    response = {
        "status_code": 200,
        "method": method
    }
    return jsonify(response)

#テストケース2
@app.route('/stock/create/multiple', methods=['POST']) 
def multiple():
    response = {
        "status_code": 201,
        "method": "POST"
    }
    return jsonify(response)

#テストケース4,6
@app.route('/stock/list', methods=['GET']) 
def stock_list():
    response = {
        "status_code": 200,
        "method": "GET",
        "items": [
            {
                "id": 1,
                "name": "pen",
                "price": 100,
                "on_sale": True,
                "count": 100
            },
            {
                "id": 100,
                "name": "item_id100",
                "price": 1111,
                "on_sale": True,
                "count": 1200
            },
            {
                "id": 200,
                "name": "item_id200",
                "price": 2222,
                "on_sale": True,
                "count": 2400
            },
            {
                "id": 300,
                "name": "item_id300",
                "price": 3333,
                "on_sale": False,
                "count": 0
            }
        ]
    }
    return jsonify(response)

#テストケース7
@app.route('/purchase/create', methods=['POST']) 
def purchase_create():
    response = {
        "status_code": 201,
        "method": "POST"
    }
    return jsonify(response)

#テストケース8
@app.route('/purchase/detail/1', methods=['GET']) 
def purchase_detail_1():
    response = {
        "status_code": 200,
        "method": "GET",
        "purchase": {
            "id": 1,
            "bought_at": "2021-01-01T01:23:45",
            "staff_name": "TechFUL",
            "items": [
                {
                    "stock_id": 100,
                    "name": "item_id100",
                    "price": 1111,
                    "bought_count": 1
                },
                {
                    "stock_id": 200,
                    "name": "item_id200",
                    "price": 2222,
                    "bought_count": 5
                }
            ]
        }
    }
    return jsonify(response)

#テストケース12
@app.route('/purchase/detail/2', methods=['GET']) 
def purchase_detail_2():
    response = {
        "status_code": 404,
        "method": "GET"
    }
    return jsonify(response)

#テストケース16
@app.route('/stock/update/100', methods=['PUT']) 
def purchase_update_100():
    response = {
        "status_code": 200,
        "method": "PUT"
    }
    return jsonify(response)

if __name__ == "__main__":
   app.run()
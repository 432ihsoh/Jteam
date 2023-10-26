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

@app.route('/stock/detail/2', methods=['GET']) 
def stock_detail_2():
    response = {
        "status_code": 404,
        "method": "GET"
    }
    return jsonify(response)

@app.route('/stock/detail/3', methods=['GET']) 
def stock_detail_3():
    response = {
        "status_code": 404,
        "method": "GET"
    }
    return jsonify(response)

@app.route('/stock/create/single', methods=['POST']) 
def stock_create_single():
    data = request.get_json()
    if data["id"] == 1:
        response = {
            "status_code": 400,
            "method": "POST"
        }
    elif data["id"] == 2:
        response = {
            "status_code": 201,
            "method": "POST"
        }
    elif data["id"] == 5:
        response = {
            "status_code": 201,
            "method": "POST"
        }
    elif data["id"] == 9999:
        response = {
            "status_code": 201,
            "method": "POST"
        }
    return jsonify(response)               

@app.route('/stock/detail/9999', methods=['GET'])
def stock_detail_9999():
    item = {
        "id": 9999,
        "name": "chocolate",
        "price": 160,
        "on_sale": True,
        "count": 200
    }
    response = {
        "status_code": 200,
        "method": "GET",
        "item": item
    }
    return jsonify(response)

#テストケース4
@app.route('/stock/list', methods=['GET'])
def stock_list():
    response_data = {
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
                "id": 2,
                "name": "item_id2",
                "price": 222,
                "on_sale": True,
                "count": 20
            },
            {
                "id": 5,
                "name": "item_id5",
                "price": 555,
                "on_sale": False,
                "count": 50
            }
        ]
    }
    return jsonify(response_data)

#テストケース12
@app.route('/stock/update/1', methods=['PUT']) 
def stock_update_1():
    response = {
        "status_code": 200,
        "method": "PUT"
    }
    return jsonify(response)

#テストケース13
@app.route('/stock/update/5', methods=['PUT']) 
def stock_update_5():
    response = {
        "status_code": 200,
        "method": "PUT"
    }
    return jsonify(response)

#テストケース15
@app.route('/stock/delete/2', methods=['DELETE']) 
def stock_delete_2():
    response = {
        "status_code": 200,
        "method": "DELETE"
    }
    return jsonify(response)

#テストケース16
@app.route('/stock/update/2', methods=['PUT']) 
def stock_update_2():
    response = {
        "status_code": 404,
        "method": "PUT"
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

if __name__ == "__main__":
   app.run()
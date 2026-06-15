from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# This is our "database" for now — just a dict in memory
contacts = {}
next_id = 1

# GET all contacts
@app.route('/contacts', methods=['GET'])
def get_contacts():
    return jsonify(list(contacts.values()))

# GET a single contact by ID
@app.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    contact = contacts.get(contact_id)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    return jsonify(contact)

@app.route('/')
def index():
    return render_template('index.html')

# POST — create a new contact
@app.route('/contacts', methods=['POST'])
def create_contact():
    global next_id
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400

    contact = {
        'id': next_id,
        'name': data['name'],
        'email': data['email'],
        'phone': data.get('phone', '')
    }
    contacts[next_id] = contact
    next_id += 1
    return jsonify(contact), 201

# DELETE a contact
@app.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    if contact_id not in contacts:
        return jsonify({'error': 'Contact not found'}), 404
    del contacts[contact_id]
    return jsonify({'message': 'Contact deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)

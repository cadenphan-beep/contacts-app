from flask import Flask, jsonify, request, render_template
import sqlite3

app = Flask(__name__)

DB = 'contacts.db'

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row  # lets us access columns by name instead of index
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contacts', methods=['GET'])
def get_contacts():
    conn = get_db()
    contacts = conn.execute('SELECT * FROM contacts').fetchall()
    conn.close()
    return jsonify([dict(c) for c in contacts])

@app.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    conn = get_db()
    contact = conn.execute('SELECT * FROM contacts WHERE id = ?', (contact_id,)).fetchone()
    conn.close()
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    return jsonify(dict(contact))

@app.route('/contacts', methods=['POST'])
def create_contact():
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)',
        (data['name'], data['email'], data.get('phone', ''))
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'name': data['name'], 'email': data['email'], 'phone': data.get('phone', '')}), 201

@app.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    conn = get_db()
    result = conn.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
    conn.commit()
    conn.close()
    if result.rowcount == 0:
        return jsonify({'error': 'Contact not found'}), 404
    return jsonify({'message': 'Contact deleted'}), 200

@app.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400

    conn = get_db()
    result = conn.execute(
        'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?',
        (data['name'], data['email'], data.get('phone', ''), contact_id)
    )
    conn.commit()
    conn.close()

    if result.rowcount == 0:
        return jsonify({'error': 'Contact not found'}), 404

    return jsonify({'id': contact_id, 'name': data['name'], 'email': data['email'], 'phone': data.get('phone', '')})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

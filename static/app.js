let allContacts = [];

document.addEventListener('DOMContentLoaded', loadContacts);

function loadContacts() {
    fetch('/contacts')
        .then(res => res.json())
        .then(data => {
            allContacts = data;
            renderContacts(data);
        });
}

function renderContacts(contacts) {
    const list = document.getElementById('contacts-list');

    if (contacts.length === 0) {
        list.innerHTML = '<p class="empty">No contacts found.</p>';
        return;
    }

    list.innerHTML = contacts.map(contact => `
        <div class="contact-card" id="card-${contact.id}">
            <div class="contact-info">
                <div class="name">${contact.name}</div>
                <div class="detail">${contact.email}</div>
                ${contact.phone ? `<div class="detail">${contact.phone}</div>` : ''}
            </div>
            <div class="card-actions">
                <button class="edit-btn" onclick="showEditForm(${contact.id}, '${contact.name}', '${contact.email}', '${contact.phone}')">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showEditForm(id, name, email, phone) {
    const card = document.getElementById(`card-${id}`);
    card.innerHTML = `
        <div class="edit-form">
            <input type="text" id="edit-name-${id}" value="${name}" placeholder="Name" />
            <input type="text" id="edit-email-${id}" value="${email}" placeholder="Email" />
            <input type="text" id="edit-phone-${id}" value="${phone}" placeholder="Phone (optional)" />
            <div class="edit-actions">
                <button onclick="saveContact(${id})">Save</button>
                <button class="cancel-btn" onclick="loadContacts()">Cancel</button>
            </div>
        </div>
    `;
}

function saveContact(id) {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const email = document.getElementById(`edit-email-${id}`).value.trim();
    const phone = document.getElementById(`edit-phone-${id}`).value.trim();

    if (!name || !email) {
        alert('Name and email are required.');
        return;
    }

    fetch(`/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    })
    .then(res => res.json())
    .then(() => loadContacts());
}

function searchContacts() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const filtered = allContacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
    );
    renderContacts(filtered);
}

function addContact() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email) {
        alert('Name and email are required.');
        return;
    }

    fetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        loadContacts();
    });
}

function deleteContact(id) {
    fetch(`/contacts/${id}`, { method: 'DELETE' })
        .then(() => loadContacts());
}

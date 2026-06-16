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
        <div class="contact-card">
            <div class="contact-info">
                <div class="name">${contact.name}</div>
                <div class="detail">${contact.email}</div>
                ${contact.phone ? `<div class="detail">${contact.phone}</div>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
        </div>
    `).join('');
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

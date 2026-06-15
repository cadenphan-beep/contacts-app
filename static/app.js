// Load contacts when the page opens
document.addEventListener('DOMContentLoaded', loadContacts);

function loadContacts() {
    fetch('/contacts')
        .then(res => res.json())
        .then(data => renderContacts(data));
}

function renderContacts(contacts) {
    const list = document.getElementById('contacts-list');

    if (contacts.length === 0) {
        list.innerHTML = '<p class="empty">No contacts yet. Add one above.</p>';
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
        // Clear the form
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

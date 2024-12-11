export class dataHandler {
  constructor() {}

  async fetchContacts() {
    try {
      const response = await fetch('/api/contacts');
      if (response.status !== 200) throw new Error(`HTTP error: ${response.status}`);
      let contacts = await response.json();
      return contacts;
    } catch(err) {
      console.error('Unable to load contacts:', err);
    }
  }

  async fetchContactData(id) {
    try {
      let data = await fetch(`/api/contacts/${encodeURIComponent(id)}`);
      if (!data.ok) throw new Error('Impossible to locate the contact.')
      let json = await data.json();
      return json;
    } catch(err) {
      console.error('Contact not found', err);
    }
  }

  async createContact(data) {
    try {
      let response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: data
      });
      if (!response.ok) throw new Error('Impossible to create contact');
      let newContact = await response.json();
      return newContact;
    } catch(err) {
      console.error('Conctact not created:', err);
    }
  }

  async deleteContact(id) {
    try {
      let response = await fetch(`/api/contacts/${encodeURIComponent(id)}`, {
        method: 'DELETE'
        });
      if (!response.ok) throw new Error(response.status);
      return true;
    } catch(err) {
      console.error('Impossible to delete contact:', err);
    }
  }

  async editContact(data,id) {
    try {
      let response = await fetch(`/api/contacts/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          },
        body: data
      });
      if (!response.ok) throw new Error(response.body);
      let contact = await response.json();
      return contact;
      /* await this.fetchContacts();
      this.renderContacts();
      this.hideForm(); */
    } catch(err) {
      console.error('Impossible to edit the contact:', err);
    }
  }
}
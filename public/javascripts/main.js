import { UserInterface } from "./interface.js";
import { dataHandler } from "./dataHandler.js";
import { FormValidation } from "./formValidation.js";

class ContactManager {
  constructor() {
    this.dataHandler = new dataHandler();
    this.ui = new UserInterface(this.dataHandler);
    
    this.contacts = [];
    this.tags = new Set();
    this.currentId = null;

    this.addButton = document.getElementById('new-contact-btn');
    this.contactCnt = document.getElementById('contacts-section');
    this.form = document.getElementById('contact-form');
    this.exitForm = document.getElementById('exit-form');
    this.deleteBtn = document.getElementById('deleteBtn');
    this.exitPrompt = document.getElementById('exitPrompt');
    this.newTagBtn = document.getElementById('new-tag-btn');
    this.tagForm = document.getElementById('tag-form');
    this.exitTag = document.getElementById('exit-tag');

    this.searchBar = document.getElementById('search-bar');
    this.filterTag = document.getElementById('filterTag');
    this.resetSearch = document.getElementById('reset-search');

    this.validator = new FormValidation(this.form);
  }  

  async initialize() {
    this.contacts = await this.dataHandler.fetchContacts();
    this.extractTagsFromContacts();
    this.ui.renderContacts(this.contacts);
    this.ui.renderTagOptions(this.tags);
    this.bindEvents();
  }

  bindEvents() {
    this.addButton.addEventListener('click', () => this.ui.displayNewForm());
    this.exitForm.addEventListener('click', this.hideForm.bind(this));
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.contactCnt.addEventListener('click', this.cardActions.bind(this));
    this.deleteBtn.addEventListener('click', this.manageContactDeletion.bind(this));
    this.exitPrompt.addEventListener('click', () => this.ui.hidePrompt());
    this.newTagBtn.addEventListener('click', () => this.ui.displayTagForm());
    this.exitTag.addEventListener('click', () => this.ui.hideTagForm());
    this.tagForm.addEventListener('submit', this.addNewTag.bind(this));
    this.searchBar.addEventListener('input', this.manageSearch.bind(this));
    this.filterTag.addEventListener('change', this.manageSearch.bind(this));
    this.resetSearch.addEventListener('click', this.clearSearch.bind(this));
  }

  extractTagsFromContacts() {
    this.contacts.forEach(contact => {
      if (contact.tags && typeof contact.tags === 'string') {
        contact.tags.split(',').forEach(tag => this.tags.add(tag.trim()));
      }
    });
  }

  addNewTag(event) {
    event.preventDefault();
    const tag = event.target.querySelector('#tagName').value;
    if (!this.tags.has(tag)) {
      this.tags.add(tag);
      this.ui.renderTagOptions(this.tags);
    }
    this.ui.hideTagForm();
  }

  hideForm() {
    this.currentId = null;
    this.ui.hideForm();
    this.ui.resetForm();
  }

  cardActions(event) {
    const current = event.target;
    if (current.tagName === 'BUTTON') {
      this.currentId = current.getAttribute('data-id');
      if (current.classList.contains('edit-btn')) {
        this.ui.displayEditForm(this.currentId);
      } else if (current.classList.contains('delete-btn')) {
        this.ui.displayPrompt();
      }
    } else if(current.tagName === 'A') {
      this.manageSearch(event);
    } else {
      return;
    }
  }

  getFormData() {
    let formData = new FormData(this.form);
    let json = {};

    for (const [key, value] of formData) {
      if (key === 'tags') {
        json[key] = formData.getAll('tags').join(',');
      } else {
        json[key] = value;
      }
    }

    if (this.currentId) json.id = this.currentId;
    return JSON.stringify(json);
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      let data = this.getFormData();
      if (event.target.classList.contains('edition')) {
        let updatedContact = await this.dataHandler.editContact(data, this.currentId);
        let idx = this.contacts.findIndex(contact => contact.id === +this.currentId);
        this.contacts[idx] = updatedContact;
      } else if (event.target.classList.contains('creation')) {
        let newConact = await this.dataHandler.createContact(data);
        this.contacts.push(newConact);
      }
      this.ui.renderContacts(this.contacts);
      this.hideForm();
    } else {
      this.ui.displayMessage(this.validator.errors);
    }    
  }

  async manageContactDeletion() {
    let contactRemoved = await this.dataHandler.deleteContact(this.currentId);
    if (contactRemoved) {
      const idx = this.contacts.findIndex(contact => contact.id === this.currentId);
      this.contacts.splice(idx, 1);
      this.ui.renderContacts(this.contacts);
      this.currentId = null;
    }
    this.ui.hidePrompt();
  }

  manageSearch(event) {
    let dataType = event.target.tagName;
    let filteredContacts;

    switch(dataType) {
      case 'INPUT':
        filteredContacts = this.searchByName(event.target.value);
        break;
      case 'A':
        filteredContacts = this.searchByTag(event.target.textContent);
        break;
      case 'SELECT':
        filteredContacts = this.searchByTag(event.target.value);
        break;

      default:
        return;
    }

    if (filteredContacts.length === 0) {
      this.ui.displayMessage('There are no results for this search.');
    } else {
      this.ui.displayMessage('');
      this.ui.renderContacts(filteredContacts);
    }
  }

  searchByName(searchValue) {
    return this.contacts.filter(contact => contact['full_name'].toLowerCase()
    .includes(searchValue.toLowerCase()));
  }

  searchByTag(searchContent) {
    if (searchContent === 'all') return this.contacts;

    return this.contacts.filter( contact => contact['tags'] && 
      contact['tags'].includes(searchContent));
  }

  clearSearch() {
    this.ui.renderContacts(this.contacts);
    this.filterTag.value = 'all';
    this.searchBar.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contactManager = new ContactManager();
  contactManager.initialize();
});
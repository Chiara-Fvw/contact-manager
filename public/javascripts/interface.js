export class UserInterface {
  constructor(dataHandler) {
    this.dataHandler = dataHandler;

    this.contactCnt = document.getElementById('contacts-section'); 
    this.formCnt = document.getElementById('form-container');
    this.formTtl = document.getElementById('form-type');
    this.form = document.querySelector('form#contact-form');
    this.tagFormCnt = document.getElementById('createTag');
    this.promptLayer = document.getElementById('prompt-layer');
    this.prompt = document.getElementById('prompt');
    this.messageCnt = document.getElementById('message-container');
  }

  renderContacts(contacts) {
    contacts = contacts.map(contact => {
      if (contact.tags !== null && typeof contact.tags === 'string') {
        contact.tags = contact.tags.split(',').map(tag => tag.trim());
      } 
      return contact;
    });

    let partialSource = document.getElementById('card').innerHTML;
    Handlebars.registerPartial('card', partialSource);
      
    let source = document.getElementById('contacts').innerHTML;
    let template = Handlebars.compile(source);
    let html = template({contacts: contacts});

    this.contactCnt.innerHTML = html;
  }

  renderTagOptions(tags) {
    tags = Array.from(tags).sort();
    let allOption = '<option value="all">All</option>';
    let optionList = tags.map(tag => `<option value="${tag}">${tag}</option>`)
                          .join('');

    Array.from(document.querySelectorAll('select')).forEach(select => {
      if (select.id === 'filterTag') {
        select.innerHTML = allOption;
        select.insertAdjacentHTML('beforeend', optionList);
      } else {
        select.innerHTML = optionList;
      };
    });
  }

  displayNewForm() {
    this.resetForm();
    this.formTtl.textContent = 'Create New Contact';
    document.getElementById('full_name').setAttribute('placeholder', 'Full Name');
    document.getElementById('email').setAttribute('placeholder', 'name@domain.tld');
    document.getElementById('phone_number').setAttribute('placeholder', '0000000000');
    document.getElementById('tags').setAttribute('placeholder', "friend,family");

    this.form.classList.add('creation');

    this.contactCnt.classList.add('hidden');
    this.formCnt.classList.remove('hidden');
  }

  async displayEditForm(id) {
    this.formTtl.textContent = 'Edit Contact';
    this.form.classList.add('edition');
    await this.renderEditData(id);    
    this.contactCnt.classList.add('hidden');
    this.formCnt.classList.remove('hidden');
  }

  async renderEditData(id) {
    let data = await this.dataHandler.fetchContactData(id);

    let inputs = Array.from(this.form.querySelectorAll('input'))
                        .filter(input => input.type !== 'submit');
    inputs.forEach(input => {
        input.setAttribute('value', data[input.name]);
      });
    Array.from(document.getElementById('tags').children).forEach(option => {
        if (data.tags && data.tags.includes(option.value)) {
          option.selected = true;
        }
    });
  }

  hideForm() {
    this.contactCnt.classList.remove('hidden');
    this.formCnt.classList.add('hidden');
  }

  resetForm() {
    this.formTtl.textContent = '';
    this.form.reset();
    this.currentId = null;

    this.form.classList.remove('creation', 'edition')
    Array.from(this.form.children).forEach(elm => {
      if (elm.hasAttribute('placeholder')) elm.removeAttribute('placeholder');
      if (elm.hasAttribute('value')) elm.removeAttribute('value');
    });
  }

  displayTagForm() {
    this.tagFormCnt.classList.remove('hidden');
    this.hidePrompt();
    this.hideForm();
    this.contactCnt.classList.add('hidden');
  }

  hideTagForm() {
    document.getElementById('tag-form').reset();
    this.tagFormCnt.classList.add('hidden');
    this.contactCnt.classList.remove('hidden');
  }

  displayPrompt() {
    this.promptLayer.classList.remove('hidden');
    this.prompt.classList.remove('hidden');
  }

  hidePrompt() {
    this.promptLayer.classList.add('hidden');
    this.prompt.classList.add('hidden');
  }

  displayMessage(message) {
    this.messageCnt.classList.remove('hidden');
    this.contactCnt.classList.add('hidden');
    document.getElementById('text-message').textContent = message;
  }

  hideMessage() {
    this.messageCnt.classList.add('hidden');
    this.contactCnt.classList.remove('hidden');
    document.getElementById('text-message').textContent = '';
  }
}
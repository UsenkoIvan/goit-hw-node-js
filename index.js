const fnContact = require('./contacts');
const argv = require('yargs').argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      fnContact.listContacts();
      break;

    case 'get':
      fnContact.getContactById(id);
      break;

    case 'add':
      fnContact.addContact(name, email, phone);
      break;

    case 'remove':
      fnContact.removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);

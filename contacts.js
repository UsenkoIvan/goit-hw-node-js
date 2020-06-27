// contacts.js
const shortID = require('shortid');
const path = require('path');
const fs = require('fs');

const contactsPath = path.join(__dirname, './db/contacts.json');

const asyncFs = fs.promises;

// TODO: задокументировать каждую функцию
async function listContacts() {
  try {
    const contacts = await asyncFs.readFile(contactsPath);
    const parseContacts = JSON.parse(contacts);
    console.log('All contacts -->', parseContacts);
  } catch (err) {
    console.log(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await asyncFs.readFile(contactsPath);
    const parseContacts = JSON.parse(contacts);
    const findContactsWithId = parseContacts.find(({ id }) => id === contactId);
    console.log(`FIND CONTACT WITH ID --> ${contactId}`, findContactsWithId);
  } catch (err) {
    console.log(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await asyncFs.readFile(contactsPath);
    const parseContacts = JSON.parse(contacts);
    const delContactsWithId = parseContacts.filter(
      ({ id }) => id !== contactId,
    );
    console.log(`DELETE CONTACT WITH ID --> ${contactId}`, delContactsWithId);
  } catch (err) {
    console.log(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await asyncFs.readFile(contactsPath);
    const allParseContacts = JSON.parse(contacts);

    const newContact = { id: shortID(), name, email, phone };
    const newcontacts = [...allParseContacts, newContact];

    const jsonStringify = JSON.stringify(newcontacts);

    const addContact = asyncFs.writeFile(contactsPath, jsonStringify);

    console.log(`ADD NEW CONTACT --> ${newContact}`, addContact);
    listContacts();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

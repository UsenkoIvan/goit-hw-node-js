const contactModel = require('./contacts.model');

async function getContacts(req, res) {
  try {
    const contactsList = await contactModel.find();
    if (!contactsList) {
      const err = new Error(`Contacts not found`);
      err.status = 404;
      throw err;
    }
    res.send(contactsList);
  } catch (err) {
    console.log('err getContacts ---> ', err);
  }
}

async function getContact(req, res) {
  try {
    const { contactId } = req.params;

    const reqContactWithId = await contactModel.findById(contactId);

    if (!reqContactWithId) {
      res.status(404).send(`Contact with id ${contactId} not found`);
    }
    res.send(reqContactWithId);
  } catch (err) {
    console.log('err getContact ---> ', err);
  }
}

async function createContact(req, res) {
  try {
    const NewContact = await contactModel.create({ ...req.body });

    res.status(201).send(NewContact);
  } catch (err) {
    console.log('err createContact ---> ', err);
  }
}

async function removeContact(req, res) {
  try {
    const { contactId } = req.params;

    const contactDelete = await contactModel.findOneAndDelete({
      _id: contactId,
    });

    if (!contactDelete) {
      res
        .status(404)
        .send({ messeage: `Contact with id ${contactId} was deleted` });
    }

    res.send({
      ...contactDelete,
      messeage: `Contact with id ${contactId} is delete`,
    });
  } catch (err) {
    console.log('err removeContact ---> ', err);
  }
}

async function updateContact(req, res) {
  try {
    const { contactId } = req.params;

    const contactUpdate = await contactModel.findOneAndUpdate(
      { _id: contactId },
      { $set: { ...req.body } },
      { new: true },
    );
    if (!contactUpdate) {
      res.status(404).send(`Contact with id ${id} does not exist`);
    }

    res.send(contactUpdate);
  } catch (err) {
    console.log('err updateContact ---> ', err);
  }
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  removeContact,
  updateContact,
};

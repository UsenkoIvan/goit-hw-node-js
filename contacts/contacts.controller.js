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
    const { _id } = req.params;

    const reqContactWithId = await contactModel.findById(_id);

    if (!reqContactWithId) {
      res.status(404).send(`Contact with id ${_id} not found`);
    }
    res.send(reqContactWithId);
  } catch (err) {
    console.log('err getContact ---> ', err); // Валідація на обжІд видає ошибку!!!
  }
}

async function createContact(req, res) {
  try {
    const { email } = req.body;
    const contactInDB = await contactModel.findOne({ email });
    if (contactInDB) {
      res
        .status(400)
        .send('This email is allready in DB, please change email =) ');
    }

    const NewContact = await contactModel.create({ ...req.body });

    res.status(201).send(NewContact);
  } catch (err) {
    console.log('err createContact ---> ', err);
  }
}

async function removeContact(req, res) {
  try {
    const { _id } = req.params;
    console.log(_id);

    const contactDelete = await contactModel.findByIdAndDelete(_id);

    if (!contactDelete) {
      res.status(404).send({ messeage: `Contact with id ${_id} was deleted` });
    }

    res.send({
      ...contactDelete,
      messeage: `Contact with id ${_id} is delete`,
    });
  } catch (err) {
    console.log('err removeContact ---> ', err);
  }
}

async function updateContact(req, res) {
  try {
    const { _id } = req.params;

    const contactUpdate = await contactModel.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { new: true },
    );
    console.log(contactUpdate);
    if (!contactUpdate) {
      res.status(404).send(`Contact with id ${_id} does not exist`);
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

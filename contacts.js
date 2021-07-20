const { readFile, writeFile } = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "/db", "/contacts.json");

function listContacts() {
  return readFile(contactsPath, "utf8")
    .then(res => JSON.parse(res))
    .catch(err => console.log(err));
}

function getContactById(contactId) {
  return (async () =>
    (await listContacts()).filter(item => item.id === +contactId))();
}

function removeContact(contactId) {
  return (async () => {
    const list = [...(await listContacts())];
    const arr = list.filter(item => item.id !== +contactId);

    writeFile(contactsPath, JSON.stringify(arr))
      .then(() => listContacts())
      .catch(err => {
        console.log(err);
        return err;
      });
    return list.length === arr.length ? false : true;
  })();
}

function addContact(body) {
  console.log(body)
  return (async () => {
    let arr = await listContacts();

    const newContact = Object.assign({
      id: arr[arr.length - 1].id + 1,
    }, body);

    arr.push(newContact);

    writeFile(contactsPath, JSON.stringify(arr)).catch(err => {
      console.log(err);
      return err;
    });

    return newContact;
  })();
}

function UpdateContact(id, body) {

  return (async () => {

    const arr = await listContacts();
    const index = arr.findIndex(item => item.id === +id);
    
    if(index !== -1){
      Object.assign(arr[index], body);
    
      writeFile(contactsPath, JSON.stringify(arr)).catch((err) => {
        console.log(err);
        return err;
      });

      return arr[index];
    }else return false;
  })();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  UpdateContact,
};

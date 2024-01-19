const contextRootCustomers = 'myvoya/ws/ers/service/customers/';
const contextRoot = 'myvoyage/ws/ers/';
const partyID = '272c2587-6b79-d874-e053-d22aac0a0939';

export const endPoints = {
  getAccountRecovery: contextRootCustomers + `${partyID}/profile/loginInfo`,
  getMessage: contextRoot + 'content/section/more',
  saveContact: contextRoot + 'emvdata/saveContacts',
};

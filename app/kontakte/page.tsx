import React from 'react';
import Loader from '@/components/ui/loader';
import ContactsTable from '@/components/ui/contacts-table';

const ContactsPage = () => {
  return (
    <div>
      <h1>Contacts</h1>
      <Loader />
      <ContactsTable />
    </div>
  );
};

export default ContactsPage;

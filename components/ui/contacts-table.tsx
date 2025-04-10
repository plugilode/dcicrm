import React from 'react';

const ContactsTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Placeholder for contact data */}
        <tr>
          <td>John Doe</td>
          <td>john.doe@example.com</td>
          <td>(123) 456-7890</td>
          <td>
            <button>Edit</button>
            <button>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ContactsTable;

import React, { useState } from 'react';
import ListItem from '../ListItem/ListItem';
import Modal from '../Modal/Modal';
import styles from './list.module.css';

const List = ({ projects, deleteItem }) => {
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.table}>
      <Modal title={titleModal} showModal={showModal} closeModal={closeModal} />
      <table>
        <thead className={styles.row}>
          <tr>
            <th> ID </th>
            <th> Name </th>
            <th> Description </th>
            <th> Start Date </th>
            <th> End Date </th>
            <th> Client </th>
            <th> Active </th>
            <th> Members </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => {
            return (
              <ListItem
                key={item._id}
                listItem={item}
                deleteItem={deleteItem}
                setShowModal={setShowModal}
                setTitleModal={setTitleModal}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default List;
import { useState, useEffect } from 'react';
import styles from './time-sheets.module.css';
import List from './List/List';
import AddItem from './AddItem/AddItem';
import Modal from './Modal/Modal';
import Preloader from '../Shared/Preloader/Preloader';

function TimeSheets() {
  const [timeSheets, setTimeSheets] = useState([]);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTitle, setShowTitle] = useState('');

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-sheets`);
      const responseJSON = await response.json();
      setTimeSheets(responseJSON.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/time-sheets`)
      .then((response) => response.json())
      .then((response) => {
        setTimeSheets(response.data);
      });
  }, [showModal]);

  const deleteItem = async (_id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-sheets/${_id}`, {
        method: 'DELETE'
      });
      const responseJSON = await response.json();
      if (responseJSON.error === false) {
        setShowTitle(responseJSON.message);
      }
      setTimeSheets([...timeSheets.filter((timeSheet) => timeSheet._id !== _id)]);
    } catch (error) {
      console.error(error);
    }
  };

  const closeForm = () => {
    setShowFormAdd(false);
  };
  const onClick = () => {
    setShowFormAdd(true);
  };

  return loading ? (
    <Preloader>
      <p>Loading timesheets</p>
    </Preloader>
  ) : (
    <section className={styles.container}>
      <AddItem
        show={showFormAdd}
        closeForm={closeForm}
        setShowModal={setShowModal}
        setShowTitle={setShowTitle}
      />
      <h2 className={styles.title}>Timesheets</h2>
      <List
        timeSheets={timeSheets}
        deleteItem={deleteItem}
        setShowModal={setShowModal}
        setShowTitle={setShowTitle}
      />
      <button className={styles.addButton} onClick={onClick}>
        ✚
      </button>
      <Modal showTitle={showTitle} showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
}

export default TimeSheets;

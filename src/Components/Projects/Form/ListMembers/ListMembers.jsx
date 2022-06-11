import { useState } from 'react';
import styles from './listmembers.module.css';
import ListItemMember from '../ListItemMember/ListItemMember';
import ButtonAdd from '../../../Shared/Buttons/ButtonAdd';

const ListMembers = ({ project, onAdd, functionValue }) => {
  let [members, setMembers] = onAdd ? useState([]) : useState(project[0].members);
  let membersToSave;
  members = members.filter((member) => member.employeeId !== null);

  const deleteMember = async (id) => {
    const confirmation = confirm('Are you sure you want to delete this member?');
    if (confirmation) {
      members = members.filter((member) => member.employeeId._id !== id);
      setMembers(members);
      membersToSave = members.map((member) => ({
        employeeId: member.employeeId._id,
        role: member.role,
        rate: member.rate
      }));
      let url = `${process.env.REACT_APP_API_URL}/api/projects/${project[0]._id}`;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ members: membersToSave })
      };
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(data.message);
        } else {
          alert('Member deleted successfully');
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return onAdd ? (
    <></>
  ) : !members.length ? (
    <ButtonAdd
      clickAction={function () {
        functionValue(true);
      }}
    ></ButtonAdd>
  ) : (
    <div className={styles.divcontainer}>
      <h3>Team members</h3>
      <ButtonAdd
        clickAction={function () {
          functionValue(true);
        }}
      ></ButtonAdd>
      <div className={styles.container}>
        <table>
          <thead>
            <tr>
              <th id="name">Member</th>
              <th id="role">Role</th>
              <th id="rate">Rate</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) =>
              member.employeeId == null ? (
                <></>
              ) : (
                <ListItemMember
                  key={member.employeeId._id}
                  member={member}
                  onDelete={deleteMember}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListMembers;

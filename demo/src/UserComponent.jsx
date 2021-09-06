import axios from "axios";
import { useEffect, useState } from "react";
import { Constants } from "./Constants";

let matches = [];
let path = "";

const { HOST, PORT } = Constants;

const UserComponent = (props) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    console.log("getting user details..");
    getUsers(setUsers, setFilteredUsers);
  }, []);

  return (
    <div>
      <DisplayUsers
        users={users}
        filteredUsers={filteredUsers}
        setFilteredUsers={setFilteredUsers}
      ></DisplayUsers>
    </div>
  );
};

const getUsers = (setUsers, setFilteredUsers) => {
  axios
    .get(`${HOST}:${PORT}/users`)
    .then((response) => {
      console.log("resposse", response.data);

      if (response.data.error) {
        alert("Invalid URL");
      } else {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    })
    .catch((err) => {});
};

const DisplayUsers = (props) => {
  const [filter, setFilter] = useState("");

  const filterOnchange = (e) => {
    let filterText = e.target.value;

    setFilter(filterText);

    if (filterText.length === 0) props.setFilteredUsers(props.users);

    /*   if (filterText.length < 2) return false; */

    matches = [];
    props.users.forEach((item) => {
      find(item, filterText, item.id);
    });

    let users = props.users.filter((item) => matches.indexOf(item.id) !== -1);

    props.setFilteredUsers(users);

    console.log("matches", matches);
  };

  return (
    <div>
      <div>
        <input
          placeholder="Filter by any value"
          key="filter"
          value={filter}
          onChange={filterOnchange}
        ></input>
      </div>
      <hr></hr>
      <br></br>
      <div>
        {props.users.length === 0 && (
          <div id="loading">
            <h2>Please wait while data being loaded...</h2>
          </div>
        )}

        {props.filteredUsers.length === 0 && props.users.length !== 0 && (
          <div id="message">
            <h2>{`No records matching records forund for: "${filter}"`}</h2>
          </div>
        )}

        {props.users.length !== 0 && props.filteredUsers.length !== 0 && (
          <div>
            <h2>{`Matches found: ${props.filteredUsers.length}`}</h2>
            <table cellPadding="8" cellSpacing="8" border="1">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>User Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Website</th>
                <th>Company</th>
                <th>Address</th>
              </tr>
              {props.filteredUsers.map((user) => {
                return (
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.website}</td>
                    <td>{user.company.name}</td>
                    <td>{displayAddress(user.address)}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const displayAddress = (addr) => {
  let { suite, street, city, zipcode } = addr;
  return `${suite}, ${street}, ${city} - ${zipcode}`;
};

const find = (obj, search, curId) => {
  for (let prop of Object.keys(obj)) {

    if (matches.includes(curId)) {
      //quit saerch, object already matched
      return;
    }

    if (typeof obj[prop] === "object") {
      path += prop + "/";
      find(obj[prop], search, curId);
    } else {
      if (
        obj[prop]?.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      ) {
        matches.push(curId);
        console.log(curId, obj);
        break;
      }
    }
  }
};

export default UserComponent;

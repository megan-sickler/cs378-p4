// general app imports
import { useState } from "react";
import './App.css';

// firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// my web app's firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVtD5iboFoJU6e3gHlDjVJEDFW14REQOE",
  authDomain: "cs378-p4-msickler.firebaseapp.com",
  databaseURL: "https://cs378-p4-msickler-default-rtdb.firebaseio.com",
  projectId: "cs378-p4-msickler",
  storageBucket: "cs378-p4-msickler.appspot.com",
  messagingSenderId: "2575046082",
  appId: "1:2575046082:web:731572a8acf0f2d6a3325b",
  measurementId: "G-V690NQDSJQ"
};

// initializing firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function GroceryListApp() {

  // Item name in the "new item" text box.
  const [itemList, setItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);

  const transferUsernameFromPopup = (username) => {
    setCurrentUser(username);
    setLoggedOut(false);
  }

  const addItemIfEnter = (event) => {
    if (event.key === "Enter") {
      var newItemList = itemList.slice();
      newItemList.push(event.target.value);
      setItemList(newItemList);
      event.target.value = '';
    }
  }

  const itemListRepresentation = itemList.map((item, index) => {
    return (
      <div className="item" key={index}>
        <input type="checkbox" name="item1" id="item1"></input>
        <label htmlFor="item1" className="item-label">{item}</label>
      </div>
    );
  })

  function logOut() {
    setItemList([]);
    setLoggedOut(true);
  }

  return (
    <div className="App">
      <h1>Grocery List</h1>
      
      <div className="list">
        {itemListRepresentation}
        <div className="new-item">
          <label className="add-label">+</label>
          <input 
            type="text" 
            label="new item" 
            id="new-item-input" 
            placeholder="add new item here" 
            onKeyDown={addItemIfEnter}>
          </input>
        </div>
      </div>


      <div id="user-info">
        <p>Current User: {currentUser}</p>
        <button onClick={logOut}>Log Out</button>
      </div>
      <PopUp sendUsernameToListScreen={transferUsernameFromPopup} isLoggedOut={loggedOut}></PopUp>
    </div>
  );
}

function PopUp({sendUsernameToListScreen, isLoggedOut}) {

  const [showForm, setShowForm] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Updates internal username variable.
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  // Updates internal password variable.
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const submitIfEnter = (event) => {
    if (event.key === "Enter") {
      loginSubmit();
    }
  }

  function loginSubmit () {
    if ((username === "test" && password === "login") || (username === "te" && password === "lo")) { //TODO: change!!
      sendUsernameToListScreen(username);
      setShowForm(false);
      setUsername("");
      setPassword("");
    } else {
      alert("Username and/or password are incorrect.");
    }
  }

  return (
    <>
      <div id="behind-popup" className={showForm || isLoggedOut ? null: "disappear"}>
        <div id="popup">
          <h1>Log In</h1>
          <input type="text" className="login-fields" name="username" placeholder="username" value={username} onChange={handleUsernameChange}></input><br></br>
          <input type="text" className="login-fields" name="password" placeholder="password" value={password} onChange={handlePasswordChange} onKeyDown={submitIfEnter}></input><br></br>
          <button id="login-submit" onClick={loginSubmit}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default GroceryListApp;

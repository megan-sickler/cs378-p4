// general app imports
import { useState } from "react";
import './App.css';

// firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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

  const [itemList, setItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);

  const addItemToDatabase = (itemName) => {
    const sampleDict = {
      item: itemName
    };
    return fetch(`${firebaseConfig.databaseURL + "/userData/" + currentUser}/.json`, {
      method: "PUT",
      body: JSON.stringify(sampleDict)
    }).then((res) => {
      if (res.status !== 200) {
        alert("There was an error: " + res.statusText);
        // throw new Error(res.statusText);
      } else {
        alert("Successfully sent. Check Firebase console.");
        return;
      }
    });
  };

  const transferEmailFromPopup = (email) => {
    var indexOfAmpersand = email.indexOf("@");
    setCurrentUser(email.slice(0, indexOfAmpersand));
    setLoggedOut(false);
  }

  const addItemIfEnter = (event) => {
    if (event.key === "Enter") {
      addItemToDatabase(event.target.value);
      // var newItemList = itemList.slice();
      // newItemList.push(event.target.value);
      // setItemList(newItemList);
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
      <LogInPopUp sendEmailToListScreen={transferEmailFromPopup} isLoggedOut={loggedOut}></LogInPopUp>
    </div>
  );
}

function LogInPopUp(props) {

  const [showForm, setShowForm] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsToSignUp, setNeedsToSignUp] = useState(false);

  const tellLoginScreenSignUp = () => {
    setNeedsToSignUp(false);
  }
  
  const handleSignUp = () => {
    setNeedsToSignUp(true);
    setShowForm(true);
  }

  // Updates internal email variable.
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
    setEmail("");
    setPassword("");
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        props.sendEmailToListScreen(email);
        setShowForm(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <>
      <SignInPopUp needsToSignUp={needsToSignUp} tellLoginScreenSignUp={tellLoginScreenSignUp} setNeedsToSignUp={setNeedsToSignUp}></SignInPopUp>
      <div id="behind-popup" className={((showForm || props.isLoggedOut) && !needsToSignUp) ? null : "disappear"}>
        <div id="popup">
          <h1>Log In</h1>
          <input type="text" className="login-fields" name="email" placeholder="email" value={email} onChange={handleEmailChange}></input><br></br>
          <input type="text" className="login-fields" name="password" placeholder="password" value={password} onChange={handlePasswordChange} onKeyDown={submitIfEnter}></input><br></br>
          <button id="login-submit" onClick={loginSubmit}>Submit</button>
          <p onClick={handleSignUp}>Don't have an account yet? Click <u>here</u> to sign up!</p>
        </div>
      </div>
    </>
  )
}

function SignInPopUp(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Updates internal email variable.
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  // Updates internal password variable.
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const submitIfEnter = (event) => {
    if (event.key === "Enter") {
      signUpSubmit();
    }
  }

  function signUpSubmit () {
    if (email === "" || password === "") { //TODO: change!!
      alert("email and/or password fields are blank.");
    } else {
      props.setNeedsToSignUp(false);
      props.tellLoginScreenSignUp();
      setEmail("");
      setPassword("");
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message; //TODO: alert this error message
          // ..
        });
    } 
  }

  return (
    <>
      <div id="behind-popup" className={props.needsToSignUp ? null : "disappear"}>
        <div id="popup">
          <h1>Sign Up</h1>
          <input type="text" className="login-fields" name="email" placeholder="email" value={email} onChange={handleEmailChange}></input><br></br>
          <input type="text" className="login-fields" name="password" placeholder="password" value={password} onChange={handlePasswordChange} onKeyDown={submitIfEnter}></input><br></br>
          <button id="login-submit" onClick={signUpSubmit}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default GroceryListApp;

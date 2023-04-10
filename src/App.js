// general app imports
import { useState } from "react";
import './App.css';

// firebase imports
import { initializeApp } from "firebase/app";
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

// the main grocery list page
function GroceryListApp() {

  // variables for the main grocery list page
  const [itemList, setItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);

  // item list mapping to html
  const itemListRepresentation = itemList.map((item, index) => {
    return (
      <div className="item" key={index}>
        <input type="checkbox" name="item1" id="item1"></input>
        <label htmlFor="item1" className="item-label">{item}</label>
      </div>
    );
  })

  // updates the database of items with a new list of items
  const updateDatabase = (newItemList) => {
    const sampleDict = {
      items: newItemList
    };
    return fetch(`${firebaseConfig.databaseURL + "/userData/" + currentUser}/.json`, {
      method: "PUT",
      body: JSON.stringify(sampleDict)
    }).then((res) => {
      if (res.status !== 200) {
        alert("There was an error: " + res.statusText);
        throw new Error(res.statusText);
      }
    });
  };

  // update item list with the list of this user's items from the database
  const getDatabaseItems = () => {
    fetch(`${firebaseConfig.databaseURL + "/userData/" + currentUser}/.json`)
      .then((res) => {
        if (res.status !== 200) {
          alert("There was an error: " + res.statusText);
          throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if (res) {
          const items = res["items"];
          setItemList(items);
        }
      });
  };

  // method passes control from login page to list page
  // sets current user field, closes login popup, and populates list of items
  const passingControlFromLoginPage = (email) => {
    var indexOfAmpersand = email.indexOf("@");
    setCurrentUser(email.slice(0, indexOfAmpersand));
    setLoggedOut(false);
    getDatabaseItems();
  }

  // adds item to grocery list
  const addItemIfEnter = (event) => {
    
    // checks if the 'enter' key was it
    if (event.key === "Enter") {
      
      // makes an updates item list and reflects changes on screen & in database
      var newItemList = itemList.slice();
      newItemList.push(event.target.value);
      setItemList(newItemList);
      updateDatabase(newItemList);
      
      // reset input box
      event.target.value = '';
    }
  }

  // transfers control back to login page
  function logOut() {
    setItemList([]);
    setLoggedOut(true);
  }

  return (
    <div className="App">
      <h1>Grocery List</h1>
      
      {/* grocery list and 'new item' box */}
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

      {/* username and logout button */}
      <div id="user-info">
        <p>Current User: {currentUser}</p>
        <button onClick={logOut}>Log Out</button>
      </div>
      
      {/* popup for login page */}
      <LoginPopup sendEmailToListScreen={passingControlFromLoginPage} isLoggedOut={loggedOut}></LoginPopup>
    </div>
  );
}

// popup for the login page
function LoginPopup(props) {

  // variables for the login popup
  const [showForm, setShowForm] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  // passes control from the signup page to the login page
  const passingControlFromSignupPage = () => {
    setShowSignup(false);
  }
  
  // shows signup page
  const handleSignUp = () => {
    setShowSignup(true);
    setShowForm(true);
  }

  // updates internal email variable
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  // updates internal password variable
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  // submits the login page upon press of enter key
  const submitIfEnter = (event) => {
    if (event.key === "Enter") {
      loginSubmit();
    }
  }

  // submits the login form to firebase auth
  function loginSubmit () {
    setEmail("");
    setPassword("");
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.passingControlFromLoginPage(email);
        setShowForm(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <>
      {/* sign in popup, hidden till necessary */}
      <SignupPopup needsToSignUp={showSignup} tellLoginScreenSignUp={passingControlFromSignupPage} setNeedsToSignUp={setShowSignup}></SignupPopup>
      
      {/* log in page with disappearing functionality */}
      <div id="behind-popup" className={((showForm || props.isLoggedOut) && !showSignup) ? null : "disappear"}>
        <div id="popup">
          <h1>Log In</h1>
          <input type="text" className="login-fields" name="email" placeholder="email" value={email} onChange={handleEmailChange}></input><br></br>
          <input type="text" className="login-fields" name="password" placeholder="password" value={password} onChange={handlePasswordChange} onKeyDown={submitIfEnter}></input><br></br>
          <button id="login-submit" onClick={loginSubmit}>Submit</button>
          <p onClick={handleSignUp} id="signup-question">Don't have an account yet? Click <u>here</u> to sign up!</p>
        </div>
      </div>
    </>
  )
}

// popup for the signup page
function SignupPopup(props) {

  // variable for the signin page
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // updates internal email variable
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  // updates internal password variable
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  // submits the sign up form upon press of 'enter' key
  const submitIfEnter = (event) => {
    if (event.key === "Enter") {
      signupSubmit();
    }
  }

  // submits the signup form
  function signupSubmit() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        props.setNeedsToSignUp(false);
        props.tellLoginScreenSignUp();
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      });
  } 

  return (
    <>
      {/* signup popup that disappears when not necessary */}
      <div id="behind-popup" className={props.needsToSignUp ? null : "disappear"}>
        <div id="popup">
          <h1>Sign Up</h1>
          <input type="text" className="login-fields" name="email" placeholder="email" value={email} onChange={handleEmailChange}></input><br></br>
          <input type="text" className="login-fields" name="password" placeholder="password" value={password} onChange={handlePasswordChange} onKeyDown={submitIfEnter}></input><br></br>
          <button id="login-submit" onClick={signupSubmit}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default GroceryListApp;

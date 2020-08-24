import React, {useState, useEffect} from 'react';
import './App.css';
import logo from "./insta2.JPG";
import Post from "./Post";
import {db, auth} from "./Firebase";
import { makeStyles, Modal, Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

//Styling for Modal provided my MaterialUI
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 350,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
//Styling for Modal provided my MaterialUI


function App() { //State declaration
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  
  //Its a listener which runs on user or username change
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          //user has logged in..
          console.log("auth User: ")
          console.log(authUser);
          setUser(authUser); 
          // if (authUser.displayName) {
          //   // dont update username
          // } else {
          //   // if we just created someone
          //   return authUser.updateProfile({
          //     displayName: username
          //   });
          } else {
          //User has logged out
          setUser(null);
        }
      })
      return () => {
        // perform some cleanup actions
        unsubscribe();
      }
  }, [user, username])

  //Its run without any condn & set posts from db to page
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
        id: doc.id,
        post:doc.data()
      })));
      // console.log("snapshot.docs");
      // console.log(snapshot.docs);
    })
  }, []);

  //Runs when someone clicks o signup
  //authenticatest the email password 
  //and if correct sets username to displyname
  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      setOpen(false)
      return authUser.user.updateProfile({
         displayName: username
      })
    })
    .catch((error) => alert(error.message))

  }

  // Run on sign in and auth the email & pswd
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setOpenSignIn(false);
      })
      .catch((error) => alert(error.message))
    // setOpenSignIn(false);
  }

  return (
    <div className="app">
      
      {/* Sign UP */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
          <center className="app_ModalEle">
            <img className="app_ModalImage" src={logo} alt="" />
            <Input placeholder="User Name" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" type="text" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </center>
          </form>
        </div>
      </Modal>

      {/* Sign In */}
      <Modal open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app_ModalEle">
              <img className="app_ModalImage" src={logo} alt="" />
              <Input placeholder="Email" type="text" value={email}
              onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img 
        className="app_headerImage"
        src= {logo} 
        alt=""/>
        { //Will  display logout if aready signed in
        user ? (
          <div id="app_profile">
            <h4>Welcome {(user.displayName)}</h4>
            <Button id="logout" onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ):(
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )
      }
      </div>
     
      <div className="app_post">
        <div className=" ">
        { //Passes the post data from db to Post.js
          posts.map(({id, post}) => (
           <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        </div>
        {/* <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol='' 
        injectScript 
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
        /> */}
      </div>
  
      {
        (user) ?(
          <ImageUpload username={user.displayName} />
        ):(
          <h3>Login to Upload..</h3>
        )
      }
    </div>
  );
}

export default App;

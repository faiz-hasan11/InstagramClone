import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";
import { Button, Avatar, makeStyles, Modal, Input } from "@material-ui/core";
// import FlipMove from "react-flip-move";
import axios from "./axios.js"
import Pusher from "pusher-js"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "200px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const[modalStyle] = useState(getModalStyle)
  const [posts,setPosts] = useState([])
  const [open,setOpen] = useState(false)
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [user,setUser] = useState(null)
  const [openSignIn , setOpenSignIn] = useState(false)
  const [comments,setComments] = useState([])


  const fetchPosts = async () =>
     await axios.get("/sync").then(response =>
      {
        console.log(response)
        setPosts(response.data)
      })
  useEffect(() =>
  {    
    const pusher = new Pusher('9ee219d8486456a76325', {
      cluster: 'ap2'
    });
    const channel = pusher.subscribe('posts');
    channel.bind('inserted', function(data) {
      fetchPosts()
    });
  } ,[])



  useEffect(() =>{
   const unsubscribe = auth.onAuthStateChanged((authUser) =>
    {
      if(authUser)
      {
        setUser(authUser)
      }
      else
      {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }

  } , [user,username])

  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const Login = (event) =>
  {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="App">      
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
                <center>
                  <img className="app_header_image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
                </center>
                <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>                
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
                <center>
                  <img className="app_header_image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
                </center>
                <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit" onClick={Login}>Login</Button>
            </form>                
        </div>
      </Modal>
      <div className="app_header">
        <img className="app_header_image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              {user ? 
      (<Button onClick={() => auth.signOut()}>LogOut</Button>)
      :
      (
        <div className="app_logincontainer">
        <Button onClick={() => setOpenSignIn(true)}>Login In</Button>
         <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      
      <div className="app_posts">
        <div className="app_postsLeft">
      {
        posts.map((post) =>
          (          
            <Post key={post._id} postId={post._id} user={user} username={post.user} caption={post.caption} imageUrl={post.image}/>
            // console.log(post.user)
          ))
      }
        </div>
        <div className="app_postsRight">
          
        </div>

      </div>
            {user?.displayName ? (<ImageUpload username={user.displayName}/>):
      (<h3>Sorry You Need To Login to Upload</h3>)}
    </div>
  );
}

export default App;

import React , {useState,useEffect} from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import {db} from "./firebase"
import firebase from "firebase";

function Post({postId ,user, username , caption , imageUrl}) {
    const [comments,setComments] = useState([])
    const [comment,setComment] = useState("")

    useEffect(() => {
      let unsubscribe;
      if (postId) {
        unsubscribe = db
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()));
          });
      }
       return () => {
        unsubscribe();
      };
    }, [postId]);

     const postComment = (e) => {
      e.preventDefault();
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
      });
      setComment("");
    }
    return (
        <div className="post">
            <div className="post_header">
                <Avatar className="post_avatar" alt="Faiz" src="/static/images/avatar/1.jpg"/>
                <h3>{username}</h3>
            </div>
        <img className='post_image' src={imageUrl}/>
        <h4 className="post_text"><strong>{username}:</strong> {caption}</h4>
        {/* {console.log(comments)} */}
        <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <b>{comment.username}</b> {comment.text}
            </p>
          ))}
        </div>
            {user && (

        <form className="post_commentBox">
            <input className="post_input" type="text" placeholder="Add a Comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
            <button disabled={!comment} className="post_button" type="submit" onClick={postComment}>Post</button>
        </form>
            )}

        </div>
    )
}

export default Post

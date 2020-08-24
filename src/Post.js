import React, { useEffect, useState } from 'react';
// import mountain from "./mountain.jpg";
import "./Post.css";
import profile from "./profile.jpg";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./Firebase";
import firebase from 'firebase';

function Post({postId,user, username, caption, imageUrl}) {
    // console.log("post id 1: "+ postId + username);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')

    useEffect(() => {
      let unsubscribe;
        // console.log("postId is :" + postId);
        if (postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) =>
                    doc.data()
                ))
            });
        } 
        return () => {
            unsubscribe();
        };
    },[postId]); 

    const postComment = (event) => {
        // console.log("Inside post Comment");
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt="ravjain"
                    src={profile} 
                />
                <h3>{username}</h3>
            </div>
           
            
            <img className="post_image" src={imageUrl} alt=""/>
        
            <h4 className="post_text"><strong>{username}: </strong>{caption}</h4>
            
            <div className="post_comment">
                {
                comments.map((comment) => (
                    <p>
                        {/* {console.log("comment text: "+ comment.username)} */}
                        <b className="post_user">{comment.username}: </b> {comment.text}
                    </p>
                ))
                }
            </div>
            {user?(
              <form className="post_commentBox">
                <input className="post_input" type="text" placeholder="Enter your comments" 
                value={comment} onChange={(e) => setComment(e.target.value)}>
                </input>
                <button className="post_button" type="submit" onClick={postComment}>Post</button>
              </form>
            ):(
                <input disabled className="warning" type="text" placeholder="Login to enter your comments"/>
            )}

        </div>
    )
}

export default Post

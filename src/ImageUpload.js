import React,{ useState } from 'react'
import { Button, Modal, makeStyles } from '@material-ui/core'
import { storage, db } from "./Firebase";
import firebase from "firebase";
import "./ImageUpload.css";

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
//Styling for Modal provided my MaterialUI

function ImageUpload({username}) {
    console.log("username: "+ username)
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [openUpload, setOpenUpload] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    const handleChange = (e) => {
      if (e.target.files[0]) {
          setImage(e.target.files[0]);
      }
    }
    
    const handleUpload = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //Progress function...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          //Error function...
          console.log(error);
          alert(error.message);
        },
        () => {
          //Complete Function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              // post  image inside db
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username
              })

              setProgress(0);
              setCaption("");
              setImage(null);
              setOpenUpload(false);
            })
        }
      )
    }

    return (
      <div>
        <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
          <div style={modalStyle} className={classes.paper}>
            <div clasName="imageupload">
              <progress className="imageupload_prog" value={progress} max="100" />
              <input className="upload_caption" type="text" placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)}></input>
              <input type="file" onChange={handleChange} />
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </Modal>
        <div className="upload">
          <button className="upload_button" onClick={() => setOpenUpload(true)}>Upload</button>
        </div>
        
      </div>
    )
}

export default ImageUpload

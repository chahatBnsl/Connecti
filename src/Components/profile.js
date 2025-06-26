import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { database } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import './Profile.css'
import Like from './Like';
import Like2 from './Like2';
import Avatar from '@mui/material/Avatar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';

import AddComment from './AddComment';
import Comments from './Comments';
function Profile() {
    const {id} = useParams();
    
    const [userData,setUserData] = useState(null);
    const [posts,setPosts] = useState(null);
    const [open, setOpen] = useState(null);

    const handleClickOpen = (id) => {
      setOpen(id);
    };
  
    const handleClose = () => {
      setOpen(null);
    };
    useEffect(()=>{
       
       let unsub= database.users.doc(id).onSnapshot((snap)=>{
            setUserData(snap.data());    
        })
        return unsub;
    },[id])
   
    useEffect(()=>{
        const fun=async()=>{
            if(userData!=null){
            let parr = []
            for(let i=0;i<userData.postIds.length;i++){
                let postData = await database.posts.doc(userData.postIds[i]).get()
                parr.push({...postData.data(),postId:postData.id})
            } 
            setPosts(parr);
             }
        }
        fun();
    })
  return (
    
    <>
    {
        posts==null || userData==null?<CircularProgress/>:
        <>
         <Navbar userData= {userData}/>
            <div className="spacer">

            </div>
            <div className='container'>
                <div className='upper-part'>
                    <div className='profile-img'>
                        <img src={userData.ProfileUrl}/>
                    </div>
                    <div className='info'>
                        <Typography variant='h5'>
                            Email :{userData.email}
                        </Typography>
                        <Typography variant='h6'>
                            Posts :{userData.postIds.length}
                        </Typography>
                    </div>
                </div>
                <hr style={{marginTop:'3rem',marginBottom:'3rem'}}/>  
                <div className='profile-video'>
                {     
                    posts.map((post,index)=>(
                       
                        <React.Fragment key ={index}>
                            <div className='videoos'>
                                <video muted="muted" onClick={()=>handleClickOpen(post.pId)}>
                                                <source src={post.pUrl}/>
                                </video>
                                
                                <Dialog
                                     open={open==post.pId}
                                     onClose={handleClose}
                                     aria-labelledby="alert-dialog-title"
                                     aria-describedby="alert-dialog-description"
                                     fullWidth={true}
                                     maxWidth='md'  
                                >
                                    <div className='modal-container'>
                                        <div className='video-modal'>
                                            <video autoPlay={true} muted="muted" controls>
                                                <source src={post.pUrl}/>
                                            </video>
                                        </div>
                                        <div className='comment-modal'>
                                        <Card className='card1' style={{padding:'1rem'}}>
                                            <Comments postData={post}/>
                                        </Card>
                                        <Card variant="outlined" className='card2'>
                                           <Typography style={{padding:'0.4rem'}}>
                                                {post.likes.length==0?'Liked by nobody':`Liked by ${post.likes.length} users`}
                                           </Typography>
                                           <div style={{display:'flex'}}>
                                                <Like2 postData={post} userData={userData} style={{display:'flex',alignItems:'center',justifyContent:'center'}}/>
                                                <AddComment userData={userData} postData={post}/>
                                            </div>

                                        </Card>

                                        </div>
                                    </div>
                                
                                </Dialog>

                            </div>
                        </React.Fragment>

                    ))




                }
                
                </div>

            </div>
       
        </>


     }
            
    </>
          
  )
}

export default Profile

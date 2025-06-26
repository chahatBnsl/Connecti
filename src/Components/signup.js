import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import {makeStyles} from '@mui/styles';
import Alert from '@mui/material/Alert';
import './Signup.css';
import insta from '../Assets/Instagram.jpg'
import TextField from '@mui/material/TextField';
import {Link,useNavigate} from 'react-router-dom';
import { useState,useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { database, storage } from '../firebase';

export default function Login() {
    const useStyles = makeStyles({
        text1:{
            color:'grey',
            textAlign:'center'
        },
        card2:{
            height:"6vh",
            marginTop:"2%",   

        }
    })
     const classes = useStyles();
     const [email,setEmail] = useState('');
     const [password,setPassword]= useState('');
     const [fname,setName] = useState('');
     const [file,setFile] = useState(null);
     const[error,setError]= useState('');
     const[loading,setLoading]= useState(false);
     const history= useNavigate();
     const {signup} =useContext(AuthContext);
  
     const handleClick=async()=>{
    
        if(file==null){
            setError("Please upload profile image first");
            setTimeout(()=>{
                setError('');
            },2000);
            return;
        }
        try {
            setError('');
            setLoading(true);
          
            let userObj = await signup(email,password);
            console.log('++++++');
            console.log(userObj);
            let uid= userObj.user.uid;
            console.log('++++++');
                let uploadtask= storage.ref(`/users/${uid}/ProfileImage`).put(file);
                uploadtask.on('state_changed',fn1,fn2,fn3);
        
                function fn1(snapshot){
                    let  progress =(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log(`uplode${progress}`)
                 
                }
                function fn2(err){
                    setError(err);
                    setTimeout(()=>{
                        setError('');
                    },2000);
                    setLoading(false);
                    return;
                }
                function fn3 (){
                    uploadtask.snapshot.ref.getDownloadURL().then((url)=>{
                        console.log(url);
                        database.users.doc(uid).set({
                            email:email,
                            userId:uid,
                            fullName:fname,
                            ProfileUrl:url,
                            postIds:[],
                            createdAt:database.getTimeStamp()

                        })
                    })
                    setLoading(false);
                    history('/');
                }
        
        
           
        }
        catch(err){
            setError(err);
            
            setTimeout(()=>{
                setError('');
            },2000);
            return;

        }
       


     }
  return (
    <div className='signupWrapper'>
        <div className='signupCard'>
            <Card variant='outlined'>
                <div className='insta-logo'>
                    <img src={insta} alt=""/>

                </div>
                <CardContent>
                    <Typography variant="subtitle1" className={classes.text1} >
                        Sign up to see photos and videos from your friends.
                    </Typography>
                    {error!='' && <Alert severity="error">{error}</Alert>}
                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true}  margin="dense" size="small" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin="dense" size="small" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <TextField id="outlined-basic" label="Full Name" variant="outlined" fullWidth={true} margin="dense" size="small" value={fname} onChange={(e)=>setName(e.target.value)}/>
                    <Button size="small" color="secondary" fullWidth={true} variant ="outlined" margin="dense" startIcon={<CloudUploadIcon/>}  component ="label" >
                           Upload Profile Image
                           <input type="file" accept ="image/*" hidden onChange={(e)=>setFile(e.target.files[0])} />
                    </Button>
                </CardContent>
                
                <CardActions>
                    <Button  color="primary" fullWidth={true} variant ="contained" disabled ={loading} onClick={handleClick}>
                    Sign up
                    </Button>
                </CardActions>
                <CardContent>
                    <Typography className={classes.text1} variant ="subtitle1">
                        By Singing up, you agree to our Terms , Conditions and Cookies policy.
                    </Typography>
                </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card2}>
                <CardContent>
                    <Typography className={classes.text1} variant ="subtitle1" >
                        Having an account? <Link to='/login' style={{textDecoration:"none"}}>Login</Link>
                    </Typography>
                </CardContent>

            </Card>
        </div>
    </div>
    
  );
}

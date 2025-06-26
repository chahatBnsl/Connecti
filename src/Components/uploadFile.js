import React,{useState} from 'react'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MovieIcon from '@mui/icons-material/Movie';
import LinearProgress from '@mui/material/LinearProgress';
import { database, storage } from '../firebase';
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from 'react-router-dom';



function UploadFile(props) {
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const history=useNavigate(); 
    const handleChange= async(file)=>{
        if(file==null){
            setError('Please select a file first');
            setTimeout(()=>{
                setError('')
            },2000);
            return;
        }
        if(file.size/(1024*1024)>100){
            setError('This video is very large');
            setTimeout(()=>{
                setError('')
            },2000);
            return;
        }
        let uid = uuidv4();
        setLoading(true);
        let uploadtask= storage.ref(`/users/${uid}/${file.name}`).put(file);
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
                let obj ={
                    likes:[],
                    comments:[],
                    pId:uid,
                    pUrl:url,
                    uName:props.user.fullName,
                    uProfile:props.user.ProfileUrl,
                    userId:props.user.userId,
                    createdAt:database.getTimeStamp()
                }
                console.log(obj);
                database.posts.add(obj).then(async (ref)=>{
                    let res= await database.users.doc(props.user.userId).update({
                        postIds: props.user.postIds? [...props.user.postIds,ref.id]:[ref.id]
                    })
                }).then(()=>{
                    setLoading(false);

                }).catch((err)=>{
                    setError(err);
                    loading(false);
                    setTimeout(()=>{
                        setError('')
                    },2000)
                }

                )
             
            }).catch((err)=>{
                setError(err);
                loading(false);
                setTimeout(()=>{
                    setError('')
                },2000)
            }

            )
            
            history('/');
        }



    }

  return (
    <div style={{marginTop:'5rem',marginBottom:'1rem'}}>
        {error!=''?<Alert severity="error">error</Alert>:
        <>

            <input type="file" accept='vedio/*' id = "upload-input" style={{display:'none'}} onChange={(e)=>{handleChange(e.target.files[0])}}/>
            <label htmlFor='upload-input'>
                <Button 
                    variant="outlined"
                    color='secondary'
                    disabled={loading}
                    component='span'
                >
                    <MovieIcon/>&nbsp;Upload Video
                
                </Button>
            </label>
            {loading&&<LinearProgress color="secondary" style={{marginTop:'3%'}}/>}
        </>
        }




    </div>
  )
}

export default UploadFile

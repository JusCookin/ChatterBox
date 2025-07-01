import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext as App } from '../../context/AppContext';


const ProfileUpdate = () => {
  const navigate=useNavigate();
  const [image,setImage]=useState(false);
  const [name,setName]=useState("");
  const [bio,setBio]=useState("");
  const [prevImage,setPrevImage]=useState("");
  const [uid,setUid]=useState("");
  const {setUserData}=useContext(App);

  const profileUpdate=async(event)=>{
    event.preventDefault();
    try{
      if(!prevImage && !image){
        toast.error("Upload profile picture");
        return;
      }
      const docRef=doc(db,'users',uid);
      if(image){
        const imgUrl=await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          bio:bio,
          name:name
        })
      }
      else{
        await updateDoc(docRef,{
          bio:bio,
          name:name
        })
      }
    const snap=await getDoc(docRef);
    setUserData(snap.data());
    navigate('/chat');
    }
    catch(error){
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        setUid(user.uid);
        const docRef=doc(db,"users",user.uid);
        const docSnap=await getDoc(docRef);
        if(docSnap.data().name){
          setName(docSnap.data().name);
        }
        if(docSnap.data().bio){
          setBio(docSnap.data().bio);
        }
        if(docSnap.data().avatar){
          setPrevImage(docSnap.data().avatar);
        }
      }
      else{
        navigate('/');
      }
    })
  },[])

  return (
    <div className='profile'>
      <div className='profile-container'>
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor='avatar'>
            <input onChange={(e)=>setImage(e.target.files[0])} type='file' id='avatar' accept='.png,.jpg,.jpeg' hidden/>
            <img src={image?URL.createObjectURL(image):prevImage||assets.profile} />
            upload profile image
          </label>
          <input type='text' placeholder='Your name' onChange={(e)=>setName(e.target.value)} value={name} required/>
          <textarea placeholder='Write profile bio' onChange={(e)=>setBio(e.target.value)} value={bio}></textarea>
          <button type='submit'>Save</button>
        </form>
        <img src={image?URL.createObjectURL(image):prevImage||assets.profile} className='profile-pic'/>
      </div>
    </div>
  )
}

export default ProfileUpdate
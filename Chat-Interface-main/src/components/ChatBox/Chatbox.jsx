import React, { useContext, useEffect, useState } from 'react'
import './Chatbox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, getDoc,doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import upload from '../../lib/upload'

const Chatbox = () => {
  const {userData,messagesId,chatUser,messages,setMessages}=useContext(AppContext);
  const [input,setInput]=useState("");

  const sendMessage=async ()=>{
    try{
      if(input && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:arrayUnion({
            sId: userData.id,
            text:input,
            createdAt:new Date()
          })
        })
        const userIDs=[chatUser.rId,userData.id];
        userIDs.forEach(async(id)=>{
          const userChatsRef=doc(db,'chats',id);
          const userChatsSnapshot=await getDoc(userChatsRef);
          if(userChatsSnapshot.exists()){
            const userChatData=userChatsSnapshot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===messagesId);
            userChatData.chatsData[chatIndex].lastMessage=input.slice(0,30);
            userChatData.chatsData[chatIndex].updatedAt=Date.now();
            if(userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    }
    catch(error){
      toast.error(error.message);
    }
    setInput("");
  }

  const sendImage=async (e)=>{
    console.log("Triggered image upload...");
    try{
      const fileUrl=await upload(e.target.files[0]);
      console.log("Uploaded File URL:", fileUrl);

      if(fileUrl && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:arrayUnion({
            sId: userData.id,
            image:fileUrl,
            createdAt:new Date()
          })
        })
        const userIDs=[chatUser.rId,userData.id];
        userIDs.forEach(async(id)=>{
          const userChatsRef=doc(db,'chats',id);
          const userChatsSnapshot=await getDoc(userChatsRef);
          if(userChatsSnapshot.exists()){
            const userChatData=userChatsSnapshot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===messagesId);
            userChatData.chatsData[chatIndex].lastMessage="Image";
            userChatData.chatsData[chatIndex].updatedAt=Date.now();
            if(userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    }
    catch(error){
      toast.error(error.message);
    }
  }

  const convertTimestamp=(timestamp)=>{
    let date=timestamp.toDate();
    const hour=date.getHours();
    const minute=date.getMinutes();
    if(hour>12){
      return hour-12+ ":" +minute+"PM";
    }
    else{
      return hour+ ":" +minute+"AM";
    }
  }

  useEffect(()=>{
    if(messagesId){
      const unSub=onSnapshot(doc(db,'messages',messagesId),(res)=>{
        setMessages(res.data().messages);
        console.log(res.data().messages.reverse());
      })
      return()=>{
        unSub();
      }
    }
  },[messagesId])
  return chatUser?(
    <div className='chat-box'>
      <div className='chat-user'>
        <img src={chatUser.userData.avatar} style={{height: "40px"}}/>
        <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen<=7000? <img  className='dot' src={assets.green_dot} style={{height: "10px",width:"10px"}}/>:null}</p>
        <img src={assets.info} className='help' style={{height: "20px",width:"20px"}}/>
      </div>
      <div className='chat-msg'>
        {messages.map((msg,index)=>(
          <div  key={index} className={msg.sId===userData.id?'s-msg':'r-msg'}>
          {msg.image?
          <img className='msg-image' src={msg.image} style={{height: "200px",width:"300px",marginBottom:"15px"}}/>
          :
          <p className='msg'>{msg.text}</p>
        }
          <div>
            <img src={msg.sId===userData.id? userData.avatar: chatUser.userData.avatar}/>
            <p>{convertTimestamp(msg.createdAt)}</p>
          </div>
        </div>
        ))}
      </div>
      <div className='chat-input'>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type='text' placeholder='Send a message'/>
        <input onChange={sendImage} type='file' id="image" style={{height: "20px",width:"20px"}} accept='image/png, image/jpeg' hidden/>
        <label htmlFor='image'>
          <img src={assets.img} style={{height: "40px",width:"40px"}}/>
        </label>
        <img onClick={sendMessage} src={assets.send} style={{height: "40px",width:"40px"}}/>
      </div>
    </div>
  )
  :
  <div className='chat-welcome'>
    <img src={assets.logo}/>
    <p>Chat anytime, anywhere</p>
  </div>
}

export default Chatbox
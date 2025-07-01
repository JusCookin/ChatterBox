import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signUp,login } from '../../config/firebase' 

const Login = () => {
    const [currState,setCurrState]=useState("Sign Up");
    const [userName,setUserName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const onSubmitHandler=(event)=>{
        event.preventDefault();
        if(currState==="Sign Up"){
            signUp(userName,email,password);
        }
        else{
            login(email,password);
        }
    }
  
    return (
    <div className="login">
        <div>
        <img src={assets.logo} className="logo"/>
        <h2>Chatapp</h2>
        </div>
        <form className='login-form' onSubmit={onSubmitHandler}>
            <h1 className='header'>{currState}</h1>
            {currState=="Sign Up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder='username' className='form-input'/>:null}
            <input type="email" placeholder='email' className='form-input' onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <input type="password" placeholder='password' className='form-input' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <button type='submit' className='signUp-btn'>{currState==="Sign Up"?"Create account":"login"}</button>
            <div className='login-term'>
                <input type="checkbox"/>
                <p>Agree to the terms of use & privacy policy</p>
            </div>
            <div className='login-forgot'>
                {currState=="Sign Up"?
                <p className='login-toggle'>Already have an account?<span onClick={()=>setCurrState("login")}>click here</span></p>
                :
                <p className='login-toggle'>Create an account?<span onClick={()=>setCurrState("Sign Up")}>click here</span></p>
                }
            </div>
        </form>
    </div>
  )
}

export default Login
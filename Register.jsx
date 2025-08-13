import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPhone, FiUser } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa";
import { FiLock } from "react-icons/fi";

 export default function SignUp (){
 const [error,setErrorMessage]=useState("");
 const [confirmPassword, setConfirmPassword] = useState("");;
 const navigate=useNavigate();
 const [regData, setRegData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    phone:"",
    password:""
 })

 const isContinue=()=>
 regData.firstName.trim()!== "" &&
 regData.lastName.trim()!== "" &&
 regData.email.trim()!== "" &&
 regData.phone.trim()!== "" &&
 regData.password.trim()!== "" &&
 confirmPassword.trim()!== "";

 const handleReg=async(e)=>{
  console.log("regData", regData)
  e.preventDefault()
  if (!isContinue){
    setErrorMessage("Please fill all required fields")
    return;
  }
  if(regData.password!==confirmPassword){
    setErrorMessage("Password do not match")
    return;
  }

  try{
    const response = await axios.post("http://localhost:3003/users/register",regData);
    alert("Regsiter succesfully");
    navigate("/");
    console.log("Register" ,response.data)
  }catch(error){
    setErrorMessage(error.response?.data?.message || "SignUp failed. Please try again")
  }
 };
 return(
    <>
     <div className=" flex min-h-screen justify-center items-centre  bg-slate-600">
     <form className="bg-white shadow-lg rounded-xl p-8 w-full my-20 max-w-md" onSubmit={handleReg}> 
         <h1 className="text-2xl font-bold text-center text-slate-600">Create Your Account</h1>
         {error && (<div className="text-red-500 text-sm text-center mb-4 "> {error} </div>)}
         <div className="mt-5">
          <label className="text-sm font-medium mt-5">First Name</label>
          <div className="flex items-center border rounded px-3 mt-1"> 
            <FiUser className="text-gray-400" />
          <input 
             type="text"
             name="FirstName"
             placeholder="Enter your First Name"
             className="w-full px-2 py-2 outline-none "
             value={regData.firstName}
             onChange={(e)=>
           setRegData({...regData, firstName:e.target.value})
             }
              required   
          />
          </div>
         </div>

         <div>
          <label className="text-sm font-md mt-5">Last Name</label>
          <div className="flex aligns-center border rounded px-3 mt-1">
            <FiUser className="text-gray-400 mt-3" />
            <input 
             type="text"
             name="LastName"
             placeholder="Enter your Last Name"
             className="w-full px-2 py-2 outline-none "
             value={regData.lastName}
             onChange={(e)=>
              setRegData({...regData,lastName:e.target.value})
             }
              required
            />
             
            </div>
         </div>

         <div>
          <label className="text-sm font-md mt-5">Email</label>
          <div className="flex aligns-center border rounded px-3 mt-1">
            <FaEnvelope className="text-gray-400 mt-3" />
        <input 
        type="email"
        name="Email"
        placeholder="Enter your Email"
        className="w-full px-2 py-2 outline-none"
        value={regData.email}
        onChange={(e)=>
          setRegData({...regData,email:e.target.value})
        }
        required
        />
          </div>
          </div>

 <div>
          <label className="text-sm font-md mt-5">Phone </label>
          <div className="flex aligns-center border rounded px-3 mt-1">
            <FiPhone className="text-gray-400 mt-3"/>
        <input 
        type="number"
        name="phone"
        placeholder="Enter your phone number"
        className="w-full px-2 py-2 outline-none"
        value={regData.phone}
        onChange={(e)=>
          setRegData({...regData, phone:e.target.value})
        }
        required
        />
          </div>
          </div>

<div>
  <label className="text-sm font-md mt-5">Password</label>
  <div className="flex aligns-center border rounded px-3 mt-1">
    <FiLock className="text-gray-400 mt-3" />
   <input 
   type="password"
   name="password"
   placeholder="Enter your password"
   className="w-full px-2 py-2 outline-none"
   value={regData.password}
   onChange={(e)=>
    setRegData({...regData,password:e.target.value})
   }
   />
  </div>
</div>

<div>
  <label className="text-sm font-md mt-5">Confirm Password</label>
  <div className="flex aligns-center border rounded px-3 mt-1">
     <FiLock className="text-gray-400 mt-3" />
 <input 
   type="password"
   name="confirm"
   placeholder="Confirm password"
   className="w-full px-2 py-2 outline-none"
   value={confirmPassword}
   onChange={(e)=>
    setConfirmPassword(e.target.value)
   }
   />
  </div>
</div>


  <button 
  type="submit"
  className={`bg-neutral-500 w-full py-2 my-6 text-white hover:bg-neutral-400 ${
                  isContinue()
                    ? "bg-blue-600 hover:bg-neutral-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isContinue()}
                
  > Sign Up </button>

<p className="mt-6 text-sm-gray-600 text-center">
  Already have account?{" "}
  <Link to="/" className="text-purple-600 hover:underline" >Sign In </Link>
</p>
        </form>
     </div>
    </>
 )
 }
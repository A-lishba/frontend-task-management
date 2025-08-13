// import React from "react";
// export default function Header(){
//     return(
//         <header className="bg-slate-800 text-3xl text-neutral-100">   
//             <h1 className="flex text-white font-bold font-poppins p-5 font-italic">DoneDesk</h1> 
//             </header>

//     )

// }

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
     const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  return (
    <header className="bg-slate-800 text-neutral-100 px-5 py-3 flex justify-between items-center">
      {/* Left: Logo */}
      <h1 className="text-3xl font-bold font-poppins italic">DoneDesk</h1>

      {/* Right: Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
      >
        Logout
      </button>
    </header>
  );
}

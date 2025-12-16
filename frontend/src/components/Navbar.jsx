
import { Link, NavLink} from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

export default function Navbar(){
  const { user } = useAuth();
 return (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Agrico
      </Link>
      <div className="space-x-6 text-gray-700 font-medium hidden md:flex">
        <NavLink
          to="/"
          className = {({ isActive }) =>
            isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
        >
            Home
        </NavLink>
          <NavLink
            to="/ProductManagement"
            className = {({ isActive }) =>
              isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
          >
            Products
          </NavLink>
        <NavLink
          to="/OrderManagement"
          className = {({ isActive }) =>
            isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
        >
            Orders
        </NavLink>
          <NavLink
            to="/features"
            className = {({ isActive }) =>
              isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
          }
          >
            Features
          </NavLink>
        <NavLink
            to={user ? "/UserManagement" : "/auths"}
            className = {({ isActive }) =>
            isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
          }
        >
            Users
          </NavLink>
        <NavLink
          to="/EmailDashboard"
          className = {({ isActive }) =>
            isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
        >
            Emails
        </NavLink>
          <NavLink
            to="/AboutUs"
            className = {({ isActive }) =>
              isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/ContactUs"
            className = {({ isActive })=>
              isActive? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
            }
          >
            Contacts
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

// import { Link, NavLink } from 'react-router-dom';
// import { useAuth } from "../context/AuthContext";
// import { useState, useRef, useEffect } from 'react';

// export default function Navbar() {
//   const { user } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
//         <Link to="/" className="text-2xl font-bold text-blue-600">
//           Agrico
//         </Link>

//         <div className="space-x-6 text-gray-700 font-medium hidden md:flex">
//           <NavLink to="/" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Home</NavLink>

//           <NavLink to="/ProductManagement" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Products</NavLink>

//           <NavLink to="/OrderManagement" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Orders</NavLink>

//           <NavLink to="/features" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Features</NavLink>

//           <NavLink to={user ? "/UserManagement" : "/auths"} className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Users</NavLink>

//           <NavLink to="/EmailDashboard" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Emails</NavLink>

//           <NavLink to="/AboutUs" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>About</NavLink>

//           <NavLink to="/ContactUs" className={({ isActive }) =>
//             isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600"
//           }>Contacts</NavLink>
//         </div>

//         {/* Profile Section */}
//         <div className="relative ml-4" ref={dropdownRef}>
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center focus:outline-none"
//           >
//             {user?.photoURL ? (
//               <img
//                 src={user.photoURL}
//                 alt="profile"
//                 className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
//                 {user ? user.name?.[0].toUpperCase() : "?"}
//               </div>
//             )}
//           </button>

//           {/* Dropdown Menu */}
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
//               {user ? (
//                 <>
//                   <div className="px-4 py-2 border-b">
//                     <p className="font-medium">{user.name}</p>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                   </div>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     My Profile
//                   </Link>
//                   <Link
//                     to="/settings"
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     Settings
//                   </Link>
//                   <Link
//                     to="/logout"
//                     className="block px-4 py-2 text-red-600 hover:bg-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     Logout
//                   </Link>
//                 </>
//               ) : (
//                 <Link
//                   to="/auths"
//                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                   onClick={() => setDropdownOpen(false)}
//                 >
//                   Login / Signup
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

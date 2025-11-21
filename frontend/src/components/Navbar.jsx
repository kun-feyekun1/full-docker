
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
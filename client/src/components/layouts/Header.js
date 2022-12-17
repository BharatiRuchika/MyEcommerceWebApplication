import React from 'react';
import '../../App.css';
import {Route,Link} from "react-router-dom";
import Search from './search';
import { useSelector,useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import {logoutUser} from "../../actions/userActions";
// import "../../App.css";
import '../../App.css'
const Header=()=>{
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const {cartItems} = useSelector(state=>state.cart)
  console.log("cartItems",cartItems);
  // console.log("user",user);
  // console.log("loading",loading);
  const logoutHandler = ()=>{
    dispatch(logoutUser());
    alert.success("Logged out Successfully...");
  }
  // console.log("user",isEmpty(user));
    return(
   <>
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to="/">
          <img src="/images/shopit_logo.png" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
         <Route render={({history})=><Search history={history}/>}/>
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
      { user && user.role==="user" &&  <Link to="/cart" style={{textDecoration:"none"}}>
        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">
          
          {cartItems==null ? 0 :cartItems.length}
          </span>
        </Link>}

        {user ? (
          <div className="ml-4 dropdown d-inline">
             <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

<figure className="avatar avatar-nav">
    <img
        src={user.avatar && user.avatar.url}
        alt={user && user.name}
        className="rounded-circle"
    />
</figure>
<span>{user && user.name}</span>
</Link>
<div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
{user && user.role==='admin' ?
<>
  <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
  <Link to="/me" className="dropdown-item">Profile</Link>
<Link className="dropdown-item text-danger" onClick={logoutHandler} to="/">
   Logout
</Link></>:
<>
<Link to="/orders/me" className="dropdown-item">Orders</Link>
<Link to="/me" className="dropdown-item">Profile</Link>
<Link className="dropdown-item text-danger" onClick={logoutHandler} to="/">
   Logout
</Link>
</>}
 
</div>
          </div>
        ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>}
      </div>
    </nav>

   
   </>)
}
export default Header;
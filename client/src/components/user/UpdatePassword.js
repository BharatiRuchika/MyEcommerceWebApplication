import React,{useEffect,useState} from 'react'
import { useAlert } from 'react-alert'
import { useDispatch,useSelector } from 'react-redux'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import {Link} from 'react-router-dom';
import {updatePassword,loadUser,clearErrors} from "../../actions/userActions";
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';

const UpdatePassword = ({history}) => {
const [oldPassword,setOldPassword] = useState('');
const [newPassword,setNewPassword] = useState('');

const alert = useAlert();
const dispatch = useDispatch();
const {user,token} = useSelector(state=>state.auth);
const {isUpdated,loading,error} = useSelector(state=>state.user);

useEffect(() => {
   if(error){
       alert.error(error);
       dispatch(clearErrors());
   }
   if(isUpdated){
       alert.success("password updated successfully");
       
       history.push("/me");
       dispatch({
           type:UPDATE_PASSWORD_RESET
       })
   }
}, [dispatch,alert,isUpdated,error,history])
const submitHandler = (e)=>{
 e.preventDefault();
 const formData = new FormData();
 
 formData.set("oldPassword",oldPassword);
 formData.set("newPassword",newPassword);

 
 dispatch(updatePassword(formData,token))
}


    return (
       <>
       <MetaData title={'change password'}></MetaData>
       <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e)=>setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={newPassword}
                                onChange={(e)=>setNewPassword(e.target.value)}
                            />
                             </div>

<button type="submit" disabled={loading?true:false}className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
</form>
</div>
</div>
       </>
    )
}

export default UpdatePassword

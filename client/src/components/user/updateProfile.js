import React,{useEffect,useState} from 'react'
import { useAlert } from 'react-alert'
import { useDispatch,useSelector } from 'react-redux'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import {Link} from 'react-router-dom';
import {updateProfile,loadUser,clearErrors} from "../../actions/userActions";
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
const UpdateProfile = ({history}) => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [avatar,setAvatar] = useState("");
    const [avatarPreview,setAvatarPreview] = useState("/images/default_avatar.jpg");
    const alert = useAlert();
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth);
    const {isUpdated,loading,error} = useSelector(state=>state.user);
   
    useEffect(() => {
        if(user){
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
       if(error){
           alert.error(error);
           dispatch(clearErrors());
       }
       if(isUpdated){
           alert.success("user updated successfully");
           dispatch(loadUser());
           history.push("/me");
           dispatch({
               type:UPDATE_PROFILE_RESET
           })
       }
    }, [dispatch,alert,isUpdated,error,history])
    const submitHandler = (e)=>{
     e.preventDefault();
     const formData = new FormData();
     formData.set("name",name);
     formData.set("email",email);
   
     formData.set("avatar",avatar);
     dispatch(updateProfile(formData))
    }
    const onChange = e =>{
      
          const reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = ()=>{
              if(reader.readyState == 2){
                  setAvatarPreview(reader.result);
                  setAvatar(reader.result);
              }
          }
        
    }
    return (
       <>
       <MetaData title={'Update Profile'}></MetaData>
        <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                name="email"
                                className="form-control"
                              
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                    className='custom-file-input'
                                    id='customFile'
                                    accept="image/*"
                                    onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>
                      
                        <button type="submit" disabled={loading?true:false} className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                    </form>
                </div>
            </div>
       </>
    )
}

export default UpdateProfile

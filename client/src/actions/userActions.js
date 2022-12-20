import {LOGIN_REQUEST,LOGIN_SUCCESS,LOGIN_FAIL,CLEAR_ERRORS,REGISTER_USER_FAIL,REGISTER_USER_SUCCESS,REGISTER_USER_REQUEST,
LOAD_USER_FAIL,LOAD_USER_REQUEST,LOAD_USER_SUCCESS,LOGOUT_FAIL,LOGOUT_SUCCESS,
UPDATE_PASSWORD_FAIL,UPDATE_PROFILE_SUCCESS,UPDATE_PASSWORD_REQUEST,UPDATE_PASSWORD_SUCCESS,UPDATE_PROFILE_FAIL,UPDATE_PROFILE_REQUEST,
FORGOT_PASSWORD_FAIL,
FORGOT_PASSWORD_REQUEST,
FORGOT_PASSWORD_SUCCESS,
NEW_PASSWORD_FAIL,
NEW_PASSWORD_REQUEST,
NEW_PASSWORD_SUCCESS,
ALL_USERS_SUCCESS,
ALL_USERS_REQUEST,
ALL_USERS_FAIL,
UPDATE_USER_SUCCESS,
UPDATE_USER_REQUEST,
UPDATE_USER_FAIL,
USER_DETAILS_REQUEST,
USER_DETAILS_SUCCESS,
USER_DETAILS_FAIL,
DELETE_USER_FAIL,
DELETE_USER_REQUEST,
DELETE_USER_SUCCESS
} from "../constants/userConstants";

// import { getStripeData} from '../actions/stripeActions';
import axios from "axios";

//login
export const login = (email,password)=>async(dispatch)=>{
    
    // console.log("im in login");
   try{
     dispatch({
         type:LOGIN_REQUEST
    })
    const config={
      headers:{
          'Content-Type':'application/json'
      }
    }
const {data} = await axios.post("https://my-ecommerce-web-application.vercel.app/auth/login",{email,password},config)
// console.log("loginuserdata",data);
dispatch({
    type:LOGIN_SUCCESS,
    payload:data.user
})
dispatch({
    type: "AUTH",
    payload: { token: data.token },
  });
   }catch(error){
    //    console.log("im in login catch");
    //    console.log("error",error.response.data.errMessage);
    dispatch({
        type:LOGIN_FAIL,
        payload:error.response.data.errMessage
    })
   }
}

//register user
export const register = (userData)=>async(dispatch)=>{
    // console.log("im in register");
    try{
      dispatch({
          type:REGISTER_USER_REQUEST
     })
     const config={
       headers:{
           'Content-Type':'multipart/form-data'
       }
     }
 const {data} = await axios.post("https://my-ecommerce-web-application.vercel.app/auth/register",userData,config)
//  console.log("registerdata",data);
 dispatch({
     type:REGISTER_USER_SUCCESS,
     payload:data.user
 })
 
    }catch(error){
        console.log("error",error.response);
     dispatch({
         type:REGISTER_USER_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

 //load user
 export const loadUser = (token)=>async(dispatch)=>{
    //  console.log("im in load user");
    try{
      dispatch({
          type:LOAD_USER_REQUEST
     })
     const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
 const {data} = await axios.get("https://my-ecommerce-web-application.vercel.app/auth/me",config);
 dispatch({
     type:LOAD_USER_SUCCESS,
     payload:data.user
 })
// }
    }catch(error){
    //   console.log("Error",error);
     dispatch({
         type:LOAD_USER_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

 //logout user
 export const logoutUser = ()=>async(dispatch)=>{
    // console.log("im in load user");
   try{
  const {data} = await axios.get("https://my-ecommerce-web-application.vercel.app/auth/logout");
// console.log("logoutuserdata",data);
dispatch({
    type:LOGOUT_SUCCESS
})
}catch(error){
    // console.log("logouterrpr",error);
    dispatch({
        type:LOGOUT_FAIL,
        payload:error.response.data.errMessage
    })
   }
}

//register user
export const updateProfile = (userData,token)=>async(dispatch)=>{
    // console.log("im in register");
    console.log("im in update profile")
    console.log("token",token)
    try{
      dispatch({
          type:UPDATE_PROFILE_REQUEST
     })
     const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
 const {data} = await axios.put("https://my-ecommerce-web-application.vercel.app/auth/me/update",userData,config)
//  console.log("userdata",data);
 dispatch({
     type:UPDATE_PROFILE_SUCCESS,
     payload:data.success
 })
 
    }catch(error){
     dispatch({
         type:UPDATE_PROFILE_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

//update password
export const updatePassword = (passwords,token)=>async(dispatch)=>{
    console.log("im in update password");
    console.log("token",token);
    const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
    try{
      dispatch({
          type:UPDATE_PASSWORD_REQUEST
     })
     const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
 const {data} = await axios.put("https://my-ecommerce-web-application.vercel.app/auth/password/updatepassword",passwords,config)
//  console.log("userdata",data);
 dispatch({
     type:UPDATE_PASSWORD_SUCCESS,
     payload:data.success
 })
 
    }catch(error){
        // console.log("error",error.response);
     dispatch({
         type:UPDATE_PASSWORD_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

 //reset password
 export const resetPassword = (token,passwords)=>async(dispatch)=>{
    // console.log("im in new password");
    try{
      dispatch({
          type:NEW_PASSWORD_REQUEST
     })
     const config={
       headers:{
           'Content-Type':'application/json'
       }
     }
 const {data} = await axios.put(`https://my-ecommerce-web-application.vercel.app/auth/password/reset/${token}`,passwords,config)
//  console.log("userdata",data);
 dispatch({
     type:NEW_PASSWORD_SUCCESS,
     payload:data.success
 })
 
    }catch(error){
        // console.log("error",error.response);
     dispatch({
         type:NEW_PASSWORD_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

  //forgot password
  export const forgotPassword = (email)=>async(dispatch)=>{
    // console.log("im in forgot password");
    // console.log("email",email);
    try{
      dispatch({
          type:FORGOT_PASSWORD_REQUEST
     })
     const config={
       headers:{
           'Content-Type':'application/json'
       }
     }
 const {data} = await axios.post("https://my-ecommerce-web-application.vercel.app/auth/password/forgot",email,config)
//  console.log("userdata",data);
 dispatch({
     type:FORGOT_PASSWORD_SUCCESS,
     payload:data.message
 })
 
    }catch(error){
        // console.log("error",error.response);
     dispatch({
         type:FORGOT_PASSWORD_FAIL,
         payload:error.response.data.errMessage
     })
    }
 }

 export const getAllUsers = (token)=>async(dispatch)=>{
    console.log("im in getallusers",token);
    // console.log("im in get users");
    const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
   try{
     dispatch({
         type:ALL_USERS_REQUEST
    })
   
const {data} = await axios.get("https://my-ecommerce-web-application.vercel.app/auth/admin/users",config);
console.log("Allusersdata",data);

dispatch({
    type:ALL_USERS_SUCCESS,
    payload:data.users
})
// }
   }catch(error){
       console.log("im in cathc");
       console.log("error",error);
    dispatch({
        type:ALL_USERS_FAIL,
        payload:error.response.data.errMessage
    })
   }
}


export const updateUser = (id, userData,token) => async (dispatch) => {
    try {
console.log("im in update user");
console.log("token",token);
        dispatch({ type: UPDATE_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${token}`
            }
        }

        const { data } = await axios.put(`https://my-ecommerce-web-application.vercel.app/auth/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

export const getUserDetails = (id,token) => async (dispatch) => {
    try {
console.log("token",token)
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization':`${token}`
    }
}
    dispatch({ type: USER_DETAILS_REQUEST })
 const { data } = await axios.get(`https://my-ecommerce-web-application.vercel.app/auth/admin/user/${id}`,config)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

// Delete user - ADMIN
export const deleteUser = (id,token) => async (dispatch) => {
    // console.log("im in delete user")
    // console.log("id",id);
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`${token}`
            }
        }
 dispatch({ type: DELETE_USER_REQUEST })
  const { data } = await axios.delete(`https://my-ecommerce-web-application.vercel.app/auth/admin/user/${id}`,config);
//   console.log("deleteData",data);  
  dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}
//clear error
export const clearErrors = ()=>async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    })
 }
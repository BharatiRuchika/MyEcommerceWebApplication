import axios from "axios";
import { CREATE_ORDER_FAIL,CREATE_ORDER_SUCCESS,CREATE_ORDER_REQUEST,CLEAR_ERRORS,MY_ORDERS_FAIL,MY_ORDERS_SUCCESS,MY_ORDERS_REQUEST,ORDER_DETAILS_SUCCESS,ORDER_DETAILS_REQUEST,ORDER_DETAILS_FAIL,ALL_ORDERS_SUCCESS,ALL_ORDERS_REQUEST,ALL_ORDERS_FAIL,UPDATE_ORDER_SUCCESS,UPDATE_ORDER_REQUEST,UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
   DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL } from "../constants/orderConstants";
export const createOrder = (order,token)=>async(dispatch,getState)=>{
    // console.log("im in create order");
    // console.log("order",order);
    const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${token}`
        }
      }
    try{
       dispatch({
           type:CREATE_ORDER_REQUEST
       })
       const {data} = await axios.post("http://localhost:3001/order/neworder",order,config);
    //    console.log("order Data",data);
       dispatch({
           type:CREATE_ORDER_SUCCESS,
           payload:data
       })
    }catch(error){
        dispatch({
            type:CREATE_ORDER_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//get currently logged in user orders
export const myOrders = (token)=>async(dispatch,getState)=>{
    console.log("im in myorders");
    console.log("token",token);
    try{
       dispatch({
           type:MY_ORDERS_REQUEST
       })

       const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${token}`
        }
      }
       
       const {data} = await axios.get("http://localhost:3001/order/myorders",config);
    //    console.log("data",data);
       dispatch({
           type:MY_ORDERS_SUCCESS,
           payload:data.orders
       })
    }catch(error){
        dispatch({
            type:MY_ORDERS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//get specific order details
export const orderDetails = (id,token)=>async(dispatch,getState)=>{

    console.log("im in order details");
    console.log("token",token);
    try{
       dispatch({
           type:ORDER_DETAILS_REQUEST
       })
       const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${token}`
        }
      }
const {data} = await axios.get(`http://localhost:3001/order/singleorder/${id}`,config);
    //    console.log("data",data);
       dispatch({
           type:ORDER_DETAILS_SUCCESS,
           payload:data.order
       })
    }catch(error){
        dispatch({
            type:ORDER_DETAILS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}


//get all orders details
export const getAllOrders = (token)=>async(dispatch,getState)=>{
    
    console.log("im in getAllOrders",token);
    const config={
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
        }
      }
    // console.log("im in order details");
    try{
       dispatch({
           type:ALL_ORDERS_REQUEST
       })
       
const {data} = await axios.get(`http://localhost:3001/order/admin/orders`,config);
    //    console.log("data",data);
       dispatch({
           type:ALL_ORDERS_SUCCESS,
           payload:data
       })
    }catch(error){
        dispatch({
            type:ALL_ORDERS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//update order-admin
export const updateOrder = (id,orderData,token)=>async(dispatch,getState)=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json',
                'Authorization':`${token}`
            }
          }
       dispatch({
           type:UPDATE_ORDER_REQUEST
       })
       const {data} = await axios.put(`http://localhost:3001/order/admin/orders/${id}`,orderData,config);
    //    console.log("updateData",data);
       dispatch({
           type:UPDATE_ORDER_SUCCESS,
           payload:data.success
       })
    }catch(error){
        dispatch({
            type:UPDATE_ORDER_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

export const deleteOrder = (id,token) => async (dispatch) => {
    try {
        const config={
            headers:{
                'Content-Type':'application/json',
                'Authorization':`${token}`
            }
          }

        dispatch({ type: DELETE_ORDER_REQUEST })

        const { data } = await axios.delete(`http://localhost:3001/order/admin/orders/${id}`,config)
//    console.log("deleteData",data.success);
        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
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
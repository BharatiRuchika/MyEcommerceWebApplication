import React,{useEffect} from 'react'
import {Link} from "react-router-dom";
import MetaData from '../layouts/MetaData';
import {REMOVE_ALL_ITEMS} from '../../constants/cartConstants';
import { useDispatch,useSelector } from 'react-redux';
const OrderSuccess = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        localStorage.removeItem("cartItems");
        dispatch({ type: REMOVE_ALL_ITEMS })
    },[])
    return (
        <>
        <MetaData title={'Order Success'}></MetaData>
        <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
            <img className="my-5 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />

            <h2>Your Order has been placed successfully.</h2>

            <Link to="/orders/me">Go to Orders</Link>
        </div>

    </div>
    </>
    )
}

export default OrderSuccess

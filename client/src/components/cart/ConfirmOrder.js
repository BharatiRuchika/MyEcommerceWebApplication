import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData';

import { useAlert } from 'react-alert';
import { useSelector } from 'react-redux'

import CheckoutSteps from "./checkoutSteps";

const ConfirmOrder = ({history}) => {
  
    const {cartItems,ShippingInfo} = useSelector(state=>state.cart);
    const {user} = useSelector(state=>state.auth);
    const itemPrice = cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
    const shippingPrice = itemPrice>200?0:25;
    const taxPrice = Number((0.05*itemPrice).toFixed(2));
    const totalPrice = (shippingPrice+taxPrice+itemPrice).toFixed(2);
    const proceedToPayment = ()=>{
        // console.log("im in proceed to payment")
        const data = {
            itemPrice:itemPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo',JSON.stringify(data));
        history.push("/payment");
    }
    return (
        <>
       <MetaData title={'Shipping Info'}></MetaData>
       <CheckoutSteps shipping confirmOrder></CheckoutSteps>
       <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-confirm">

                <h4 className="mb-3">Shipping Info</h4>
                <p><b>Name:</b> {user && user.name}</p>
                <p><b>Phone:</b> {ShippingInfo.phoneNo}</p>
                <p className="mb-4"><b>Address:</b>`${ShippingInfo.address}`+`,`+`${ShippingInfo.city}`+`,`+`${ShippingInfo.postalCode}`+`,`+${ShippingInfo.country}`</p>
                
                <hr />
                <h4 className="mt-4">Your Cart Items:</h4>
                {cartItems.map(item=>(
                    <>
                    

<hr />
<div className="cart-item my-1" key={item.product}>
    <div className="row">
        <div className="col-4 col-lg-2">
            <img src={item.image} alt="Laptop" height="45" width="65"/>
        </div>

        <div className="col-5 col-lg-6">
            <Link to={`/product/${item.product}`}>{item.name}</Link>
        </div>
        <div className="col-4 col-lg-4 mt-4 mt-lg-0">
            <p>{item.quantity} x ${item.price}= <b>${(item.quantity*item.price).toFixed(2)}</b></p>
        </div>

    </div>
</div>
<hr />
                    </>
                ))}
               
               

            </div>
			
			<div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />
                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

<hr />
<button id="checkout_btn" className="btn btn-primary btn-block" onClick={proceedToPayment}>Proceed to Payment</button>
</div>
</div>


</div>

       </>
    )
}

export default ConfirmOrder

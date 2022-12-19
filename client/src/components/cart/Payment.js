import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from "./checkoutSteps";
import { createOrder, clearErrors } from '../../actions/orderActions';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from "axios";
const options = {
  style: {
    base: {
      fontSize: '16px'
    },
    invalid: {
      color: '#9e2146'
    }
  }
}
const Payment = ({ history }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user,token } = useSelector(state => state.auth);
  const { cartItems, ShippingInfo } = useSelector(state => state.cart);
  const { error } = useSelector(state => state.order);
  const order = {
    orderItems: cartItems,
    ShippingInfo
  }
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemPrice
    order.shippingPrice = orderInfo.shippingPrice
    order.taxPrice = orderInfo.taxPrice
    order.totalPrice = orderInfo.totalPrice
  }
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100)
  }
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors());
    }
  }, [dispatch, error, error])
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("amount", Math.round(orderInfo.totalPrice * 100));
    // console.log("orderInfo", orderInfo);
    // console.log("paymentData", paymentData)
    // console.log("im in submit handler");
    document.querySelector("#pay_btn").disabled = true;
    let res;
    const config={
      headers:{
          'Content-Type':'application/json',
          'Authorization': `${token}`
      }
    }
    // res = await axios.post('/api/v1/payment/process', paymentData, config)
    res = await axios.post("http://localhost:3001/user/payment", paymentData, config);
    // console.log("res", res);
    const clientSecret = res.data.client_secret;
    if (!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: user.name,
          email: user.email
        }
      }
    })
    // console.log("paymentIntent", result.paymentIntent);
    if (result.error) {
      // console.log("im in result errpr");
      alert.error(result.error.message);
      document.querySelector("#pay_btn").disabled = false;
    } else {
      if (result.paymentIntent.status == "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status
        }
        dispatch(createOrder(order,token))
        history.push("/success")
      } else {
        alert.error("there is some issue while payment processing");
      }
    }
    // console.log(clientSecret);
    try {

    } catch (error) {
      document.querySelector("#pay_btn").disabled = false;
      alert.error(error.response.data.message);
    }
  }
  return (
    <>
      <MetaData title={'Payment'} />
      <CheckoutSteps shipping confirmOrder payment></CheckoutSteps>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                options={options} />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                options={options}
              />
            </div>


            <button
              id="pay_btn"
              type="submit"
              className="btn btn-block py-3"
            >
              Pay {`-${orderInfo && orderInfo.totalPrice}`}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default Payment

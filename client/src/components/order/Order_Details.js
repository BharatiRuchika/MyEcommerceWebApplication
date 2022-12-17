import React,{useState,useEffect} from 'react'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch,useSelector } from 'react-redux';
import { orderDetails,clearErrors } from '../../actions/orderActions';
import { Link } from 'react-router-dom';

const Order_Details = ({match}) => {
    console.log("im in oreder details");
    const {error,loading,order={}} = useSelector(state=>state.orderDetails);
    console.log("order",order);
    const {ShippingInfo,orderItems,paymentInfo,user,totalPrice,orderStatus} = order;
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("im in useEffect");
       dispatch(orderDetails(match.params.id))
       if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
       console.log("im in list orders");
    }, [error,alert,dispatch,match.params.id])
    const shippingDetails = ShippingInfo && `${ShippingInfo.address},${ShippingInfo.city},${ShippingInfo.postalCode},${ShippingInfo.country}`;
    const isPaid = paymentInfo && paymentInfo.status=="succeeded" ? true : false;
    return (
       <>
       <MetaData title={'Order Details'}></MetaData>
       {loading?<Loader/>:(
           <>
           <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8 mt-5 order-details">

                        <h1 className="my-5">Order # {order._id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user && user.name}</p>
                        <p><b>Phone:</b> {ShippingInfo && ShippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                        <p><b>Amount:</b> {totalPrice}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={isPaid?"greenColor":"redColor"}><b>{isPaid?"PAID":"NOT PAID"}</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={orderStatus && String(orderStatus).includes("Delivered")?"greenColor":"redColor"} ><b>{order.orderStatus}</b></p>


                        <h4 className="my-4">Order Items:</h4>

                        <hr />
                        <div className="cart-item my-1">
                            {orderItems && orderItems.map(item=>
                                (
                                    <>
 <div className="row my-5" key={item.product}>
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>${item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                    </>
                                ))}
                                   
                        </div>
                        <hr />
                    </div>
                </div>
        
           </>
       )}
       </>
    )
}

export default Order_Details

import React,{useState,useEffect} from 'react'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch,useSelector } from 'react-redux';
import { updateOrder,orderDetails,clearErrors } from '../../actions/orderActions';

import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';


const ProcessOrder = ({match}) => {
    const [status,setStatus] = useState("")
   const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,order={}} = useSelector(state=>state.orderDetails)
  const {ShippingInfo,orderItems,paymentInfo,User,totalPrice,orderStatus} = order;
   const {error,isUpdated} = useSelector(state=>state.updateOrder)
   const orderId = match.params.id;
   
 useEffect(() => {
      dispatch(orderDetails(orderId));
      
        if(error){
         alert.error(error);
         dispatch(clearErrors());
     }
   
     if(isUpdated){
       alert.success("Order Updated Successfully");
       dispatch({type:UPDATE_ORDER_RESET})
     }

        console.log("im in list orders");
     }, [dispatch, alert, error, isUpdated, orderId])
     const updateOrderHandler = (id)=>{
        const formData = new FormData();
        formData.set("status",status);
      
        console.log("formData",formData);
        console.log("id",id)
        dispatch(updateOrder(id,formData))
       }
      
    const shippingDetails = ShippingInfo && `${ShippingInfo.address},${ShippingInfo.city},${ShippingInfo.postalCode},${ShippingInfo.country}`;
    const isPaid = paymentInfo && paymentInfo.status=='succeeded'?true:false;
    return (
        <>
        <MetaData title={`Process Order # ${order._id}`}></MetaData>
        <div className="row">
          <div className="col-12 col-md-2">
              <Sidebar/>
          </div>
          <div className="col-12 col-md-10">
                <>
                <h1 className="my-5">All Orders</h1>
              {loading?<Loader/>:(
                  <>
                  <div className="row d-flex justify-content-around">
                    <div className="col-12 col-lg-7 order-details">

                        <h1 className="my-5">Order # {order._id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {User && User.name}</p>
                        <p><b>Phone:</b> {ShippingInfo && ShippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                        <p><b>Amount:</b> ${totalPrice}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={isPaid?"greenColor":"redColor"}><b>{isPaid?"PAID":"NOT PAID"}</b></p>
						
						<h4 className="my-4">Stripe ID</h4>
                        <p className="greenColor" ><b>{paymentInfo && paymentInfo.id}</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={order.orderStatus && String(order.orderStatus).includes("Delivered")?"greenColor":"redColor"}  ><b>{orderStatus}</b></p>


                        <h4 className="my-4">Order Items:</h4>

                        <hr />
                        <div className="cart-item my-1">
                            {orderItems && orderItems.map(item=>(
                                 <div className="row my-5">
                                 <div className="col-4 col-lg-2">
                                     <img src={item.image} alt={item.name} height="45" width="65" />
                                 </div>

                                 <div className="col-5 col-lg-5">
                                     <Link to={`/products/${item.product}`}>{item.name}</Link>
                                 </div>


                                 <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                     <p>{item.price}</p>
                                 </div>

                                 <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                     <p>{item.quantity} Piece(s)</p>
                                 </div>
                             </div>
                            ))}
                                  
                        </div>
                        <hr />
                    </div>
					
					<div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block" onClick={()=>updateOrderHandler(order._id)}>
                                        Update Status
                                </button>
                                </div>
					
                </div>
                  </>
              )}
                </>
          </div>
        </div>
        </>
    )
}

export default ProcessOrder

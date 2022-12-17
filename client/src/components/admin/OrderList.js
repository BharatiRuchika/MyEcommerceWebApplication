import React,{useState,useEffect} from 'react'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch,useSelector } from 'react-redux';
import { getAllOrders,clearErrors,deleteOrder } from '../../actions/orderActions';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MDBDataTable } from 'mdbreact'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrderList = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,error,orders} = useSelector(state=>state.allOrder)
 
    const { isDeleted } = useSelector(state => state.updateOrder)
  
    useEffect(() => {
        console.log("im in useEffect");
       dispatch(getAllOrders())
       if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    console.log("isDeleted",isDeleted);
    if (isDeleted) {
       
        alert.success('Order deleted successfully');
        history.push('/admin/orders');
        dispatch({ type: DELETE_ORDER_RESET })
    }
}, [error,alert,dispatch,isDeleted,history])
const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id))
}
    const setOrders = ()=>{
      const data = {
          columns:[
              {
                  label:'order ID',
                  field:'id',
                  sort:'asc'
              },{
                  label:'Num of Items',
                  field:'numOfItems',
                  sort:'asc'
              },{
                label:'Amount',
                field:'amount',
                sort:'asc'
            },
            {
                label:'Status',
                field:'status',
                sort:'asc'
            },
            {
                label:'Actions',
                field:'actions',
                
            }
          ],
          rows:[

          ]
        }
        orders.forEach(order=>{
            data.rows.push({
                id:order._id,
                numOfItems:order.orderItems.length,
                amount:`$${order.totalPrice}`,
               
                status:order.orderStatus && String(order.orderStatus).includes("Delivered")?
                <p style={{color:"green"}}>{order.orderStatus}</p>:
                <p style={{color:"red"}}>{order.orderStatus}</p>,
                actions:<><Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                </Link>
                <button onClick={() => deleteOrderHandler(order._id)} className="btn btn-danger py-1 px-2 ml-2">
                <i className="fa fa-trash"></i>    
                </button></>
            })
        })
        return data;
    }
    // const deleteProductHandler=(id)=>{
    //    dispatch(deleteProduct(id));
    // }
    return (
        <>
        <MetaData title={"All Orders"}></MetaData>
        <div className="row">
          <div className="col-12 col-md-2">
              <Sidebar/>
          </div>
          <div className="col-12 col-md-10">
                <>
                <h1 className="my-5">All Orders</h1>
                {loading?<Loader/>:<>
                 <MDBDataTable
         data={setOrders()}
         className="px-3"
         bordered
         striped
         hover
     />
                </>}
                </>
          </div>
        </div>
        </>
    )
}

export default OrderList

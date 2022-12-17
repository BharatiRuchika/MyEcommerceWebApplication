import React,{useState,useEffect} from 'react'
import Loader from "../layouts/loader";
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch,useSelector } from 'react-redux';
import { getAdminProducts,clearErrors,deleteProduct } from '../../actions/productActions';
import { MDBDataTable } from 'mdbreact'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
const ProductList = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading,error,products} = useSelector(state=>state.products)
    const {error:deleteError,isDeleted} = useSelector(state=>state.deleteProduct)
    useEffect(() => {
        console.log("im in useEffect");
       dispatch(getAdminProducts())
       if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
     if(deleteError){
       alert.error(deleteError);
       dispatch(clearErrors());
     }
     if(isDeleted){
      alert.success("Product Deleted Successfully");
      dispatch({type:DELETE_PRODUCT_RESET});
      history.push("/admin/products");
     }
       console.log("im in list orders");
    }, [error,alert,dispatch,deleteError,history,isDeleted])
    
    const setProducts = ()=>{
      const data = {
          columns:[
              {
                  label:'ID',
                  field:'id',
                  sort:'asc'
              },{
                  label:'Name',
                  field:'name',
                  sort:'asc'
              },{
                label:'Price',
                field:'price',
                sort:'asc'
            },
            {
                label:'Stock',
                field:'stock',
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
        products.forEach(product=>{
            data.rows.push({
                id:product._id,
                name:product.name,
                price:`$${product.price}`,
                stock:product.stock,
                status:product.productStatus && String(product.productStatus).includes("Delivered")?
                <p style={{color:"green"}}>{product.productStatus}</p>:
                <p style={{color:"red"}}>{product.productStatus}</p>,
                actions:<><Link to={`/admin/product/${product._id}`} className="btn btn-primary">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button onClick={()=>deleteProductHandler(product._id)} className="btn btn-danger py-1 px-2 ml-2">
                <i className="fa fa-trash"></i>    
                </button></>
            })
        })
        return data;
    }
    const deleteProductHandler=(id)=>{
        console.log("im in delete product handler");
        console.log("id",id);
       dispatch(deleteProduct(id));
    }
    return (
       <>
       <MetaData title={"All Products"}></MetaData>
       <div className="row">
         <div className="col-12 col-md-2">
             <Sidebar/>
         </div>
         <div className="col-12 col-md-10">
               <>
               <h1 className="my-5">All Products</h1>
               {loading?<Loader/>:<>
                <MDBDataTable
        data={setProducts()}
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

export default ProductList

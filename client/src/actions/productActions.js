import axios from "axios";
import {ALL_PRODUCTS_REQUEST,ALL_PRODUCTS_SUCCESS,ALL_PRODUCTS_FAIL,CLEAR_ERRORS,PRODUCTS_DETAILS_FAIL,PRODUCTS_DETAILS_SUCCESS,PRODUCTS_DETAILS_REQUEST,NEW_REVIEW_SUCCESS,NEW_REVIEW_REQUEST,NEW_REVIEW_FAIL,ADMIN_PRODUCTS_FAIL,ADMIN_PRODUCTS_REQUEST,ADMIN_PRODUCTS_SUCCESS, NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_FAIL,DELETE_PRODUCT_FAIL,DELETE_PRODUCT_SUCCESS,DELETE_PRODUCT_REQUEST,UPDATE_PRODUCT_FAIL,UPDATE_PRODUCT_REQUEST,UPDATE_PRODUCT_SUCCESS,GET_REVIEWS_REQUEST,GET_REVIEWS_SUCCESS,GET_REVIEWS_FAIL,DELETE_REVIEW_REQUEST,DELETE_REVIEW_SUCCESS,DELETE_REVIEW_RESET,DELETE_REVIEW_FAIL} from "../constants/productConstants";
export const getProducts = (keyword="",currentPage=1,price,category,rating=0)=>async (dispatch)=>{
    console.log("im in get Products");
    console.log("currentPage",currentPage);
    console.log("keyword",keyword);
    console.log("getcategory",category);
    try{
      dispatch({type:ALL_PRODUCTS_REQUEST})
      let link = `https://my-ecommerce-application.herokuapp.com/products/getproducts?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;
      if(category){
        link = `https://my-ecommerce-application.herokuapp.com/products/getproducts?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`
      }
      const {data} = await axios.get(link);
      console.log("productdata",data);
      dispatch({
          type:ALL_PRODUCTS_SUCCESS,
          payload:data
      })
    }catch(error){
        dispatch({
            type:ALL_PRODUCTS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

export const getProductDetails = (id)=>async (dispatch)=>{
    try{
        console.log("im in product details actions");
      dispatch({type:PRODUCTS_DETAILS_REQUEST})
      const {data} = await axios.get(`https://my-ecommerce-application.herokuapp.com/products/getproduct/${id}`);
      console.log("actiondata",data.product);
      dispatch({
          type:PRODUCTS_DETAILS_SUCCESS,
          payload:data.product
      })
    }catch(error){
        dispatch({
            type:PRODUCTS_DETAILS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

export const newReview = (reviewData)=>async (dispatch)=>{
    console.log("im in new review action");
    console.log("reviewdata",reviewData);
    try{
        console.log("im in product details actions");
      dispatch({type:NEW_REVIEW_REQUEST})
      const config={
        headers:{
            'Content-Type':'application/json'
        }
      }
      const {data} = await axios.put(`https://my-ecommerce-application.herokuapp.com/products/review`,reviewData,config);
      console.log("newreviewdata",data.success);
      dispatch({
          type:NEW_REVIEW_SUCCESS,
          payload:data.success
      })
    }catch(error){
        dispatch({
            type:NEW_REVIEW_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//get admin producrs
export const getAdminProducts = ()=>async (dispatch)=>{
    try{
        console.log("im in admin product details actions");
      dispatch({type:ADMIN_PRODUCTS_REQUEST})
      const {data} = await axios.get(`https://my-ecommerce-application.herokuapp.com/products/admin/getproducts`);
      console.log("actiondata",data.product);
      dispatch({
          type:ADMIN_PRODUCTS_SUCCESS,
          payload:data.products
      })
    }catch(error){
        dispatch({
            type:ADMIN_PRODUCTS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//create new product
export const newProduct = (productData)=>async(dispatch)=>{
   try{
       console.log("product data",productData);
     dispatch({type:NEW_PRODUCT_REQUEST});
     const config={
        headers:{
            'Content-Type':'application/json'
        }
      }
     const {data} = await axios.post("https://my-ecommerce-application.herokuapp.com/products/admin/createProduct",productData,config);
     console.log("newproductdata",data);
     dispatch({type:NEW_PRODUCT_SUCCESS, payload: data})
   }catch(error){
      dispatch({type:NEW_PRODUCT_FAIL,payload: error.response.data.errMessage})
   }
}

//delete product
export const deleteProduct = (id)=>async(dispatch)=>{
    try{
      console.log("im in delete product action");
      console.log("deletId",id);
      dispatch({type:DELETE_PRODUCT_REQUEST});
     
      const {data} = await axios.delete(`https://my-ecommerce-application.herokuapp.com/products/admin/deleteProduct/${id}`);
      console.log("newproductdata",data);
      dispatch({type:DELETE_PRODUCT_SUCCESS, payload: data.success})
    }catch(error){
       dispatch({type:DELETE_PRODUCT_FAIL,payload: error.response.data.errMessage})
    }
 }

 //update product
 export const updateProduct = (id,productData)=>async(dispatch)=>{
    try{
        
      dispatch({type:UPDATE_PRODUCT_REQUEST});
     
      const {data} = await axios.put(`https://my-ecommerce-application.herokuapp.com/products/admin/updateProduct/${id}`,productData);
      console.log("newproductdata",data);
      dispatch({type:UPDATE_PRODUCT_SUCCESS, payload: data.success})
    }catch(error){
       dispatch({type:UPDATE_PRODUCT_FAIL,payload: error.response.data.errMessage})
    }
 }

 // Get product reviews
export const getProductReviews = (id) => async (dispatch) => {
    try {
        console.log("im in review action");
        dispatch({ type: GET_REVIEWS_REQUEST })

        const { data } = await axios.get(`https://my-ecommerce-application.herokuapp.com/products/reviews?id=${id}`)
        console.log("reviewData",data);
        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })

    } catch (error) {

        dispatch({
            type: GET_REVIEWS_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

// Delete product review
export const deleteReview = (id, productId) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_REVIEW_REQUEST })

        const { data } = await axios.delete(`https://my-ecommerce-application.herokuapp.com/products/review?id=${id}&productId=${productId}`)

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {

        console.log(error.response);

        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload:error.response.data.errMessage
        })
    }
}

//clear error
export const clearErrors = ()=>async(dispatch)=>{
   dispatch({
       type:CLEAR_ERRORS
   })
}
import { createStore,combineReducers,applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productReducers,productDetailsReducers,newProductReducer,deleteProductReducer,productReviewsReducer,newReviewReducers,reviewReducer } from "./reducers/productReducers";
import { authReducer,userReducer,forgotPasswordReducer,allUsersReducer,userDetailsReducer} from "./reducers/userReducers";
import {cartReducers} from "./reducers/cartReducers";
import {newOrderReducer,MyOrdersReducers,orderDetailReducer,allOrdersReducer,updateOrderReducer} from "./reducers/orderReducers";
const reducer = combineReducers({
  products:productReducers,
  productDetails:productDetailsReducers,
  auth:authReducer,
  user:userReducer,
  forgotPassword:forgotPasswordReducer,
  cart:cartReducers,
  orderDetails:orderDetailReducer,
  order:newOrderReducer,
  myOrders:MyOrdersReducers,
  newProduct:newProductReducer,
  deleteProduct:deleteProductReducer,
  allOrder:allOrdersReducer,
  updateOrder:updateOrderReducer,
 allUsers:allUsersReducer,
 userDetails:userDetailsReducer,
 productReviews: productReviewsReducer,
 newReview:newReviewReducers,
 review:reviewReducer
}) 
let initialState={
  cart:{
    cartItems:localStorage.getItem('cartItems')?JSON.parse(localStorage.getItem('cartItems')):[],
    ShippingInfo:localStorage.getItem('shippinginfo')?JSON.parse(localStorage.getItem('shippinginfo')):[]

  }
}
const middleware = [thunk];
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))
export default store;

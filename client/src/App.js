import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Productdetails from "./components/product/productdetails";
// import {BrowserRouter as Router,Route} from "react-router-dom";
import Profile from "./components/user/Profile";
import {Route,Switch,useLocation,Redirect} from "react-router-dom";
import {BrowserRouter} from "react-router-dom";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Login from "./components/user/Login";
import UpdateProfile from "./components/user/updateProfile";
import Register from "./components/user/Register";
import { loadUser } from './actions/userActions'
import {useEffect,useState} from "react";
import store from "./store";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import Payment from "./components/cart/Payment";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOrders from "./components/order/ListOrders";
import ProductList from "./components/admin/ProductList";
import OrderDetails from "./components/order/Order_Details";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
//admin imports
import Dashboard from "./components/admin/Dashboard";
import OrderList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReview'
// import userEvent from "@testing-library/user-event";
import {useSelector} from "react-redux";
function App() {
  const [stripeApiKey,setStripeApiKey] = useState("");
  useEffect(() => {
    console.log("im here");
    store.dispatch(loadUser())
    async function getStripeApiKey(){
      const {data} = await axios.get("https://my-ecommerce-web-application.vercel.app/user/payment/stripeApi");
      console.log("stripeData",data)
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  // const {loading,user} = useSelector(state=>state.auth);
  return (
    <BrowserRouter>
    <div className="App">
    <Header/>
    {/* showing products routes */}
    
    <div className="container container-fluid">
      <Route path="/" component={Home} exact></Route>
      <Route path="/search/:keyword" component={Home} exact></Route>
      <Route path="/product/:id" component={Productdetails} exact></Route>
      <Route path="/cart" component={Cart} exact></Route>
      
      {/* confirm order routes */}
     
      <ProtectedRoute path="/shipping" component={Shipping} exact/>
      <ProtectedRoute path="/confirm" exact component={ConfirmOrder}/>
      <ProtectedRoute path="/success" component={OrderSuccess} exact></ProtectedRoute>
  
       {stripeApiKey && 
              <Elements stripe={loadStripe(stripeApiKey)}> 
        <ProtectedRoute path="/payment" component={Payment} />
             </Elements> }
        
     
     {/* Authenticate user routes */}
     <Route path="/login" component={Login} exact></Route>
      <Route path="/register" component={Register} exact/>
      <Route path="/password/forgot" component={ForgotPassword} exact/>
      <Route path="/password/reset/:token" component={NewPassword} exact/>

      {/* profile routes */}
     
      <ProtectedRoute path="/me" component={Profile} exact></ProtectedRoute>
      <ProtectedRoute path="/me/update" component={UpdateProfile} exact/>
      <ProtectedRoute path="/me/password" component={UpdatePassword} exact/>
     
     {/* order routes */}
      
      <ProtectedRoute path="/orders/me" component={ListOrders} exact/>
      <ProtectedRoute path="/order/:id" component={OrderDetails} exact/>
      </div>
      {/* admin routes */}
      <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact></ProtectedRoute>
      <ProtectedRoute path="/admin/products" component={ProductList} exact/>
      <ProtectedRoute path="/admin/product" component={NewProduct} exact/>
      <ProtectedRoute path="/admin/orders" component={OrderList} exact/>
      <ProtectedRoute path="/admin/product/:id" component={UpdateProduct} exact/>
      <ProtectedRoute path="/admin/order/:id" component={ProcessOrder} exact/>
      <ProtectedRoute path="/admin/users" component={UsersList} exact></ProtectedRoute>
      <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
      <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact />
      {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
    </div>
    </BrowserRouter>
  );
}

export default App;

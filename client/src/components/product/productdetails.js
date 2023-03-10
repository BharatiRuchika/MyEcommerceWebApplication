import React,{useEffect,useState} from 'react';
// import { useDispatch, useSelector } from 'react-redux'
import { useDispatch,useSelector } from 'react-redux';
import { getProductDetails,clearErrors,newReview } from '../../actions/productActions';
import ListReviews from '../review/ListReviews'
import Loader from "../layouts/loader";
import { useAlert } from 'react-alert';
// import '../../App.css';
import { Carousel } from 'react-bootstrap';
import MetaData from "../layouts/MetaData";
import { CLEAR_ERRORS,NEW_REVIEW_RESET } from '../../constants/productConstants';
import {addItemsCart} from "../../actions/cartActions";
const ProductDetails = ({match}) => {
    const [quantity,setQuantity] = useState(1);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const alert = useAlert();
    console.log(match.params.id);
    const { loading, error, product } = useSelector(state => state.productDetails)
    const {user,token} = useSelector(state=>state.auth);
    const {error:reviewError,success} = useSelector(state=>state.newReview);
    // console.log("loading",loading);
    // console.log("product",product);
    useEffect(() => {
        // console.log("im in useEffect");
        // console.log(match.params.id);
        dispatch(getProductDetails(match.params.id))
        if(error){
           alert.error(error)
           dispatch(CLEAR_ERRORS)
       }
       if(reviewError){
        alert.error(error)
        dispatch(CLEAR_ERRORS)
    } 
    if (success) {
        alert.success('Reivew posted successfully')
        dispatch({ type: NEW_REVIEW_RESET })
    }

    }, [dispatch,alert,error,reviewError,success])
    const increaseQty = ()=>{
        const count = document.querySelector(".count");
        // console.log("stock",product.stock)
        if(count.valueAsNumber>=product.stock)
        return
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = ()=>{
        const count = document.querySelector(".count");
        if(count.valueAsNumber<=1)
        return
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }
    const addToCart = ()=>{
        dispatch(addItemsCart(match.params.id,quantity))
        alert.success("item added to cart");
    }
   
    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
//   console.log("stars",stars);
        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
 function showRatings(e) {
        stars.forEach((star, index) => {
            if (e.type === 'click') {
                if (index < this.starValue) {
                    star.classList.add('orange');

                    setRating(this.starValue)
                } else {
                    star.classList.remove('orange')
                }
            }

            if (e.type === 'mouseover') {
                if (index < this.starValue) {
                    star.classList.add('yellow');
                } else {
                    star.classList.remove('yellow')
                }
            }

            if (e.type === 'mouseout') {
                star.classList.remove('yellow')
            }
        })
    
    }
}
 const reviewHandler = ()=>{
        // console.log("im in review handker");
        // console.log("rating",rating);
        // console.log("comment",comment);
        // console.log("productId",match.params.id);
        const formData = new FormData();
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);
        const body = {
            rating,
            comment,
            productId:match.params.id
        }
        dispatch(newReview(formData,token));
    }
    return (<>
  {loading?<Loader/>:(
            <>
            
           
            <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
               <Carousel pause='hover'>
              {product && product.images && product.images.map(image=>(
                   <Carousel.Item key={image.public_id}>
                   <img className="d-block w-100" src={image.url} alt={product.title} />
               </Carousel.Item>
               
                 
              ))}
               </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id={product}>Product # {product._id}</p>

                <hr/>

                <div className="rating-outer">
                    <div className="rating-inner" style={{width:`${(product.ratings/5)*100}%`}}></div>
                </div>
                <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                <hr/>

                <p id="product_price">${product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                    <input type="number" className="form-control count d-inline" value={quantity} readOnly />

<span className="btn btn-primary plus" onClick={increaseQty}>+</span>
</div>
<button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock===0} onClick={addToCart}>Add to Cart</button>

<hr/>

<p>Status: <span id="stock_status" className={product.stock>0?'greenColor':'redColor'}>{product.stock>0?'In Stock':'Out of Stock'}</span></p>

<hr/>

<h4 className="mt-2">Description:</h4>
<p>{product.description}</p>
<hr/>
<p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
{user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
        Submit Your Review
</button>:<div className="alert alert-danger mt-5"> Login to submit your review</div>}


<div className="row mt-2 mb-5">
                                <div className="rating w-50">

                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">

                                                    <ul className="stars" >
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>
                                                    <textarea
                                                        name="review"
                                                        id="review" className="form-control mt-3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    >

                                                    </textarea>

                                                    <button className="btn my-3 float-right review-btn px-4 text-white" onClick={reviewHandler} data-dismiss="modal" aria-label="Close">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {product.reviews && product.reviews.length > 0 && (
                        <ListReviews reviews={product.reviews} />
                    )} 
  </>
            )}
        </>
    )
}

export default ProductDetails

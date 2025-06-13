import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [postReview, setPostReview] = useState(null);

  const { id } = useParams();
  const root_url = window.location.href.split("dealer")[0];
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  const post_review_url = `${root_url}postreview/${id}`;

  const getDealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      console.log("Dealer API response:", retobj);
      if (retobj.status === 200) {
        // Accept both array and object response formats
        if (Array.isArray(retobj.dealer) && retobj.dealer.length > 0) {
          setDealer(retobj.dealer[0]);
        } else if (typeof retobj.dealer === 'object') {
          setDealer(retobj.dealer);
        } else {
          setDealer(null);
        }
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
      setDealer(null);
    } finally {
      setLoadingDealer(false);
    }
  };

  const getReviews = async () => {
    try {
      const res = await fetch(reviews_url);
      const retobj = await res.json();
      console.log("Reviews API response:", retobj);
      if (retobj.status === 200) {
        if (retobj.reviews?.length > 0) {
          setReviews(retobj.reviews);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    return sentiment === "positive"
      ? positive_icon
      : sentiment === "negative"
      ? negative_icon
      : neutral_icon;
  };

  useEffect(() => {
    getDealer();
    getReviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_url}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
            alt='Post Review'
          />
        </a>
      );
    }
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        {loadingDealer ? (
          <h2 style={{ color: "grey" }}>Loading dealer info...</h2>
        ) : dealer ? (
          <>
            <h1 style={{ color: "grey" }}>{dealer.full_name} {postReview}</h1>
            <h4 style={{ color: "grey" }}>
              {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
            </h4>
          </>
        ) : (
          <h2 style={{ color: "red" }}>Dealer info not found.</h2>
        )}
      </div>

      <div className="reviews_panel">
        {loadingReviews ? (
          <p>Loading Reviews...</p>
        ) : reviews.length === 0 ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div className="review_panel" key={index}>
              <img
                src={getSentimentIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;


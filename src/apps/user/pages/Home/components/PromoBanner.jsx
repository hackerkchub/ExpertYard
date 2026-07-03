import React from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PromoBanner() {

  return (

    <section className="home-section">

      <div className="promo-banner">

        <div className="promo-left">

          <div className="promo-icon">

            <Gift size={42} />

          </div>

          <div className="promo-content">

            <small>

              LIMITED TIME OFFER

            </small>

            <h2>

              Get 20% OFF on Your First Consultation

            </h2>

            <p>

              Connect with verified experts through Chat or Call
              and enjoy an exclusive discount on your first booking.

            </p>

            <div className="promo-tags">

              <span>

                <Sparkles size={16}/>

                Instant Discount

              </span>

              <span>

                <Sparkles size={16}/>

                Secure Payment

              </span>

              <span>

                <Sparkles size={16}/>

                Verified Experts

              </span>

            </div>

            <Link
              to="/user/call-chat?page=1"
              className="promo-btn"
            >

              Claim Offer

              <ArrowRight size={18}/>

            </Link>

          </div>

        </div>

        <div className="promo-right">

          <div className="promo-discount">

            <span>

              UP TO

            </span>

            <strong>

              20%

            </strong>

            <small>

              OFF

            </small>

          </div>

        </div>

      </div>

    </section>

  );

}
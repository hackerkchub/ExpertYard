import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

const TrustBanner = React.memo(() => {

  return (

    <div className="sidebar-trust-banner">

      <div className="sidebar-trust-shield">

        <ShieldCheck size={46} />

      </div>

      <small>

        VERIFIED PLATFORM

      </small>

      <h3>

        100% Verified
        <br />
        Experts

      </h3>

      <p>

        Safe.
        Secure.
        Trusted.

        <br />

        Consult with confidence.

      </p>

      <div className="sidebar-trust-points">

        <div>

          <BadgeCheck size={15} />

          Background Verified

        </div>

        <div>

          <BadgeCheck size={15} />

          Secure Payments

        </div>

        <div>

          <BadgeCheck size={15} />

          Instant Support

        </div>

      </div>

      <Link
        to="/user/call-chat?page=1"
        className="sidebar-trust-btn"
      >

        Learn More

        <ArrowRight size={17} />

      </Link>

    </div>

  );

});

export default TrustBanner;
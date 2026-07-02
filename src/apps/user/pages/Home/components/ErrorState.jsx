import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorState({

  title = "Something went wrong",

  description = "Please try again.",

  onRetry,

}) {

  return (

    <section className="home-error-state home-card">

      <AlertTriangle
        size={54}
        className="home-error-icon"
      />

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

      {onRetry && (

        <button
          className="home-primary-btn"
          onClick={onRetry}
        >

          Try Again

        </button>

      )}

    </section>

  );

}
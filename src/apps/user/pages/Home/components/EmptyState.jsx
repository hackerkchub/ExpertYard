import React from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  ArrowRight,
} from "lucide-react";

export default function EmptyState({

  title = "Nothing Found",

  description = "There is nothing to display right now.",

  buttonText = "Refresh",

  buttonLink = "/user",

  icon,

}) {

  const Icon = icon || Inbox;

  return (

    <section className="home-empty-state home-card">

      <div className="home-empty-icon">

        <Icon size={52} />

      </div>

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

      <Link
        to={buttonLink}
        className="home-primary-btn"
      >

        {buttonText}

        <ArrowRight size={18} />

      </Link>

    </section>

  );

}
import React from "react";

export default function RecommendedExperts({

    experts=[],

    title="Recommended Experts"

}){

if(!experts.length) return null;

return(

<section className="home-card">

<div className="section-header">

<h2>

{title}

</h2>

<button

className="section-link"

>

View All

</button>

</div>

<div className="expert-slider">

{

experts.map(expert=>(

<div

key={expert.id}

className="expert-card"

>

<div className="expert-top">

<div className="expert-avatar">

<img

src={expert.profile_photo}

alt={expert.name}

/>

{

expert.is_online &&

<span className="expert-online"/>

}

</div>

<div className="expert-rating">

⭐

{expert.avg_rating}

</div>

</div>

<h3>

{expert.name}

</h3>

<p>

{expert.position}

</p>

<div className="expert-meta">

<span>

👥

{expert.followers_count}

</span>

<span>

📍

{expert.city}

</span>

</div>

<div className="expert-pricing">

<div>

<strong>

₹{expert.chat_per_minute}

</strong>

<small>

Chat

</small>

</div>

<div>

<strong>

₹{expert.call_per_minute}

</strong>

<small>

Call

</small>

</div>

</div>

<button

className="expert-profile-btn"

>

View Profile

</button>

</div>

))

}

</div>

</section>

);

}
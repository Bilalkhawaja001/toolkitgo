import React from 'react';
import { Helmet } from 'react-helmet-async';

function Contact() {
  return (
    <div className="static-page container">
      <Helmet><title>Contact - FreeTools</title></Helmet>
      <h1>Contact</h1>
      <p>This demo skeleton does not include a connected contact form or backend email workflow yet.</p>
      <p>For production, add a verified contact method or a secure form endpoint before publishing this page publicly.</p>
    </div>
  );
}

export default Contact;

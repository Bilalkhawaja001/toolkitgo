import React from 'react';
import { Helmet } from 'react-helmet-async';

function TermsOfUse() {
  return (
    <div className="static-page container">
      <Helmet><title>Terms of Use - FreeTools</title></Helmet>
      <h1>Terms of Use</h1>
      <p>FreeTools is provided as a lightweight browser utility demo. Ready tools are offered for general productivity use without warranties.</p>
      <p>Coming Soon tools are placeholders and should not be treated as completed or production-ready features.</p>
      <p>You are responsible for reviewing any output before using it in business, legal, financial, or technical workflows.</p>
    </div>
  );
}

export default TermsOfUse;

import React from 'react';
import { Helmet } from 'react-helmet-async';

function PrivacyPolicy() {
  return (
    <div className="static-page container">
      <Helmet><title>Privacy Policy - FreeTools</title></Helmet>
      <h1>Privacy Policy</h1>
      <p>FreeTools is a browser-based tools demo. Ready text tools process input in your browser session and do not require sign-up.</p>
      <p>Do not enter sensitive personal, financial, or confidential data into demo software. Future production versions may have updated privacy terms if additional features are added.</p>
      <p>If contact or analytics features are added later, this page should be updated before launch.</p>
    </div>
  );
}

export default PrivacyPolicy;

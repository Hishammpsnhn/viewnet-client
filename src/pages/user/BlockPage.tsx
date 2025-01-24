import React from "react";

const BlockedPage = () => {
  return (
    <div>
      <h1>Your Account Has Been Blocked</h1>
      <p>We're sorry, but your account has been blocked. Please contact support for more information.</p>
      <button onClick={() => window.location.href = "/support"}>Contact Support</button>
    </div>
  );
};

export default BlockedPage;

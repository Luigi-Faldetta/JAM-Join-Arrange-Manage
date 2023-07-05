import React, { useState } from "react";
import "../Event/EventDashboard.css";
import { PiCopyBold } from "react-icons/pi";

function EventLink({ eventid }: any) {
  const [isCopied, setisCopied] = useState(false);

  const handleCopyLink = () => {
    const link = "http://localhost:3000/event/" + eventid;
    navigator.clipboard.writeText(link).catch((error) => {
      console.error("Failed to copy link:", error);
    });
    setisCopied(true);
  };

  return (
    <div>
      {/* Share this link with your friends: */}
      <button className="btn" onClick={handleCopyLink}>
        COPY LINK
        <PiCopyBold
          size={30}
          className={isCopied ? "fill-pink-500" : "fill-gray-300"}
        />
      </button>
    </div>
  );
}

export default EventLink;

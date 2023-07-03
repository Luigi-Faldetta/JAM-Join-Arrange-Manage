import React from "react";
import './eventDashboard.css'
function EventLink({ eventid }: any) {
  const handleCopyLink = () => {
    const link = "http://localhost:3000/event-dashboard/" + eventid;
    navigator.clipboard.writeText(link).catch((error) => {
      console.error("Failed to copy link:", error);
    });
  };

  return (
    <div>
      Share this link with your friends:
      <button className="btn" onClick={handleCopyLink}>
        Copy Link
      </button>
    </div>
  );
}

export default EventLink;

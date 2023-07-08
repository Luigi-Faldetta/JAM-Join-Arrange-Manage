import { useState } from "react";
import "../../pages/EventDashboard/EventDashboard.css";
import { PiCopyBold } from "react-icons/pi";

function EventLink({ eventid }: any) {
  const [isCopied, setisCopied] = useState(false);

  const handleCopyLink = () => {
    const link = "https://jaminprogress.vercel.app/event/" + eventid;
    navigator.clipboard.writeText(link).catch((error) => {
      console.error("Failed to copy link:", error);
    });
    setisCopied(true);
  };

  return (
    <div>
      <button className="btn bg-gray-100 hover:bg-gray-200 border-0 text-black" onClick={handleCopyLink}>
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

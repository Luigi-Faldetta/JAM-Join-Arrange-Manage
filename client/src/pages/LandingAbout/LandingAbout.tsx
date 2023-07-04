import "./LandingAbout.css";

const LandingAbout = () => {
  return (
    <div className="overflow-y-hidden about-page bg-[#a8b4b4] w-1/5" id="about">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="text-left">
            <h1 className="mb-8  text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-4xl dark:text-white">
              About
            </h1>
          </div>
          <div className="grid grid-rows-2 grid-cols-2 place-items-center text-lg">
            <div className="flex flex-col items-center justify-center row-start-1 row-end-1 col-start-1 col-end-1 mb-6">
              <p
                className="md:text-lg dark:text-gray-400"
                style={{ textAlign: "justify" }}
              >
                <h4>
                  J.A.M. - Join, Arrange, Manage is an all-in-one application
                  designed to streamline event organization and management. With
                  J.A.M., users can easily create events, coordinate schedules,
                  manage attendees, split bills, and efficiently collaborate on
                  tasks.
                </h4>
                <br></br>
                <h4>
                  Additionally, J.A.M. offers a comprehensive to-do list feature
                  that allows users to plan and prioritize their tasks, ensuring
                  nothing is overlooked. By leveraging the power of J.A.M.,
                  event organizers can seamlessly handle the entire event
                  lifecycle, from initial planning to successful execution. The
                  app's intuitive interface enables users to effortlessly create
                  events, set event details, invite participants, and manage
                  RSVPs.
                </h4>
              </p>
            </div>
            <div className="flex flex-col items-center justify-center row-start-1 row-end-1 col-start-2 col-end-2 mb-6">
              <img
                className="drop-shadow-2xl rounded-lg w-[28rem]"
                src="https://images.pexels.com/photos/7886593/pexels-photo-7886593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="friends having pizza together"
              />
            </div>

            <div className="flex flex-col items-center justify-center row-start-2 row-end-2 col-start-2 col-end-2 mb-28 mt-8">
              <p
                className=" md:text-lg dark:text-gray-400"
                style={{ textAlign: "justify" }}
              >
                <h4>
                  In addition to event management, J.A.M. offers a convenient
                  bill splitting feature. With just a few clicks, users can
                  effortlessly divide expenses among attendees, eliminating the
                  hassle of manual calculations and ensuring a fair distribution
                  of costs.
                </h4>
                <br></br>
                <h4>
                  {" "}
                  With its comprehensive set of features, J.A.M. empowers users
                  to join, arrange, and manage events with ease. Whether
                  planning a small gathering or coordinating a large-scale
                  conference, J.A.M. simplifies the process, enhances
                  collaboration, and ensures a seamless event experience for all
                  involved.
                </h4>
              </p>
            </div>
            <div className="flex flex-col items-center justify-center row-start-2 row-end-2 col-start-1 col-end-1 mb-28 mt-8">
              <img
                className="w-[28rem] drop-shadow-2xl rounded-lg"
                src="https://media.istockphoto.com/id/869301564/photo/splitting-it-six-ways.jpg?s=612x612&w=0&k=20&c=i_rAQ1-4iyooawtB2bYKsrOMIRAzzrYpLzLmx0LNniQ="
                alt="friends splitting the bill"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAbout;

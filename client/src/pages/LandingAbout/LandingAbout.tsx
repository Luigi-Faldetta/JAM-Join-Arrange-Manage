import "./LandingAbout.css";

const LandingAbout = () => {
  return (
    <div className="overflow-y-hidden about-page light:bg-[#f3f4f6] dark:bg-gray-900 w-1/5" id="about">
      <div className="container flex flex-col items-center">


        <h1 className="mb-12  text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-4xl dark:text-white">
          About
        </h1>

        <div className="grid grid-cols-2 place-items-center text-lg w-full">
          <div className="flex ml-20 flex-col items-center justify-center col-start-1 col-end-1 mb-6">
            <p
              className="md:text-lg dark:text-gray-400 max-w-[28rem]"
              style={{ textAlign: "justify" }}
            >
              <h4>
                JAM. - Join, Arrange, Manage - is an all-in-one application
                designed to streamline event organization and management. With
                J.A.M., users can easily create events, coordinate schedules,
                manage attendees, split bills, and efficiently collaborate on
                tasks.  Additionally, J.A.M. offers a comprehensive to-do list feature
                that allows users to plan and prioritize their tasks, ensuring
                nothing is overlooked.
              </h4>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center row-start-1 row-end-1 col-start-2 col-end-2 mb-6 w-full mr-20">
            <img
              className="drop-shadow-2xl rounded-lg w-[28rem]"
              src="https://images.pexels.com/photos/7886593/pexels-photo-7886593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="friends having pizza together"
            />
          </div>

          <div className="flex flex-col items-center justify-center  col-start-2 col-end-2 mb-28 mt-8 mr-20">
            <p
              className=" md:text-lg dark:text-gray-400 max-w-[28rem]"
              style={{ textAlign: "justify" }}
            >
              <h4>
                JAM offers a convenient
                bill splitting feature. With just a few clicks, users can
                effortlessly divide expenses among attendees, eliminating the
                hassle of manual calculations and ensuring a fair distribution
                of costs. No need to stress about who needs to pay what, JAM will handle all of that for you.
              </h4>

            </p>
          </div>
          <div className="flex flex-col items-center justify-center row-start-2 row-end-2 col-start-1 col-end-1 mb-28 mt-8 w-full ml-20">
            <img
              className="w-[28rem] drop-shadow-2xl rounded-lg"
              src="https://media.istockphoto.com/id/869301564/photo/splitting-it-six-ways.jpg?s=612x612&w=0&k=20&c=i_rAQ1-4iyooawtB2bYKsrOMIRAzzrYpLzLmx0LNniQ="
              alt="friends splitting the bill"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingAbout;

import "./LandingAbout.css";

const LandingAbout = () => {
  return (
    <div className="flex justify-center items-center overflow-y-hidden about-page min-h-screen py-12 bg-indigo-950" id="about">
      <div className="container">
        <div className="flex justify-center items-center">
          <h1 className=" text-3xl tracking-tight leading-none md:text-5xl xl:text-4xl text-slate-300 mb-12">
            About
          </h1>
        </div>
        <div className="flex flex-col md:grid grid-cols-2 gap-8 text-lg">
          <div className="grid-item">
            <p className="paragraph text-slate-200">
              <h4>
                JAM. - Join, Arrange, Manage - is an all-in-one application designed to streamline event organization and management. With J.A.M., users can easily create events, coordinate schedules, manage attendees, split bills, and efficiently collaborate on tasks. Additionally, J.A.M. offers a comprehensive to-do list feature that allows users to plan and prioritize their tasks, ensuring nothing is overlooked.
              </h4>
            </p>
          </div>
          <div className="grid-item">
            <img
              className="image"
              src="https://images.pexels.com/photos/7886593/pexels-photo-7886593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="friends having pizza together"
            />
          </div>
          <div className="grid-item order-last md:order-1">
            <img
              className="image"
              src="https://media.istockphoto.com/id/869301564/photo/splitting-it-six-ways.jpg?s=612x612&w=0&k=20&c=i_rAQ1-4iyooawtB2bYKsrOMIRAzzrYpLzLmx0LNniQ="
              alt="friends splitting the bill"
            />
          </div>
          <div className="grid-item order-2">
            <p className="paragraph text-slate-200">
              <h4>
                JAM offers a convenient bill splitting feature. With just a few clicks, users can effortlessly divide expenses among attendees, eliminating the hassle of manual calculations and ensuring a fair distribution of costs. No need to stress about who needs to pay what, JAM will handle all of that for you.
              </h4>
            </p>
          </div>
        </div>
      </div>
    </div>


  );
};

export default LandingAbout;

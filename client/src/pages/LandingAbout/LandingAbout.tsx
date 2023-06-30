import './LandingAbout.css';

const LandingAbout = () => {
  return (
<div className="about-page " id="about">
  <div className="container">
    <div>
    <div className="text-left ml-8">
      <h1 className="mb-5  text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-4xl dark:text-white">
        About
      </h1>
      </div>
      <p
        className="about-text mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
        style={{ textAlign: 'justify' }}
      >
        J.A.M. - Join, Arrange, Manage is an all-in-one application designed to
        streamline event organization and management. With J.A.M., users can
        easily create events, coordinate schedules, manage attendees, split
        bills, and efficiently collaborate on tasks. Additionally, J.A.M. offers
        a comprehensive to-do list feature that allows users to plan and
        prioritize their tasks, ensuring nothing is overlooked. By leveraging
        the power of J.A.M., event organizers can seamlessly handle the entire
        event lifecycle, from initial planning to successful execution. The app's
        intuitive interface enables users to effortlessly create events, set
        event details, invite participants, and manage RSVPs. In addition to
        event management, J.A.M. offers a convenient bill splitting feature.
        With just a few clicks, users can effortlessly divide expenses among
        attendees, eliminating the hassle of manual calculations and ensuring a
        fair distribution of costs. With its comprehensive set of features,
        J.A.M. empowers users to join, arrange, and manage events with ease.
        Whether planning a small gathering or coordinating a large-scale
        conference, J.A.M. simplifies the process, enhances collaboration, and
        ensures a seamless event experience for all involved.
      </p>
    </div>
  </div>
</div>
  );
};

export default LandingAbout;

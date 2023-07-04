import './LandingFaqs.css';

const LandingFaqs = () => {
  return (

    <div className="overflow-y-hidden faq-wrapper mt-12">
      <div className='faqs-page mr-auto place-self-start lg:col-span-7' id='faqs'>
        <div>
          <h1 className='mb-6 text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-4xl dark:text-white'>
            Frequently asked questions
          </h1>
          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>How do I create a new event?</summary>
            <p className='faq-answer'>
              To create a new event, click on the "Create Event" button or link on the dashboard or navigation menu. Fill in
              the event details such as the title, date, time, location, and description. Click on the "Save" or "Create"
              button to create the event.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>How can I invite participants to my event?</summary>
            <p className='faq-answer'>
              After creating an event, you can invite participants by either entering their email addresses or selecting them
              from your contact list. There may be an "Invite Participants" or "Add Guests" button where you can input the
              email addresses or select from a list. Once you have added the participants, click on the "Send Invitations" or
              "Invite" button to send the invitations.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>How do I manage RSVPs for my event?</summary>
            <p className='faq-answer'>
              To manage RSVPs for your event, go to the event details page or the event management section. You should see a
              list of participants and their RSVP status (e.g., attending, not attending, undecided). You can update the RSVP
              status manually by selecting the appropriate option for each participant or by using checkboxes or radio
              buttons. Some systems may also allow participants to update their RSVP status themselves.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>Can I split bills among event attendees?</summary>
            <p className='faq-answer'>
              Yes, you can split bills among event attendees. In the event management section or during the event creation
              process, there may be an option to enable bill splitting. You can enter the expenses incurred for the event and
              specify which attendees should share the costs. The system will calculate the amount each attendee owes and
              provide a breakdown of the expenses.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>How do I create a to-do list for my event?</summary>
            <p className='faq-answer'>
              To create a to-do list for your event, navigate to the event details or management page. Look for a section
              related to tasks, to-dos, or checklist. You can click on the "Add Task" or "Create To-Do" button to add
              individual tasks. Provide a title, description, due date, and assignee (if applicable) for each task. You can
              mark tasks as completed or update their status as you progress.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>Can I join existing events organized by others?</summary>
            <p className='faq-answer'>
              Yes, you can join existing events organized by others. Depending on the platform or app, there may be a
              "Discover Events" or "Join Events" section where you can browse through a list of public events. You can select
              an event of interest and click on the "Join" or "RSVP" button to indicate your participation. Some events may
              require approval from the event organizer before your participation is confirmed.
            </p>
          </details>

          <details className='faq'>
            <summary className=' my-3 font-light text-gray-500 lg:mb-4 md:text-lg lg:text-xl dark:text-gray-400'>How can I stay connected with event participants?</summary>
            <p className='faq-answer'>
              To stay connected with event participants, you can utilize communication features provided by the app. This may
              include event-specific chat rooms, messaging systems, or comment sections. You can use these channels to share
              updates, discuss event details, coordinate logistics, or ask questions. Additionally, you may have the option to
              exchange contact information with participants or connect via social media platforms.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LandingFaqs;

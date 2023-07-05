'use client';
import { Accordion } from 'flowbite-react';


export default function LandingFaqs() {
  return (
    <div className="mt-32 mb-40 flex flex-col items-center" id="faqs">
      <p className="mb-20 text-3xl">Frequently asked questions</p>
      <Accordion className="w-2/3">
        <Accordion.Panel>
          <Accordion.Title>
            How do I create a new event?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              <p>
                To create a new event, click on the "Host Event" button or link
                on the dashboard. Fill in the event details
                such as the title, date, time, location, and description. Click on
                the "Create" button to create the event. You can now share your event link with your friends!
              </p>
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            How can I invite participants to my event?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              <p>
                After creating an event, you can invite participants by sharing your unique event link with your friends in your favourite messaging apps. When clicking on the link, they will then have to either log in or sign up to access the event page.
              </p>
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            Can I split bills among event attendees?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              <p>
                Yes, you can split bills among event attendees. Each participant can go to the expenses section of the event page to add an expense.The system will calculate the amount each attendee owes
                and provide a breakdown of the expenses.
              </p>
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            How do I create a to-do list for my event?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              <p>
                To create a to-do list for your event, navigate to the todos sections of the event
                page. You can enter a new todo in the add item input field and click on the plus button to add individual tasks. You can mark tasks as completed or update their status as you progress.
              </p>
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            Can I join existing events organized by others?
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              <p>
                Yes, you can join existing events organized by others. Once the host shares their event link with you simply log in or sign up to have access to the event and join.
              </p>
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>

  )
}

import { createEventList } from "../../reduxFiles/slices/events";

function EventTile() {
  return (
    <>
      <a
        href="#"
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Really cool event!!!
        </h2>
        <h4>Sat, 5th Never, 2000</h4>
        <h3>12345, Rainbow Lane</h3>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          This will be a super fun event description!
        </p>
      </a>
    </>
  );
}

export default EventTile;

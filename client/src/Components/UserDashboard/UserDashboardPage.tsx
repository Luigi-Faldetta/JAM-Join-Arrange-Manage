import CreateEventForm from "./CreateEventForm";
import EventTile from "./EventTile";
function UserDashboardPage() {
  return (
    <>
      <div className="flex flex-row">
        <div className="m-5 w-1/2 h-full flex flex-col gap-5">
          <EventTile></EventTile>
          <EventTile></EventTile>
          <EventTile></EventTile>
        </div>
        <div className="m-5 w-1/2 aspect-w-1 aspect-h-1">
          <div className="mb-5 flex justify-end">
            <CreateEventForm></CreateEventForm>
          </div>
          <div className="bg-green-500 h-64">empty</div>
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

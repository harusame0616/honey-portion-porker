import { NewRoomCreationForm } from "./new-room-creation-form";
import { RoomJoiningForm } from "./room-joining-form";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl mb-8">Honey Portion Porker</h1>
      <main className="flex flex-col gap-8">
        <div>
          <h2>Room creation</h2>
          <NewRoomCreationForm />
        </div>
        <div>
          <h2>Room joining</h2>
          <RoomJoiningForm />
        </div>
      </main>
    </div>
  );
}

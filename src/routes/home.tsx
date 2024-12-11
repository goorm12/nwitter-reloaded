import { auth } from "./firebase";

export default function Home() {
  const handleLogOut = () => {
    auth.signOut();
  };
  return (
    <h1>
      <button onClick={handleLogOut}>Log Out</button>
    </h1>
  );
}

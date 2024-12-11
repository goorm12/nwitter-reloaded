import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

export default function Home() {
  const navigate = useNavigate();
  const handleLogOut = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <h1>
      <button onClick={handleLogOut}>Log Out</button>
    </h1>
  );
}

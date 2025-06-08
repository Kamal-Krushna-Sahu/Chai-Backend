import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axios
      .get("/api/profile")
      .then((response) => setProfile(response.data))
      .catch((err) => console.log(err));
  }, [profile]);

  return (
    <>
      <div>
        <h1>Name: {profile.name}</h1>
        <h2>Email: {profile.email}</h2>
        <h2>Age: {profile.age}</h2>
      </div>
    </>
  );
}

export default App;

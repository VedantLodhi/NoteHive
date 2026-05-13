import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import PageLayout from "./layout/PageLayout";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
    phone: "",
    location: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "Your Name";
    const storedEmail = localStorage.getItem("email") || "your.email@example.com";
    const storedBio = localStorage.getItem("bio") || "Write your bio here...";
    const storedProfilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/150";
    const storedPhone = localStorage.getItem("phone") || "Enter your phone number";
    const storedLocation = localStorage.getItem("location") || "Enter your location";

    setUser({
      name: storedUsername,
      email: storedEmail,
      bio: storedBio,
      profilePic: storedProfilePic,
      phone: storedPhone,
      location: storedLocation,
    });

    setNewBio(storedBio);
    setNewPhone(storedPhone);
    setNewLocation(storedLocation);
  }, []);

  const handleSave = () => {
    localStorage.setItem("bio", newBio);
    localStorage.setItem("phone", newPhone);
    localStorage.setItem("location", newLocation);
    if (newProfilePic) {
      localStorage.setItem("profilePic", newProfilePic);
    }

    setUser({
      ...user,
      bio: newBio,
      profilePic: newProfilePic || user.profilePic,
      phone: newPhone,
      location: newLocation,
    });

    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageLayout eyebrow="Account" title="Your profile" subtitle="Details are stored locally for this session and sidebar display.">
      <div className="profile-container" style={{ minHeight: "auto", padding: 0 }}>
        <div className="profile-card">
          <div className="profile-header">
            <img src={newProfilePic || user.profilePic} alt="" className="profile-pic" />
            <h2>{user.name}</h2>
            <p className="email">{user.email}</p>
            <p className="tagline">{user.bio}</p>
          </div>

          {editMode && (
            <div className="edit-fields">
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Write something about yourself..."
              />
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Phone number"
              />
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Location"
              />
              <div className="upload-section">
                <label htmlFor="profile-pic-upload">Profile photo</label>
                <input id="profile-pic-upload" type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>
          )}

          <div className="button-group">
            <button type="button" className="edit-btn" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit profile"}
            </button>
            {editMode && (
              <button type="button" className="save-btn" onClick={handleSave}>
                Save changes
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;

import React, { useRef } from "react";
import { DropMenu, DropItem, UserHeader, UserName, UserRole } from "../styles/Profile.styles";
import { FiUser, FiSettings, FiLogOut, FiCamera } from "react-icons/fi";

export default function ProfileDropdown({ user, onLogout, onAvatarChange }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <DropMenu>
      <UserHeader>
        <UserName>{user?.name || "Expert"}</UserName>
        <UserRole>{user?.role || "Expert"}</UserRole>
      </UserHeader>

      <DropItem onClick={handleUploadClick}>
        <FiCamera /> Upload new photo
      </DropItem>

      <DropItem>
        <FiUser /> My Profile
      </DropItem>

      <DropItem>
        <FiSettings /> Settings
      </DropItem>

      <DropItem danger onClick={onLogout}>
        <FiLogOut /> Logout
      </DropItem>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </DropMenu>
  );
}

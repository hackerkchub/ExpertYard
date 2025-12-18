import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropMenu,
  DropItem,
  UserHeader,
  UserName,
  UserRole
} from "../styles/Profile.styles";

import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function ProfileDropdown({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DropMenu>
      <UserHeader>
        <UserName>{user?.name || "Expert"}</UserName>
        <UserRole>{user?.role || "Expert"}</UserRole>
      </UserHeader>

      <DropItem onClick={() => navigate("/expert/profile")}>
        <FiUser /> My Profile
      </DropItem>

      <DropItem onClick={() => navigate("/expert/settings")}>
        <FiSettings /> Settings
      </DropItem>

      <DropItem danger onClick={onLogout}>
        <FiLogOut /> Logout
      </DropItem>
    </DropMenu>
  );
}

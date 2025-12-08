import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import {
  TopbarWrap,
  LeftSide,
  BrandingGroup,
  BrandBox,
  BrandLogo,
  BrandName,
  AdminTitle,
  RightSide,
  IconButton,
  DropMenu,
  DropItem,
  MobileToggle
} from "../styles/Topbar.styles";

import logo from "../../../assets/logo.png";

export default function Topbar({ setMobileOpen }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    function closeAll(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    }
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  return (
    <TopbarWrap>
      <LeftSide>
        {/* Mobile Sidebar Button */}
        <MobileToggle onClick={() => setMobileOpen(true)}>
          <FiMenu size={22} />
        </MobileToggle>

        {/* Branding */}
        <BrandingGroup>
          <BrandBox to="/">
            <BrandLogo src={logo} alt="logo" />
            <BrandName>Expert<span>Yard</span></BrandName>
            <AdminTitle>Admin Panel</AdminTitle>
          </BrandBox>
        </BrandingGroup>
      </LeftSide>

      {/* Right Icons */}
      <RightSide>
        <div ref={notifRef}>
          <IconButton
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenProfile(false);
            }}
          >
            <FiBell size={20} />
          </IconButton>

          <DropMenu show={openNotif} width="240px">
            <DropItem>New expert registered</DropItem>
            <DropItem>3 pending approvals</DropItem>
            <DropItem>Server running smoothly</DropItem>
          </DropMenu>
        </div>

        {/* Profile */}
        <div ref={profileRef}>
          <IconButton
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotif(false);
            }}
          >
            <FiUser size={20} />
          </IconButton>

          <DropMenu show={openProfile}>
            <DropItem>My Profile</DropItem>
            <DropItem>Settings</DropItem>
            <DropItem>Logout</DropItem>
          </DropMenu>
        </div>
      </RightSide>
    </TopbarWrap>
  );
}

import React, { useState, useRef, useEffect } from "react";
import {
  FiHome,
  FiLayers,
  FiGrid,
  FiUsers,
  FiCheckCircle,
  FiMenu
} from "react-icons/fi";
import {
  Side,
  Overlay,
  CollapseBtn,
  Menu,
  MenuItem
} from "../styles/Sidebar.styles";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef();

  const handleCloseMobile = () => setMobileOpen(false);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handleCloseMobile();
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <Side ref={ref} collapsed={collapsed} mobileOpen={mobileOpen}>
        <CollapseBtn onClick={() => setCollapsed((c) => !c)}>
          <FiMenu />
        </CollapseBtn>

        <Menu>
          <MenuItem
            to="/admin/dashboard"
            className={collapsed ? "collapsed" : ""}
          >
            <FiHome />
            <span>Dashboard</span>
          </MenuItem>

          <MenuItem
            to="/admin/category-management"
            className={collapsed ? "collapsed" : ""}
          >
            <FiLayers />
            <span>Categories</span>
          </MenuItem>

          <MenuItem
            to="/admin/sub-category-management"
            className={collapsed ? "collapsed" : ""}
          >
            <FiGrid />
            <span>Sub-Categories</span>
          </MenuItem>

          <MenuItem
            to="/admin/expert-management"
            className={collapsed ? "collapsed" : ""}
          >
            <FiUsers />
            <span>Experts</span>
          </MenuItem>

          <MenuItem
            to="/admin/expert-approval"
            className={collapsed ? "collapsed" : ""}
          >
            <FiCheckCircle />
            <span>Expert Approval</span>
          </MenuItem>
        </Menu>
      </Side>

      <Overlay show={mobileOpen} onClick={handleCloseMobile} />
    </>
  );
}

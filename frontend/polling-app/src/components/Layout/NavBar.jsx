import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const NavBar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 border-b border-white bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}>
        {!openSideMenu ? (
          <HiOutlineMenu className="text-2xl" />
        ) : (
          <HiOutlineX className="text-2xl" />
        )}
      </button>
      <h2 className="text-2xl ms-5 font-medium text-slate-800">Polling App</h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default NavBar;

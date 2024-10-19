import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";

const Header: React.FC = () => {
  return (
    <Navbar className="flex justify-between w-full p-5 bg-white">
      <NavbarBrand className="lg:ml-36 md:ml-24">
        <Link href="/home">
          <div className="flex flex-row">
            <img className="sm" src={`home/icon-small.png`} alt="image" />
            <div className="flex items-center justify-center">
              <p className="pl-4 font-bold text-black text-center">Photoshop Me In!</p>
            </div>
          </div>
        </Link>
      </NavbarBrand>
    </Navbar>
  );
};

export default Header;

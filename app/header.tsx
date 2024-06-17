import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";

const Header: React.FC = () => {
  return (
    <Navbar className="flex justify-between w-full p-5 bg-white">
      <NavbarContent className="hidden sm:flex gap-4 lg:ml-10 lg:pl-24" justify="center">
        <NavbarBrand>
          <Link href="/home">
            <p className="font-bold text-inherit text-black">Photoshop Me In!</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 lg:mr-10 lg:pr-24 text-black" justify="center">
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Services
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Contact Us
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;

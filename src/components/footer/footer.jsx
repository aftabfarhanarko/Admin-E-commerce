import React from "react";

const Footer = () => {
  return (
    <footer className="dark:bg-[#1a1f26] bg-white rounded-2xl flex justify-center items-center py-6 mt-5">
      <p className="lg:text-sm text-xs text-black/50 dark:text-white/50 text-center">
        developed by{" "}
        <span className="font-medium text-black dark:text-white">
          Aftab Farhan Aarko
        </span>
      </p>
    </footer>
  );
};

export default Footer;

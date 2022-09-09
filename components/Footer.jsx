import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-white/80 flex flex-col items-center mt-auto mb-3 2xl:mb-6 text-center">
      <p className="mb-0.5">
        Small fullstack web3 weekend project. More about me:{" "}
        <a
          href="https://react-eth-challenge-alpha.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="text-primary font-semibold"
        >
          gonzaotc.eth
        </a>
      </p>
      <a
        href="https://platzi.com/cursos/ethereum-dev-program/"
        target="_blank"
        rel="noreferrer"
        className="text-sm"
      >
        This is part of the <span className="text-primary font-semibold">Platzi </span>
        Ethereum Developer Program 2022
      </a>
    </footer>
  );
};

export default Footer;

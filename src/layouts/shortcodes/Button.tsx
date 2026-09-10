import React from "react";

const Button = ({
  label,
  link,
  style,
  rel,
}: {
  label: string;
  link: string;
  style?: string;
  rel?: string;
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel={`noopener noreferrer ${
        rel ? (rel === "follow" ? "" : rel) : "nofollow"
      }`}
      className={`inline-block cursor-pointer rounded-lg border px-6 py-3 mb-4 me-4 font-semibold transition no-underline hover:text-white ${
        style === "outline"
          ? "border-primary bg-transparent hover:bg-primary"
          : "bg-primary text-white"
      }`}
    >
      {label}
    </a>
  );
};

export default Button;

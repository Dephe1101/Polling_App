import React from "react";
import { genInitial } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${
        style || ""
      } flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100`}>
      {genInitial(fullName || "")}
    </div>
  );
};

export default CharAvatar;

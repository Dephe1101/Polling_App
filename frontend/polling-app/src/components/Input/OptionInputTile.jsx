import React from "react";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

const OptionInputTile = ({ isSelected, label, onSelect }) => {
  const getColor = () => {
    if (isSelected) return "text-white bg-sky-500 border-sky-400";
    return "text-black bg-slate-200/80 border-slate-200";
  };

  return (
    <button
      className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${getColor()}`}
      onClick={onSelect}>
      {isSelected ? (
        <MdRadioButtonChecked className="text-lg text-white" />
      ) : (
        <MdRadioButtonUnchecked className="text-lg text-slate-400 " />
      )}
      <span className="text-[13px]">{label}</span>
    </button>
  );
};

export default OptionInputTile;

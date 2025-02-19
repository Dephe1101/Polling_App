import React, { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

const OptionsInput = ({ optionList, setOptionsList }) => {
  const [option, setOption] = useState("");

  //! Handle adding an option

  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionsList([...optionList, option.trim()]);
      setOption("");
    }
  };

  //! Handle deleting an option

  const handleDeleteOption = (index) => {
    const updateArr = optionList.filter((_, idx) => idx !== index);
    setOptionsList(updateArr);
  };
  return (
    <div>
      {optionList.map((item, index) => {
        return (
          <div
            key={index}
            className="flex justify-between bg-gray-200/80 px-4 py-2 rounded-md mb-3">
            <p className="text-xs font-medium text-black">{item}</p>
            <button
              onClick={() => {
                handleDeleteOption(index);
              }}>
              <HiOutlineTrash className="text-lg text-red-500 " />
            </button>
          </div>
        );
      })}

      {optionList.length < 4 && (
        <div className="flex items-center gap-5 mt-4">
          <input
            type="text"
            placeholder="Enter Option"
            value={option}
            className="w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md"
            onChange={({ target }) => {
              setOption(target.value);
            }}
          />

          <button
            className="btn-small text-nowrap py-[6px] cursor-pointer"
            onClick={handleAddOption}>
            <HiMiniPlus className="text-lg" /> Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsInput;

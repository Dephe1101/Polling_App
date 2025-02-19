import React from "react";

const EmptyCard = ({ imgSrc, message, btnText, onClick }) => {
  return (
    <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg mb-5">
      <img
        src={imgSrc}
        className="w-40 md:w-48 bg-slate-400/20 rounded-lg p-5"
      />
      <p className="w-2/3 text-xs md:text-[14px] text-center leading-6 mt-7 ">
        {message}
      </p>

      {btnText && (
        <button className="btn-small px-6 py-2 mt-7" onClick={onClick}>
          {btnText}
        </button>
      )}
    </div>
  );
};

export default EmptyCard;

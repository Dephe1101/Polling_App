import React from "react";
import CharAvatar from "./CharAvatar";
import moment from "moment";

const UserProfileInfo = ({ imgUrl, fullName, userName, createdAt }) => {
  return (
    <div className="flex items-center gap-4">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt=""
          className="w-10 h-10 rounded-full border-none"
        />
      ) : (
        <CharAvatar fullName={fullName} style="text-[13px]" />
      )}

      <div>
        <p className="text-sm text-slate-950/90 font-medium leading-4">
          {fullName} <span className="mx-1 text-sm text-slate-500"> • </span>
          <span className="text-[10px] text-sm text-slate-500">
            {createdAt && moment(createdAt).fromNow()}
          </span>
        </p>
        <span className="text-[11.5px] text-slate-500 leading-4">
          @{userName}
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfo;

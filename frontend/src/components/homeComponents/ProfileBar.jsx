import React from "react";
import { RxAvatar } from "react-icons/rx";

export default function ProfileBar() {
  return (
    <div className="profilebar-container">
      <div className="profilebar-top">
        <div className="profilebar-logo"></div>
        <div className="profilebar-menu">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="profilebar-menu-item"></div>
          ))}
        </div>
      </div>
      <div className="profilebar-bottom">
        <RxAvatar className="user-avatar" size={"50px"} color="" />
      </div>
    </div>
  );
}

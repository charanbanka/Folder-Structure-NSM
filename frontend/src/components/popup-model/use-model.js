// Custom Hook
import React from "react";
export default function useModal() {
  const [isShowing, setIsShowing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  function toggle() {
    setIsShowing(!isShowing);
  }
  function show() {
    setIsShowing(true);
  }
  function hide() {
    setIsShowing(false);
  }
  function showExpand() {
    setIsExpanded(true);
  }
  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }
  return {
    isShowing,
    show,
    hide,
    toggle,
    isExpanded,
    showExpand,
    toggleExpand,
    setIsExpanded,
  };
}

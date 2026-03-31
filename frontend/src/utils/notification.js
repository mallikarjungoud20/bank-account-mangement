export const addNotification = (message) => {
  const existing = JSON.parse(localStorage.getItem("notifications")) || [];
  const updated = [...existing, message];
  localStorage.setItem("notifications", JSON.stringify(updated));
};
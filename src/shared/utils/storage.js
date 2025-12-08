export const setStoredUser = u => localStorage.setItem("user", JSON.stringify(u));
export const getStoredUser = () => JSON.parse(localStorage.getItem("user"));
export const clearUser = () => localStorage.removeItem("user");

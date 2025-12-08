export const handleError = (err) => {
  console.error(err);
  return err.response?.data?.message || "Something went wrong!";
};

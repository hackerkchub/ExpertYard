const Avatar = ({ src, size = 50 }) => {
  return (
    <img
      src={src}
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
};

export default Avatar;

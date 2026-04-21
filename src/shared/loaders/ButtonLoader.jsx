import Button from "../components/Button/Button";

export default function ButtonLoader({
  loading,
  children,
  loadingText = "Please wait...",
  ...props
}) {
  return (
    <Button loading={loading} loadingText={loadingText} {...props}>
      {children}
    </Button>
  );
}

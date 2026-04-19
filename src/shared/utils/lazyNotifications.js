export async function hotToast(type, message, options) {
  const { toast } = await import("react-hot-toast");
  return toast[type]?.(message, options);
}

export async function toastify(type, message, options) {
  const { toast } = await import("react-toastify");
  return toast[type]?.(message, options);
}

export async function fireAlert(options) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(options);
}

import { toast } from 'react-toastify';

export const showError = (message) => {
  toast.error(message || 'Terjadi kesalahan.', {
    position: 'top-right',
    autoClose: 5000, // otomatis hilang setelah 5 detik
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showSuccess = (message) => {
  toast.success(message || 'Berhasil!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
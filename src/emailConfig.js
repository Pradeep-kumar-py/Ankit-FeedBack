import { init } from '@emailjs/browser';

// Initialize EmailJS with your user ID
export const initEmailJS = () => {
  init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
};

export const emailConfig = {
  serviceID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export const validateImage = (file) => {
  if (!file) {
    return { isValid: false, error: "Please choose an image file." };
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { isValid: false, error: "Use JPG, PNG, or WEBP images only." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "Image size must be 5MB or less." };
  }

  return { isValid: true, error: null };
};

export const uploadImage = async (file, onProgress) => {
  const validation = validateImage(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  let progress = 0;

  await new Promise((resolve) => {
    const interval = window.setInterval(() => {
      progress = Math.min(progress + 18, 96);
      if (typeof onProgress === "function") {
        onProgress(progress);
      }

      if (progress >= 96) {
        window.clearInterval(interval);
        resolve();
      }
    }, 90);
  });

  const url = await readFileAsDataUrl(file);
  if (typeof onProgress === "function") {
    onProgress(100);
  }

  return {
    url,
    fileName: file.name,
    size: file.size,
    type: file.type,
  };
};

export default {
  validateImage,
  uploadImage,
};

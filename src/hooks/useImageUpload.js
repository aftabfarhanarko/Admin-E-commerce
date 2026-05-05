import { useState } from "react";
import toast from "react-hot-toast";

const IMGBB_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_IMGBB_API_KEY) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_IMGBB_API_KEY) ||
  "9a222d83ac769876ed9961fa873ebb51";

/**
 * Custom hook for uploading images to ImgBB
 * @returns {Object} { uploadImage, isUploading, error }
 */
const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Upload image to ImgBB
   * @param {File} file - The image file to upload
   * @returns {Promise<string|null>} The image URL or null if upload fails
   */
  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      setError("Invalid file type");
      return null;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 10MB");
      setError("File too large");
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API key is missing");
      }

      // Create FormData for ImgBB
      const formData = new FormData();
      formData.append("image", file);

      // Upload to ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        responseData = { message: response.statusText };
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.error?.message ||
          responseData?.message ||
          `Upload failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const imageUrl = responseData?.data?.display_url || responseData?.data?.url;
      if (responseData?.success && imageUrl) {
        toast.success("Image uploaded successfully");
        return imageUrl;
      } else {
        throw new Error(responseData?.error?.message || responseData?.message || "Upload failed");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to upload image";
      console.error("Image upload error:", err);
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
  };
};

export default useImageUpload;


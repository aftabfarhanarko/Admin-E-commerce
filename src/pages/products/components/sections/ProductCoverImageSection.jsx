import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import useImageUpload from "@/hooks/useImageUpload";

export default function ProductCoverImageSection({
  thumbnailFile,
  thumbnailUrl,
  setThumbnailFile,
  setThumbnailUrl,
}) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = useRef(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handleFile = async (file) => {
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setThumbnailUrl(url);
      setThumbnailFile(null);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
          {/* {t("productForm.thumbnailImage")} */}
          Thimble Image
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {/* {t("productForm.thumbnailImageHint")} */}
          Thimble Image
        </p>
      </div>
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <div 
          className={`w-48 h-48 bg-slate-50 dark:bg-slate-900/30 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center text-center ${!isUploading ? 'cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5' : 'cursor-not-allowed'} transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20' : 'border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/50'}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {!thumbnailFile && !thumbnailUrl ? (
            <div className="flex flex-col items-center p-6">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Uploading...
                  </h3>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 mb-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {isDragging ? t("productForm.dropThumbnailHere", "Drop image here") : t("productForm.uploadThumbnail")}
                  </h3>
                </>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full group">
              <img
                src={
                  thumbnailFile
                    ? URL.createObjectURL(thumbnailFile)
                    : thumbnailUrl
                }
                alt="Thumbnail"
                className="w-full h-full object-contain p-2"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThumbnailFile(null);
                  setThumbnailUrl("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-4 right-4 p-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                title={t("productForm.removeImage")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-500">
            {t("productForm.orPasteImageUrl")}
          </span>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => {
              setThumbnailUrl(e.target.value);
              if (e.target.value) setThumbnailFile(null);
            }}
            placeholder={t("productForm.imageUrlPlaceholder")}
            className="flex-1 h-12 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

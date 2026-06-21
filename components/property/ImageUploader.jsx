import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Star, Trash2, UploadCloud } from 'lucide-react';

const MAX_IMAGES = 15;

const ImageUploader = ({ value = [], onChange }) => {
  const inputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previews, setPreviews] = React.useState([]);

  React.useEffect(() => {
    const urls = (value || []).map((file) =>
      file instanceof File ? URL.createObjectURL(file) : file
    );
    setPreviews(urls);
    return () => urls.forEach((url) => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
  }, [value]);

  const appendFiles = (files) => {
    const remaining = MAX_IMAGES - (value?.length || 0);
    if (remaining <= 0) return;
    const newFiles = Array.from(files).slice(0, remaining);
    onChange([...(value || []), ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files?.length) {
      appendFiles(event.dataTransfer.files);
    }
  };

  const removeImage = (index) => onChange(value.filter((_, i) => i !== index));

  const moveToFirst = (index) => {
    if (index === 0) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const canAdd = (value?.length || 0) < MAX_IMAGES;

  return (
    <div className="property-uploader">
      {canAdd ? (
        <button
          type="button"
          className={`property-uploader__dropzone ${isDragging ? 'is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="property-uploader__icon">
            {isDragging ? <UploadCloud size={22} /> : <ImagePlus size={22} />}
          </div>
          <div>
            <strong>Drag & drop or click to upload photos</strong>
            <p>
              {value?.length > 0
                ? `${value.length} / ${MAX_IMAGES} photos added — first photo is the cover image`
                : `Upload up to ${MAX_IMAGES} photos. JPG, PNG, or WEBP. First photo becomes the cover.`}
            </p>
          </div>
        </button>
      ) : (
        <div className="property-uploader__limit-note">
          <ImagePlus size={16} />
          Maximum {MAX_IMAGES} photos reached
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          if (event.target.files?.length) {
            appendFiles(event.target.files);
            event.target.value = '';
          }
        }}
      />

      <AnimatePresence>
        {previews.length > 0 ? (
          <motion.div
            className="property-uploader__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {previews.map((preview, index) => (
              <motion.div
                key={`${index}-${value[index]?.name || index}`}
                className={`property-uploader__item ${index === 0 ? 'property-uploader__item--cover' : ''}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.18 }}
              >
                <img src={preview} alt={`Property photo ${index + 1}`} />
                {index === 0 && (
                  <div className="property-uploader__cover-badge">Cover</div>
                )}
                <div className="property-uploader__item-actions">
                  {index !== 0 && (
                    <button
                      type="button"
                      className="property-uploader__action property-uploader__action--cover"
                      title="Set as cover photo"
                      onClick={() => moveToFirst(index)}
                    >
                      <Star size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="property-uploader__action property-uploader__action--remove"
                    title="Remove photo"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;

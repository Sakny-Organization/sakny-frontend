import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ImagePlus, Trash2, UploadCloud, User } from 'lucide-react';
import uploadService from '../services/uploadService';
import { fadeIn, hoverLift } from '../utils/animations';

const AvatarUpload = ({ value, onChange, label = 'Profile image', helperText = 'JPG, PNG, or WEBP up to 5MB.' }) => {
  const inputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFile = async (file) => {
    setError('');
    const validation = uploadService.validateImage(file);
    if (!validation.isValid) {
      setProgress(0);
      setError(validation.error || 'Invalid file.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(file, setProgress);
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-upload__header">
        <div>
          <h3>{label}</h3>
          <p>{helperText}</p>
        </div>
      </div>

      <div className="avatar-upload__body">
        <motion.div
          className={`avatar-upload__preview ${value ? 'has-image' : ''}`}
          variants={hoverLift}
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {value ? (
            <img src={value} alt="Profile preview" className="avatar-upload__image" />
          ) : (
            <div className="avatar-upload__fallback">
              <User size={34} />
            </div>
          )}
          <div className="avatar-upload__badge">
            <Camera size={16} />
          </div>
        </motion.div>

        <motion.div
          className={`avatar-upload__dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.18 }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="avatar-upload__input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
            }}
          />
          <ImagePlus size={20} />
          <div>
            <strong>Drag and drop an image</strong>
            <p>or browse from your device</p>
          </div>
          <button type="button" className="avatar-upload__browse" onClick={openFilePicker}>
            Choose file
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="avatar-upload__progress"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            exit={fadeIn.exit}
            transition={fadeIn.transition}
          >
            <div className="avatar-upload__progress-copy">
              <span>
                <UploadCloud size={14} /> Uploading image
              </span>
              <strong>{progress}%</strong>
            </div>
            <div className="avatar-upload__progress-track">
              <motion.div
                className="avatar-upload__progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="avatar-upload__footer">
        {error ? <p className="avatar-upload__error">{error}</p> : <p className="avatar-upload__hint">Use a clear face photo for better trust and higher reply rates.</p>}
        {value && (
          <div className="avatar-upload__actions">
            <button type="button" className="avatar-upload__link" onClick={openFilePicker}>Edit image</button>
            <button type="button" className="avatar-upload__link avatar-upload__link--danger" onClick={() => onChange('')}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
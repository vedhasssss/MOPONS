const cloudinary = require('../config/cloudinary');

// Upload image to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = 'mopons') => {
  // Check if Cloudinary credentials are set
  if (
    !process.env.CLOUDINARY_CLOUD_NAME || 
    process.env.CLOUDINARY_CLOUD_NAME === 'demo' ||
    !process.env.CLOUDINARY_API_KEY || 
    process.env.CLOUDINARY_API_KEY.includes('your_')
  ) {
    console.log('⚠️ Cloudinary credentials missing or invalid. Using mock image URL.');
    // Return a random placeholder image
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${randomId}/800/600`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          // Fallback to mock image on error too, to keep app usable
          const randomId = Math.floor(Math.random() * 1000);
          resolve(`https://picsum.photos/seed/${randomId}/800/600`);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `mopons/${filename.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };

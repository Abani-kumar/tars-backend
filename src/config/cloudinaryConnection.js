import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

const cloudinaryConnect = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  console.log("cloudinary connected successfully");
};

export default cloudinaryConnect;

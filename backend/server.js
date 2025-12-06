const app = require('./src/app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db';

// Kết nối MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Đã kết nối MongoDB");
    app.listen(PORT, () => {
      console.log(`Server port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });
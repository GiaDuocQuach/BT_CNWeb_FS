const express = require('express');
const router = express.Router();
const studentHandler = require('../controller/studentController');

// GET - Truy xuất toàn bộ danh sách học sinh
router.get('/', studentHandler.fetchAllStudents);

// POST - Thêm học sinh mới vào hệ thống
router.post('/', studentHandler.addNewStudent);

// GET - Tìm kiếm học sinh theo ID
router.get('/:id', studentHandler.findStudentById);

// PUT - Chỉnh sửa thông tin học sinh
router.put('/:id', studentHandler.modifyStudent);

// DELETE - Loại bỏ học sinh khỏi hệ thống
router.delete('/:id', studentHandler.removeStudent);

module.exports = router;
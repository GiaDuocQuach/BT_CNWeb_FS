const StudentModel = require('../model/Student');

// Truy xuất toàn bộ danh sách học sinh
exports.fetchAllStudents = async (request, response) => {
  try {
    const studentList = await StudentModel.find();
    response.json(studentList);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

// Thêm học sinh mới vào hệ thống
exports.addNewStudent = async (request, response) => {
  try {
    const newStudent = new StudentModel(request.body);
    await newStudent.save();
    response.status(201).json(newStudent);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// Tìm kiếm học sinh dựa trên ID
exports.findStudentById = async (request, response) => {
  try {
    const foundStudent = await StudentModel.findById(request.params.id);
    if (!foundStudent) {
      return response.status(404).json({ error: 'Học sinh không tồn tại' });
    }
    response.json(foundStudent);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

// Chỉnh sửa thông tin học sinh
exports.modifyStudent = async (request, response) => {
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return response.status(404).json({ error: 'Học sinh không tồn tại trong hệ thống' });
    }
    response.json(updatedStudent);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// Loại bỏ học sinh khỏi hệ thống
exports.removeStudent = async (request, response) => {
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(request.params.id);
    if (!deletedStudent) {
      return response.status(404).json({ error: 'Học sinh không tồn tại trong hệ thống' });
    }
    response.json({ message: 'Xóa học sinh thành công', student: deletedStudent });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
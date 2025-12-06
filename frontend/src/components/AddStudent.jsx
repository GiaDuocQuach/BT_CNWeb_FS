// AddStudent.jsx
import React from "react";
import "./AddStudent.css";

export default function AddStudent({ onAdd }) {
  const [showModal, setShowModal] = React.useState(false);
  const [studentInfo, setStudentInfo] = React.useState({
    fullName: "",
    studentAge: "",
    className: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setStudentInfo({ ...studentInfo, [name]: value });
  }

  async function handleSubmission() {
    if (
      !studentInfo.fullName.trim() ||
      !studentInfo.studentAge.trim() ||
      !studentInfo.className.trim()
    ) {
      alert("Vui lòng điền đầy đủ các trường thông tin!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentInfo.fullName,
          age: parseInt(studentInfo.studentAge),
          class: studentInfo.className,
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo học sinh mới");

      const newStudent = await res.json();
      onAdd && onAdd(newStudent);

      setStudentInfo({ fullName: "", studentAge: "", className: "" });
      setShowModal(false);

      alert("Đã thêm học sinh thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra: " + err.message);
    }
  }

  return (
    <div className="student-registration-wrapper">
      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2" />
        </svg>
        Đăng ký
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="modal-header">
              <div className="header-decoration"></div>

              <div className="header-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path
                    d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 18c0-3.31 2.69-6 6-6s6 2.69 6 6"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="modal-title">Thông tin học sinh</h2>
              <p className="modal-description">
                Nhập đầy đủ thông tin để đăng ký
              </p>
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-content">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M9 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4 16c0-2.76 2.24-5 5-5s5 2.24 5 5"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                      />
                    </svg>
                    Họ và tên đầy đủ
                  </span>
                </label>

                <input
                  name="fullName"
                  type="text"
                  className="form-input"
                  value={studentInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nguyễn Văn An"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-content">
                      <svg width="18" height="18">
                        <rect
                          x="3"
                          y="3"
                          width="12"
                          height="12"
                          rx="2"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 6v3l2 2"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                        />
                      </svg>
                      Tuổi
                    </span>
                  </label>

                  <input
                    name="studentAge"
                    type="number"
                    className="form-input"
                    value={studentInfo.studentAge}
                    onChange={handleInputChange}
                    placeholder="VD: 15"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-content">
                      <svg width="18" height="18">
                        <path
                          d="M3 6l6-3 6 3v7l-6 3-6-3V6z"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                        />
                      </svg>
                      Lớp học
                    </span>
                  </label>

                  <input
                    name="className"
                    type="text"
                    className="form-input"
                    value={studentInfo.className}
                    onChange={handleInputChange}
                    placeholder="VD: 10A1"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Hủy
              </button>

              <button className="submit-btn" onClick={handleSubmission}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    d="M15 5L7 13 3 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

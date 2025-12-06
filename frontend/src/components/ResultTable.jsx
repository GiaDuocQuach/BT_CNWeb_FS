import React from "react";
import "./ResultTable.css";

function ResultTable({ keyword = "", student, onAdded }) {
  const [dataList, setDataList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeEdit, setActiveEdit] = React.useState(null);
  const [ascendingOrder, setAscendingOrder] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/students");
        const json = await res.json();
        if (!mounted) return;
        setDataList(json);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();
    return () => (mounted = false);
  }, []);

  React.useEffect(() => {
    if (!student) return;
    setDataList((prev) => [...prev, { ...student, id: prev.length + 1 }]);
    onAdded && onAdded();
  }, [student, onAdded]);

  const search = (keyword || "").toLowerCase();
  const matchedData = dataList.filter(
    (item) =>
      item.name.toLowerCase().includes(search) ||
      (item.class || "").toLowerCase().includes(search)
  );

  const orderedData = [...matchedData].sort((a, b) => {
    return ascendingOrder
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const initiateEdit = (item) => setActiveEdit({ ...item });

  const modifyField = (field, value) => {
    setActiveEdit((prev) => ({ ...prev, [field]: value }));
  };

  const commitChanges = () => {
    fetch(`http://localhost:5000/api/students/${activeEdit._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activeEdit),
    })
      .then((r) => r.json())
      .then((updated) => {
        setDataList((prev) =>
          prev.map((it) => (it._id === activeEdit._id ? updated : it))
        );
        setActiveEdit(null);
      })
      .catch(console.error);
  };

  const deleteRecord = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" })
      .then(() => {
        setDataList((prev) => prev.filter((it) => it._id !== id));
      })
      .catch(console.error);
  };

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p className="loader-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      {dataList.length === 0 ? (
        <div className="empty-container">
          <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="3" strokeDasharray="8 8"/>
            <path d="M40 25v30M25 40h30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <h3 className="empty-title">Chưa có học sinh</h3>
          <p className="empty-description">Hãy thêm học sinh đầu tiên của bạn</p>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <div className="result-info">
              <span className="result-count">{orderedData.length}</span>
              <span className="result-label">học sinh</span>
            </div>
            <button
              className="sort-button"
              onClick={() => setAscendingOrder((p) => !p)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 4v10M6 14l-3-3M6 14l3-3M12 14V4M12 4l-3 3M12 4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {ascendingOrder ? "A → Z" : "Z → A"}
            </button>
          </div>

          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="col-number">#</th>
                  <th className="col-name">Họ và tên</th>
                  <th className="col-age">Tuổi</th>
                  <th className="col-class">Lớp</th>
                  <th className="col-actions">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orderedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-match">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                        <path d="M24 16v8M24 28v.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      <p>Không tìm thấy kết quả cho <strong>"{keyword}"</strong></p>
                    </td>
                  </tr>
                ) : (
                  orderedData.map((item, idx) => (
                    <tr key={item._id} className="table-row">
                      <td className="col-number">
                        <span className="number-badge">{idx + 1}</span>
                      </td>
                      <td className="col-name">
                        <div className="name-cell">
                          <div className="avatar">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="name-text">{item.name}</span>
                        </div>
                      </td>
                      <td className="col-age">{item.age}</td>
                      <td className="col-class">
                        <span className="class-badge">{item.class}</span>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => initiateEdit(item)}
                            title="Chỉnh sửa"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M11.333 2A1.886 1.886 0 0114 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Sửa
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteRecord(item._id)}
                            title="Xóa"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeEdit && (
        <div className="modal-backdrop" onClick={() => setActiveEdit(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="modal-title">Chỉnh sửa thông tin</h3>
              <button className="modal-close" onClick={() => setActiveEdit(null)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="input-group">
                <label className="input-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM4 14c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Họ và tên
                </label>
                <input
                  className="modal-input"
                  value={activeEdit.name}
                  onChange={(e) => modifyField("name", e.target.value)}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Tuổi
                  </label>
                  <input
                    type="number"
                    className="modal-input"
                    value={activeEdit.age}
                    onChange={(e) => modifyField("age", e.target.value)}
                    placeholder="Nhập tuổi"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 5l6-3 6 3v6l-6 3-6-3V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 5l6 3m0 0l6-3m-6 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Lớp
                  </label>
                  <input
                    className="modal-input"
                    value={activeEdit.class}
                    onChange={(e) => modifyField("class", e.target.value)}
                    placeholder="Nhập lớp"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-action" onClick={() => setActiveEdit(null)}>
                Hủy bỏ
              </button>
              <button className="save-action" onClick={commitChanges}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 4L6 11 3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
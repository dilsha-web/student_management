import React, { useEffect, useState } from "react";
import "./Student.css";
import axios from "axios";

const Student = () => {
  // handle the state of the form
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // handle the state of the list
  const [studentList, setStudentList] = useState([]);

  // handle modal state
  const [isModalOpen, setModalOpen] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  // Handle submit button
  const handleSubmit = async (e) => {
    if (
      student.name !== "" &&
      student.email !== "" &&
      student.password !== "" &&
      student.confirm_password !== ""
    ) {
      if (student.password === student.confirm_password) {
        alert("Student has been registered successfully");
        try {
          const res = await axios.post("http://localhost:8081/", student);
          console.log("Data has been stored in the database", res);
          setStudentList([...studentList, res.data]);

          setStudent({
            name: "",
            email: "",
            password: "",
            confirm_password: "",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("All fields are required");
    }
  };

  // Handle incoming data
  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) => {
        console.log("Fetched data successfully");
        setStudentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // handle selected student data in the modal
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Handle edit data
  const handleEdit = (id) => {
    axios
      .get("http://localhost:8081/edit/" + id)
      .then((res) => {
        console.log(res);
        setSelectedStudent({
          id: id,
          name: res.data[0].Name,
          email: res.data[0].Email,
          password: "",
          confirmpassword: "",
        });
        setModalOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //handle input changes in the modal

  const handleModalInput = (e) => {
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        "http://localhost:8081/update/" + selectedStudent.id,
        selectedStudent
      )
      .then((res) => {
        console.log("Data has been updated in the database", res);
        setStudentList((prevStudentList) => {
          if (!Array.isArray(prevStudentList)) return []; // Ensure it's an array
          return prevStudentList.map((entry) =>
            entry.ID === selectedStudent.id
              ? {
                  ...entry,
                  Name: selectedStudent.name,
                  Email: selectedStudent.email,
                }
              : entry
          );
        });
        // Reset the selected student (especially password fields)
        setSelectedStudent({
          id: "",
          name: "",
          email: "",
          password: "",
          confirm_password: "",
        });

        setModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Handle delete data
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/delete/" + id)
      .then((res) => {
        console.log(res);
        setStudentList((prevStudentList) =>
          prevStudentList.filter((entry) => entry.ID !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card mt-5">
              <div
                className="card-header"
                style={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                Student Management
              </div>
              <div className="card-body">
                <form className="form m-3" onSubmit={handleSubmit}>
                  <div className="form-group m-3">
                    <div className="row">
                      <div className="col-3 mt-2">
                        <div className="form-label">Name</div>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          value={student.name}
                          onChange={handleInputChange}
                          name="name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group m-3">
                    <div className="row">
                      <div className="col-3 mt-2">
                        <div className="form-label">Email</div>
                      </div>
                      <div className="col-6">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                          name="email"
                          value={student.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group m-3">
                    <div className="row">
                      <div className="col-3 mt-2">
                        <div className="form-label">Password</div>
                      </div>
                      <div className="col-6">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter Password"
                          name="password"
                          value={student.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group m-3">
                    <div className="row">
                      <div className="col-3">
                        <div className="form-label">Confirm Password</div>
                      </div>
                      <div className="col-6">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter Confirm Password"
                          name="confirm_password"
                          value={student.confirm_password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-50 float-right m-3"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="student-list mt-3">
              <h3 style={{ color: "white" }}>Student List</h3>
              <table className="table table-bordered mt-3 table-dark table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.ID}</td>
                      <td>{entry.Name}</td>
                      <td>{entry.Email}</td>
                      <td>
                        <button
                          className="btn btn-primary m-2"
                          onClick={() => handleEdit(entry.ID)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleDelete(entry.ID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: "1",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fefefe",
              padding: " 20px",
              border: "1px solid #888",
              width: " 80%",
              maxWidth: " 500px",
              margin: "auto",
            }}
          >
            <button
              className="close"
              onClick={() => setModalOpen(false)}
              style={{
                width: "2.5rem",
                lineHeight: "2rem",
                padding: ".3rem",
                color: "red",
                marginBottom: "1rem",
              }}
            >
              &times;
            </button>
            <h2>Edit Student</h2>
            <form className="form m-3" onSubmit={handleUpdate}>
              <div className="form-group m-3">
                <div className="row">
                  <div className="col-3 mt-2">
                    <div className="form-label">Name</div>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      value={selectedStudent.name}
                      onChange={handleModalInput}
                      name="name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group m-3">
                <div className="row">
                  <div className="col-3 mt-2">
                    <div className="form-label">Email</div>
                  </div>
                  <div className="col-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      name="email"
                      value={selectedStudent.email}
                      onChange={handleModalInput}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group m-3">
                <div className="row">
                  <div className="col-3 mt-2">
                    <div className="form-label">Password</div>
                  </div>
                  <div className="col-6">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Password"
                      name="password"
                      value={selectedStudent.password}
                      onChange={handleModalInput}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group m-3">
                <div className="row">
                  <div className="col-3">
                    <div className="form-label">Confirm Password</div>
                  </div>
                  <div className="col-6">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Confirm Password"
                      name="confirm_password"
                      value={selectedStudent.confirm_password}
                      onChange={handleModalInput}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 m-3">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;

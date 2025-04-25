import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CustomUserForm = () => {
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    control_number: "",
    age: "",
    tel: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/form/")
      .then((response) => {
        setFormFields(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos, contacte con el administrador", error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/users/form/", formData)
      .then((response) => {
        alert(response.data.message); // Mensaje de éxito
        setErrors({}); // Limpiar errores en caso de éxito
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data); // Guardamos los errores en el estado
        } else {
          alert("Ocurrió un error inesperado, contacta al administrador.");
        }
        console.error("Error al enviar el formulario", error);
        setLoading(false);
        window.scrollTo(0, 0);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          style={{ width: "5rem", height: "5rem" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
      className="page container mt-5"
    >
      <div className="w-50 mx-auto">
        <h1 className="mb-4">Registro</h1>
        <form onSubmit={handleSubmit}>
          {formFields &&
            Object.keys(formFields).map((field) => {
              const { label, input, type } = formFields[field];
              return (
                <div className="form-group mb-3" key={field}>
                  <label htmlFor={input.id} className="form-label">
                    {label}
                  </label>
                  <input
                    {...input}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    name={field}
                    type={type || "text"}
                    className={`form-control ${
                      errors[field] ? "is-invalid" : ""
                    }`}
                    aria-describedby={`${field}-error`}
                  />
                  {errors[field] && Array.isArray(errors[field]) ? (
                    <div id={`${field}-error`} className="invalid-feedback">
                      {errors[field].map((errorMsg, index) => (
                        <div key={index}>
                          <i className="bi bi-exclamation-circle-fill me-1"></i>
                          {errorMsg}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CustomUserForm;

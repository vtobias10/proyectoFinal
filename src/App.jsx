import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import Dashboard from './Dashboard';

const App = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor completa todos los campos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const response = await axios.post('/api/users', {
        name,
        username,
        email,
        password,
        confirmPassword,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        clearRegisterForm();
        document.getElementById('closeRegisterModalButton').click();
      });
    } catch (error) {
      if (error.response && error.response.data.message) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al registrar el usuario',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginIdentifier || !loginPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor completa todos los campos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        identifier: loginIdentifier,
        password: loginPassword,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        clearLoginForm();
        document.getElementById('closeLoginModalButton').click();
      });
    } catch (error) {
      if (error.response && error.response.data.message) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al iniciar sesión',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const clearRegisterForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const clearLoginForm = () => {
    setLoginIdentifier('');
    setLoginPassword('');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <div className="container">
                <div className="text-center">
                  <button className="btn btn-primary mx-3" type="button" data-bs-toggle="modal" data-bs-target="#registerModal">
                    Crear cuenta
                  </button>
                  <button className="btn btn-secondary mx-3" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">
                    Iniciar sesión
                  </button>
                </div>
              </div>
            )
          }
        />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard isAuthenticated={isAuthenticated} /> : <Navigate to="/" />} />
      </Routes>

      {/* Register Modal */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleRegisterSubmit}>
              <div className="modal-header bg-black">
                <h5 className="modal-title" id="registerModalLabel">Crear cuenta</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body bg-black">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input type="text" className="form-control bg-secondary" id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input type="text" className="form-control bg-secondary" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="off" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo</label>
                  <input type="email" className="form-control bg-secondary" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input type="password" className="form-control bg-secondary" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="off" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input type="password" className="form-control bg-secondary" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="off" />
                </div>
              </div>
              <div className="modal-footer bg-black">
                <button type="button" id="closeRegisterModalButton" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrarse</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-header bg-black">
                <h5 className="modal-title" id="loginModalLabel">Iniciar sesión</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body bg-black">
                <div className="mb-3">
                  <label htmlFor="loginIdentifier" className="form-label">Correo o Usuario</label>
                  <input type="text" className="form-control bg-secondary" id="loginIdentifier" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} required autoComplete="off" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                  <input type="password" className="form-control bg-secondary" id="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="off" />
                </div>
              </div>
              <div className="modal-footer bg-black">
                <button type="button" id="closeLoginModalButton" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary">Iniciar sesión</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

document.getElementById("formularioPaciente").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = parseInt(document.getElementById("edad").value);
  const genero = document.getElementById("genero").value;
  const documento = document.getElementById("documento").value.trim();
  const sintomas = document.getElementById("sintomas").value.trim();
  const Tratamiento = document.getElementById("Tratamiento").value.trim();
  const Medicamentos = document.getElementById("Medicamentos").value.trim();
  const Examenes = document.getElementById("Examenes").value.trim();
  const gravedad = document.getElementById("gravedad").value;

  if (!nombre || edad <= 17 || !documento || !sintomas | !Tratamiento | !Medicamentos ) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const tabla = document.getElementById("tablaPacientes");
  const fila = document.createElement("tr");

  switch (Examenes) {
    case "Hemograma":
      fila.className = "triaje-Hemograma";
      break;
    case "Radiografía":
      fila.className = "triaje-Radiografía";
      break;
    case "Ecografía":
      fila.className = "triaje-Ecografía";
      break;
    case "Análisis de Orina":
      fila.className = "triaje-Análisis de Orina";
      break;
    case "Tomografía":
      fila.className = "Tomografía";
      break;
    case "Resonancia Magnética":
      fila.className = "triaje-Resonancia Magnética";
      break;
  }
  
  switch (gravedad) {
    case "leve":
      fila.className = "triaje-leve";
      break;
    case "moderado":
      fila.className = "triaje-moderado";
      break;
    case "urgente":
      fila.className = "triaje-urgente";
      break;
    case "critico":
      fila.className = "triaje-critico";
      break;
  }

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${edad}</td>
    <td>${genero}</td>
    <td>${documento}</td>
    <td>${sintomas}</td>
    <td>${Tratamiento}</td>
    <td>${Medicamentos}</td>
    <td>${Examenes.toUpperCase()}</td>
    <td>${gravedad.toUpperCase()}</td>
    <td><button class="btn btn-danger btn-sm" onclick="eliminarPaciente(this)">Eliminar</button></td>
  `;

  tabla.appendChild(fila);
  this.reset();
});

function eliminarPaciente(boton) {
  const fila = boton.parentElement.parentElement;
  fila.remove();

patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const nuevoPaciente = {
            id: Date.now(), // ID único para el paciente
            nombre: document.getElementById('nombre').value,
            edad: parseInt(document.getElementById('edad').value),
            genero: document.getElementById('genero').value,
            documento: document.getElementById('documento').value,
            sintomas: document.getElementById('sintomas').value,
            gravedad: document.getElementById('gravedad').value,
            tratamiento: document.getElementById('tratamiento').value,
            medicamentos: document.getElementById('medicamentos').value,
            examenes: Array.from(document.getElementById('examenes').selectedOptions).map(option => option.value)
        };

        pacientes.push(nuevoPaciente);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        renderPacientes();
        patientForm.reset(); // Limpiar formulario
        patientForm.classList.remove('was-validated'); // Quitar validación de Bootstrap

        if (nuevoPaciente.gravedad === 'Crítico') {
            showAlert('¡ALERTA! Paciente en estado CRÍTICO registrado.', 'danger');
        }
    });

function validateForm() {
        let isValid = true;
        const fields = patientForm.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (field.hasAttribute('required') && field.value.trim() === '') {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (field.type === 'number' && field.id === 'edad') {
                if (parseInt(field.value) <= 0 || isNaN(parseInt(field.value))) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            } else if (field.id === 'documento') {
                if (field.value.trim().length < 5) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            } else {
                field.classList.remove('is-invalid');
            }
        });
        return isValid;
}

patientForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.hasAttribute('required') && field.value.trim() === '') {
                field.classList.add('is-invalid');
            } else if (field.type === 'number' && field.id === 'edad') {
                if (parseInt(field.value) <= 18 || isNaN(parseInt(field.value))) {
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            } else if (field.id === 'documento') {
                if (field.value.trim().length < 5) {
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            } else if (field.id === 'Tratamiento') {
                if (field.value.trim().length < 5) {
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            } else if (field.id === 'Medicamentos') {
                if (field.value.trim().length < 5) {
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            } else {
                field.classList.remove('is-invalid');
            }
        });
    });
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-critico`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
}

// aqui pongo el script del inicio de cuenta del usuario
        const users = []; 
        let currentUser = null; 
        const authSection = document.getElementById('auth-section');
        const mainPageSection = document.getElementById('main-page-section');
        const citaMedicaSection = document.getElementById('cita-medica-section');
        const mainTitle = document.getElementById('main-title');
        const loggedInUserSpan = document.getElementById('loggedInUser');

        function togglePasswordVisibility(id) {
            const passwordField = document.getElementById(id);
            const toggleIcon = document.getElementById('toggle' + id.charAt(0).toUpperCase() + id.slice(1));
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }

        function showSection(sectionId) {
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        }

        function redirectToMainPage(username) {
            mainTitle.textContent = 'Sistema Veterinario';
            loggedInUserSpan.textContent = username;
            showSection('main-page-section');
        }

        function redirectToLogin() {
            mainTitle.textContent = 'Bienvenido al Sistema Veterinario';
            currentUser = null;
            showSection('auth-section');
            document.getElementById('login-tab').click();
        }

        document.getElementById('registerForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const registerMessage = document.getElementById('registerMessage');
            const passwordStrengthFeedback = document.getElementById('passwordStrengthFeedback');
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8}$/;

            if (!passwordRegex.test(password)) {
                passwordStrengthFeedback.textContent = 'La contraseña debe tener exactamente 8 caracteres, al menos una mayúscula, un número y un símbolo especial.';
                passwordStrengthFeedback.classList.add('d-block', 'text-danger');
                registerMessage.className = 'alert-message mt-3 alert alert-danger';
                registerMessage.textContent = 'Error en la validación de la contraseña.';
                return;
            } else {
                passwordStrengthFeedback.classList.remove('d-block', 'text-danger');
                passwordStrengthFeedback.textContent = '';
            }

            if (users.some(user => user.username === username || user.email === email)) {
                registerMessage.className = 'alert-message mt-3 alert alert-warning';
                registerMessage.textContent = 'El nombre de usuario o correo electrónico ya está registrado.';
            } else {
                users.push({ username, email, password });
                registerMessage.className = 'alert-message mt-3 alert alert-success';
                registerMessage.textContent = '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.';
                document.getElementById('registerForm').reset();
                document.getElementById('login-tab').click();
            }
        });

        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const loginUsernameEmail = document.getElementById('loginUsernameEmail').value;
            const loginPassword = document.getElementById('loginPassword').value;
            const loginMessage = document.getElementById('loginMessage');

            const foundUser = users.find(user =>
                (user.username === loginUsernameEmail || user.email === loginUsernameEmail) && user.password === loginPassword
            );

            if (foundUser) {
                currentUser = foundUser;
                loginMessage.className = 'alert-message mt-3 alert alert-success';
                loginMessage.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
                setTimeout(() => {
                    redirectToMainPage(currentUser.username);
                }, 1000);
            } else {
                loginMessage.className = 'alert-message mt-3 alert alert-danger';
                loginMessage.textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
            }
        });

        document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
            event.preventDefault();
            alert('Funcionalidad de recuperación de contraseña: Se simularía el envío de un correo electrónico con instrucciones.');
        });

        document.getElementById('logoutButton').addEventListener('click', function() {
            alert('Cerrando sesión...');
            redirectToLogin();
        });

        document.getElementById('navCitaMedica').addEventListener('click', function() {
            if (currentUser) {
                showSection('cita-medica-section');
                document.getElementById('citaConfirmacion').style.display = 'none';
                document.getElementById('citaMedicaForm').reset();
            } else {
                alert('Debes iniciar sesión para acceder a esta funcionalidad.');
                redirectToLogin();
            }
        });

        document.getElementById('navReportes').addEventListener('click', function() {
            alert('La funcionalidad de Reportes no está implementada en esta demostración.');
        });

        document.getElementById('navVerMisDatos').addEventListener('click', function() {
            alert('La funcionalidad de Ver mis datos no está implementada en esta demostración.');
        });
        document.getElementById('backToMain').addEventListener('click', function() {
            if (currentUser) {
                redirectToMainPage(currentUser.username);
            } else {
                redirectToLogin();
            }
        });
        showSection('auth-section');

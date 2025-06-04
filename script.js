document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const patientSection = document.getElementById('patient-section');
    const patientListSection = document.getElementById('patient-list-section');
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authMessage = document.getElementById('auth-message');

    const patientForm = document.getElementById('patient-form');
    const pacientesTableBody = document.getElementById('pacientes-table-body');

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {
        'admin': 'admin123'
    }; // Usuarios de prueba

    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // --- Funcionalidad de Autenticación ---
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (usuarios[username] && usuarios[username] === password) {
            authSection.classList.add('d-none');
            patientSection.classList.remove('d-none');
            patientListSection.classList.remove('d-none');
            authMessage.textContent = '';
            renderPacientes();
        } else {
            authMessage.textContent = 'Usuario o contraseña incorrectos.';
            authMessage.className = 'mt-3 text-center text-danger';
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username.length < 3 || password.length < 5) {
            authMessage.textContent = 'El usuario debe tener al menos 3 caracteres y la contraseña al menos 5.';
            authMessage.className = 'mt-3 text-center text-danger';
            return;
        }

        if (usuarios[username]) {
            authMessage.textContent = 'El usuario ya existe.';
            authMessage.className = 'mt-3 text-center text-danger';
        } else {
            usuarios[username] = password;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            authMessage.textContent = 'Usuario registrado con éxito. Ya puedes iniciar sesión.';
            authMessage.className = 'mt-3 text-center text-success';
        }
    });

    // --- Funcionalidad de Registro de Pacientes ---
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

    // --- Validación de Formulario (JavaScript Puro) ---
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

    // Validación en tiempo real (ejemplo con 'input' event)
    patientForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.hasAttribute('required') && field.value.trim() === '') {
                field.classList.add('is-invalid');
            } else if (field.type === 'number' && field.id === 'edad') {
                if (parseInt(field.value) <= 0 || isNaN(parseInt(field.value))) {
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
            } else {
                field.classList.remove('is-invalid');
            }
        });
    });


    // --- Renderizar Pacientes y Contador de Gravedad ---
    function renderPacientes() {
        pacientesTableBody.innerHTML = ''; // Limpiar tabla

        // Ordenar pacientes por gravedad (Crítico > Urgente > Moderado > Leve)
        const ordenGravedad = {
            'Crítico': 4,
            'Urgente': 3,
            'Moderado': 2,
            'Leve': 1
        };
        pacientes.sort((a, b) => ordenGravedad[b.gravedad] - ordenGravedad[a.gravedad]);

        let countLeve = 0;
        let countModerado = 0;
        let countUrgente = 0;
        let countCritico = 0;

        pacientes.forEach(paciente => {
            const row = pacientesTableBody.insertRow();
            let gravedadClass = '';

            switch (paciente.gravedad) {
                case 'Crítico':
                    gravedadClass = 'gravedad-critico';
                    countCritico++;
                    break;
                case 'Urgente':
                    gravedadClass = 'gravedad-urgente';
                    countUrgente++;
                    break;
                case 'Moderado':
                    gravedadClass = 'gravedad-moderado';
                    countModerado++;
                    break;
                case 'Leve':
                    gravedadClass = 'gravedad-leve';
                    countLeve++;
                    break;
            }

            row.classList.add(gravedadClass);

            row.innerHTML = `
                <td>${paciente.nombre}</td>
                <td>${paciente.edad}</td>
                <td>${paciente.genero}</td>
                <td>${paciente.documento}</td>
                <td>${paciente.sintomas}</td>
                <td>${paciente.gravedad}</td>
                <td>${paciente.tratamiento}</td>
                <td>${paciente.medicamentos}</td>
                <td>${paciente.examenes.join(', ')}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deletePatient(${paciente.id})">Eliminar</button>
                </td>
            `;
        });

        // Actualizar contadores
        document.getElementById('count-leve').textContent = countLeve;
        document.getElementById('count-moderado').textContent = countModerado;
        document.getElementById('count-urgente').textContent = countUrgente;
        document.getElementById('count-critico').textContent = countCritico;
    }

    // --- Eliminar Paciente ---
    window.deletePatient = function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar a este paciente?')) {
            pacientes = pacientes.filter(paciente => paciente.id !== id);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            renderPacientes();
        }
    }

    // --- Alerta Visual para Paciente Crítico ---
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-critico`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);

        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
})

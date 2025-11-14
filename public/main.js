(function () {
    let preguntas = [];
    let preguntasOriginales = [];
    let preguntaActual = 0;
    let respuestasCorrectas = 0;
    let seleccionada = null;
    let mostrarResultado = false;

    const els = {
        inicioScreen: document.getElementById('inicioScreen'),
        juegoScreen: document.getElementById('juegoScreen'),
        resultadoScreen: document.getElementById('resultadoScreen'),
        urlInput: document.getElementById('urlInput'),
        numPreguntas: document.getElementById('numPreguntas'),
        iniciarBtn: document.getElementById('iniciarBtn'),
        errorBox: document.getElementById('errorBox'),
        errorText: document.getElementById('errorText'),
        progressCircle: document.getElementById('progressCircle'),
        progressText: document.getElementById('progressText'),
        correctasLabel: document.getElementById('correctasLabel'),
        correctasFill: document.getElementById('correctasFill'),
        progresoLabel: document.getElementById('progresoLabel'),
        progresoFill: document.getElementById('progresoFill'),
        numeroPregunta: document.getElementById('numeroPregunta'),
        correctasHeader: document.getElementById('correctasHeader'),
        preguntaTexto: document.getElementById('preguntaTexto'),
        opcionesContainer: document.getElementById('opcionesContainer'),
        siguienteContainer: document.getElementById('siguienteContainer'),
        siguienteBtn: document.getElementById('siguienteBtn'),
        resultScore: document.getElementById('resultScore'),
        resultText: document.getElementById('resultText'),
        resultMessage: document.getElementById('resultMessage'),
        reiniciarBtn: document.getElementById('reiniciarBtn'),
        cambiarRepoBtn: document.getElementById('cambiarRepoBtn')
    };

    els.iniciarBtn.addEventListener('click', cargarPreguntas);
    els.urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') cargarPreguntas(); });
    els.siguienteBtn.addEventListener('click', siguientePregunta);
    els.reiniciarBtn.addEventListener('click', reiniciarJuego);
    els.cambiarRepoBtn.addEventListener('click', cambiarRepositorio);

    async function cargarPreguntas() {
        const url = els.urlInput.value.trim();
        const numPreguntasDeseadas = parseInt(els.numPreguntas.value, 10);

        if (!url) {
            mostrarError('Por favor ingresa una URL');
            return;
        }

        els.iniciarBtn.textContent = 'Cargando...';
        els.iniciarBtn.disabled = true;
        ocultarError();

        let rawUrl = url;
        if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
            rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }

        try {
            const response = await fetch(rawUrl);
            if (!response.ok) throw new Error('No se pudo cargar el archivo. Verifica la URL.');
            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) throw new Error('El archivo debe contener un array de preguntas.');

            const preguntasValidas = data.every(p => p.pregunta && Array.isArray(p.opciones) && p.opciones.length > 0 && typeof p.correcta === 'number');
            if (!preguntasValidas) throw new Error('Las preguntas deben tener: pregunta, opciones[], y correcta (índice).');

            preguntasOriginales = data;

            if (numPreguntasDeseadas && numPreguntasDeseadas > 0) {
                if (numPreguntasDeseadas > preguntasOriginales.length) throw new Error('Solo hay ' + preguntasOriginales.length + ' preguntas disponibles.');
                preguntas = seleccionarPreguntasAleatorias(preguntasOriginales, numPreguntasDeseadas);
            } else {
                preguntas = preguntasOriginales.slice();
            }

            iniciarJuego();
        } catch (err) {
            mostrarError(err.message);
            els.iniciarBtn.textContent = 'Iniciar Quiz';
            els.iniciarBtn.disabled = false;
        }
    }

    function seleccionarPreguntasAleatorias(array, cantidad) {
        const copia = array.slice();
        // Fisher-Yates shuffle
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia.slice(0, cantidad);
    }

    function iniciarJuego() {
        els.inicioScreen.classList.add('hidden');
        els.juegoScreen.classList.remove('hidden');
        actualizarEstadisticas();
        mostrarPregunta();
    }

    function mostrarPregunta() {
        const pregunta = preguntas[preguntaActual];
        if (!pregunta) return;

        els.numeroPregunta.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;
        els.correctasHeader.textContent = `Correctas: ${respuestasCorrectas}`;
        els.preguntaTexto.textContent = pregunta.pregunta;

        els.opcionesContainer.innerHTML = '';
        pregunta.opciones.forEach((opcion, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opcion;
            btn.addEventListener('click', () => seleccionarOpcion(index));
            els.opcionesContainer.appendChild(btn);
        });

        els.siguienteContainer.classList.add('hidden');
    }

    function seleccionarOpcion(index) {
        if (mostrarResultado) return;

        seleccionada = index;
        mostrarResultado = true;

        const pregunta = preguntas[preguntaActual];
        const botones = els.opcionesContainer.querySelectorAll('.option-btn');

        botones.forEach((btn, i) => {
            btn.disabled = true;
            if (i === pregunta.correcta) btn.classList.add('correct');
            else if (i === seleccionada) btn.classList.add('incorrect');
        });

        if (index === pregunta.correcta) {
            respuestasCorrectas++;
            actualizarEstadisticas();
        }

        els.siguienteContainer.classList.remove('hidden');
        actualizarBotonSiguiente();
    }

    function actualizarBotonSiguiente() {
        els.siguienteBtn.textContent = preguntaActual < preguntas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados';
    }

    function siguientePregunta() {
        if (preguntaActual < preguntas.length - 1) {
            preguntaActual++;
            seleccionada = null;
            mostrarResultado = false;
            mostrarPregunta();
            actualizarEstadisticas();
        } else {
            mostrarResultados();
        }
    }

    function actualizarEstadisticas() {
        const total = preguntas.length;
        const porcentaje = total > 0 ? Math.round((respuestasCorrectas / total) * 100) : 0;
        const circumference = 439.82;
        const offset = circumference - (porcentaje / 100) * circumference;

        if (els.progressCircle) els.progressCircle.style.strokeDashoffset = offset;
        if (els.progressText) els.progressText.textContent = `${porcentaje}%`;

        els.correctasLabel.textContent = `${respuestasCorrectas}/${total}`;
        els.correctasFill.style.width = total > 0 ? `${(respuestasCorrectas / total) * 100}%` : '0%';

        els.progresoLabel.textContent = total > 0 ? `${preguntaActual + 1}/${total}` : '0/0';
        els.progresoFill.style.width = total > 0 ? `${((preguntaActual + 1) / total) * 100}%` : '0%';
    }

    function mostrarResultados() {
        els.juegoScreen.classList.add('hidden');
        els.resultadoScreen.classList.remove('hidden');

        const porcentaje = preguntas.length > 0 ? Math.round((respuestasCorrectas / preguntas.length) * 100) : 0;

        els.resultScore.textContent = `${porcentaje}%`;
        els.resultText.textContent = `Respuestas Correctas: ${respuestasCorrectas}/${preguntas.length}`;

        if (porcentaje >= 80) els.resultMessage.textContent = '¡Excelente trabajo!';
        else if (porcentaje >= 60) els.resultMessage.textContent = '¡Buen trabajo!';
        else if (porcentaje >= 40) els.resultMessage.textContent = 'Puedes mejorar';
        else els.resultMessage.textContent = '¡Sigue practicando!';
    }

    function reiniciarJuego() {
        preguntaActual = 0;
        respuestasCorrectas = 0;
        seleccionada = null;
        mostrarResultado = false;

        els.resultadoScreen.classList.add('hidden');
        els.juegoScreen.classList.remove('hidden');

        actualizarEstadisticas();
        mostrarPregunta();
    }

    function cambiarRepositorio() {
        preguntas = [];
        preguntasOriginales = [];
        preguntaActual = 0;
        respuestasCorrectas = 0;
        seleccionada = null;
        mostrarResultado = false;

        els.resultadoScreen.classList.add('hidden');
        els.inicioScreen.classList.remove('hidden');

        els.urlInput.value = '';
        els.numPreguntas.value = '';
        els.iniciarBtn.textContent = 'Iniciar Quiz';
        els.iniciarBtn.disabled = false;
        ocultarError();

        actualizarEstadisticas();
    }

    function mostrarError(mensaje) {
        els.errorText.textContent = mensaje;
        els.errorBox.classList.remove('hidden');
    }

    function ocultarError() {
        els.errorBox.classList.add('hidden');
    }

})();
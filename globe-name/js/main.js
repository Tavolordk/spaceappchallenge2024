
    // Esperar hasta que todo el contenido de la página esté completamente cargado
    window.addEventListener('load', function() {
        setTimeout(function() {
            let loader = document.getElementById('loader');
            let content = document.getElementById('page-content');

            // Ocultar el loader
            loader.style.display = 'none';

            // Mostrar el contenido
            content.classList.remove('hidden');
        }, 5000); // Esperar 5 segundos antes de ocultar el loader y mostrar el contenido
    });

document.addEventListener('DOMContentLoaded', function () {
    let audioContext;
    let audioBuffer;
    let audioSource;
    let isAudioPlaying = false;
    const toggleAudioButton = document.getElementById('toggle-audio');
    const audioIcon = document.getElementById('audio-icon');
    const startGameButton = document.getElementById('start-game');

    // Crear el AudioContext y cargar el audio
    async function createAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext creado.");
        }

        // Cargar el archivo de audio si no está cargado
        if (!audioBuffer) {
            const audioUrl = 'https://tavolordk.github.io/spaceappchallenge2024/globe-name/audio/prologue.mp3'; // Reemplaza con la ruta correcta de tu archivo de audio
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            console.log("Audio cargado y decodificado.");
        }
    }

    // Reproducir el audio
    function playAudio() {
        if (audioContext && audioBuffer) {
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(audioContext.destination);
            audioSource.start(0);
            isAudioPlaying = true;
            updateAudioIcon(true);  // Cambiar el icono a "audio activado"
            console.log("Audio reproduciéndose.");
        }
    }

    // Detener el audio
    function stopAudio() {
        if (audioSource) {
            audioSource.stop();
            isAudioPlaying = false;
            updateAudioIcon(false); // Cambiar el icono a "audio desactivado"
            console.log("Audio detenido.");
        }
    }

    // Alternar el audio entre activado y desactivado
    function toggleAudio() {
        if (isAudioPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    }

    // Cambiar el icono de control de audio
    function updateAudioIcon(isPlaying) {
        if (isPlaying) {
            audioIcon.classList.remove('fa-volume-mute');
            audioIcon.classList.add('fa-volume-up');
        } else {
            audioIcon.classList.remove('fa-volume-up');
            audioIcon.classList.add('fa-volume-mute');
        }
    }

    // Alternar el audio entre activado y desactivado al hacer clic en el icono
    toggleAudioButton.addEventListener('click', async function () {
        if (!audioContext) {
            await createAudioContext();  // Crear y cargar el contexto de audio solo la primera vez
        }
        toggleAudio();  // Alternar el estado del audio
    });

    // Comenzar el juego
    startGameButton.addEventListener('click', function () {
        console.log("Iniciando el juego...");
        // Aquí iría la lógica para comenzar el juego
    });
});


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

let currentPage = 1;
const itemsPerPage = 50; // Number of items per page
let totalPages = 0;
let filteredData = [];

// Function to load and paginate data
document.getElementById('start-game').addEventListener('click', function () {
    document.getElementById('start-game-section').classList.add('d-none');
    document.getElementById('about').classList.add('d-none');
    document.getElementById('game-container').classList.remove('d-none');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            document.getElementById('location').textContent = `Ubicación obtenida: Latitud: ${position.coords.latitude}, Longitud: ${position.coords.longitude}`;

            // Load CSV data
            Papa.parse('https://tavolordk.github.io/spaceappchallenge2024/globe-name/data/Cleaned_GLOBEMeasurementData_21713.csv', {
                download: true,
                header: true,
                complete: function (results) {
                    const data = results.data;
                    filteredData = data;
                    totalPages = Math.ceil(filteredData.length / itemsPerPage);
                    loadPage(currentPage);
                    updatePaginationButtons();
                }
            });
        }, function (error) {
            document.getElementById('location').textContent = "No se pudo obtener la ubicación.";
        });
    } else {
        document.getElementById('location').textContent = "La geolocalización no es soportada por este navegador.";
    }
});

// Function to load specific page
function loadPage(page) {
    const siteSelect = document.getElementById('site-select');
    siteSelect.innerHTML = ''; // Clear select options

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    pageData.forEach(row => {
        let option = document.createElement('option');
        option.value = row[' org_name'];
        option.text = row[' org_name'];
        siteSelect.add(option);
    });

    // Automatically load first site's data
    if (pageData.length > 0) {
        const firstSite = siteSelect.options[0].value;
        loadSiteData(firstSite);
    }
}

// Update pagination buttons
function updatePaginationButtons() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Event listeners for pagination
document.getElementById('prev-page').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
        updatePaginationButtons();
    }
});

document.getElementById('next-page').addEventListener('click', function () {
    if (currentPage < totalPages) {
        currentPage++;
        loadPage(currentPage);
        updatePaginationButtons();
    }
});

// Event listener for site selection change
document.getElementById('site-select').addEventListener('change', function () {
    const selectedSite = this.value;
    loadSiteData(selectedSite);
});

// Function to load data for selected site
let temperatureChart = null; // Declare a global variable to store the chart instance

function loadSiteData(siteName) {
    const selectedData = filteredData.find(row => row[' org_name'] === siteName);

    document.getElementById('temp').textContent = selectedData['air temp dailies:current temp (deg C)'] || 'Dato no disponible';
    document.getElementById('humidity').textContent = selectedData['humidities:relative humidity (%)'] || 'Dato no disponible';
    document.getElementById('air-quality').textContent = selectedData['aerosols:observed sky clarity'] || 'Dato no disponible';
    document.getElementById('pressure').textContent = selectedData['barometric pressures:pressure'] || 'Dato no disponible';
    document.getElementById('clouds').textContent = selectedData['sky conditions:cloud cover'] || 'Dato no disponible';
    document.getElementById('precipitation').textContent = selectedData['precipitations:liquid accumulation'] || 'Dato no disponible';
    document.getElementById('landCover').textContent = selectedData['land covers:muc description'] || 'Dato no disponible';

    // Update chart with new data
    const tempData = [
        selectedData['air temp dailies:current temp (deg C)'] || 0,
        selectedData['humidities:relative humidity (%)'] || 0,
        selectedData['barometric pressures:pressure'] || 0,
        selectedData['aerosols:observed sky clarity'] || 0,
        selectedData['sky conditions:cloud cover'] || 0,
        selectedData['precipitations:liquid accumulation'] || 0,
        selectedData['land covers:muc description'] || 0
    ];

    createTemperatureChart(tempData, [
        'Temperatura', 
        'Humedad', 
        'Presión', 
        'Aerosoles', 
        'Nubes', 
        'Precipitación', 
        'Cobertura Terrestre'
    ]);
}

// Function to create or update chart
function createTemperatureChart(data, labels) {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    
    // Destroy the existing chart if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Create a new chart
    temperatureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Datos Ambientales',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(0, 123, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 123, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

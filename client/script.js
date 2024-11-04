const video = document.getElementById('video');
const plateInput = document.getElementById('plate');
const recognizedText = document.getElementById('recognizedText');

// Ativar a webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => console.error('Erro ao acessar a webcam', error));

// Função para capturar a imagem e enviar ao backend
function captureAndSend() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte o canvas para Blob e envia ao backend
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        fetch('http://localhost:5000/recognize', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.recognized_text) {
                recognizedText.textContent = data.recognized_text;
                plateInput.value = data.recognized_text.trim();
            } else {
                recognizedText.textContent = 'Nenhum texto reconhecido.';
            }
        })
        .catch(error => console.error('Erro ao reconhecer placa:', error));
    }, 'image/jpeg');
}

// Chama a função captureAndSend a cada 2 segundos
setInterval(captureAndSend, 2000);

// Função para enviar a placa para o backend PHP
function sendPlate() {
    const plate = plateInput.value;
    console.log("Placa a ser enviada:", plate); // Log para depuração
    if (plate) {
        fetch('server/save_plate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `plate=${encodeURIComponent(plate)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao se comunicar com o servidor");
            }
            return response.text();
        })
        .then(data => {
            console.log("Resposta do servidor:", data); // Log da resposta
            alert(data); // Mensagem de retorno do PHP (sucesso ou erro)
        })
        .catch(error => {
            console.error('Erro ao salvar a placa:', error);
            alert("Houve um erro ao salvar a placa. Verifique a conexão com o servidor.");
        });
    } else {
        alert("Nenhuma placa para salvar.");
    }
}

let input = document.getElementById('input');
let btn = document.getElementById('btn');

async function upload() {
    const formData = new FormData();
    const fileField = document.getElementById('file');

    formData.append('instructions', input.value);
    formData.append('file', fileField.files[0]);

    try {
        const response = await fetch('./api', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log('Успех:', JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

btn.addEventListener('click', upload);

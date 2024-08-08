const result = document.getElementById('prompt');
let prompt = '';

function getPromptByCategory(){
    const section = document.getElementById('category').value;
    const data = {category: section};
    fetch('http://localhost:5500/prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        result.textContent = data.prompt;
    })
    .catch(error => console.error('Error fetching prompt!', error));
}

function getRandomPrompts(){
    fetch('http://localhost:5500/randPrompts', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        result.textContent = data.prompt;
    })
    .catch(error => console.error('Error fetching prompt!', error));
}
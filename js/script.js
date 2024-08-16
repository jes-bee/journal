const result = document.getElementById('prompt');
let prompt = '';

function getPromptByCategory(){
    const section = document.getElementById('category').value;
    const data = {category: section};
    fetch('https://journal-git-fork-jbidlack-main-jessicas-projects-83498b59.vercel.app/prompt', {
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
    fetch('https://journal-git-fork-jbidlack-main-jessicas-projects-83498b59.vercel.app/randPrompts', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        result.textContent = data.prompt;
    })
    .catch(error => console.error('Error fetching prompt!', error));
}

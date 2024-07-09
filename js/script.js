document.getElementById('generateBtn').addEventListener('click', function() {
    const category = document.getElementById('category').value;
    let prompt = '';

    switch(category) {
        case 'personal':
            prompt = getRandomPrompt(personalPrompts);
            break;
        case 'work':
            prompt = getRandomPrompt(workPrompts);
            break;
        case 'creative':
            prompt = getRandomPrompt(creativePrompts);
            break;
        default:
            prompt = 'Please select a category.';
    }

    document.getElementById('prompt').textContent = prompt;
});

const personalPrompts = [
    'What are you grateful for today?',
    'Describe a memorable moment from your childhood.',
    'What are your goals for the next year?'
];

const workPrompts = [
    'What is the biggest challenge you face at work?',
    'Describe a recent accomplishment you are proud of.',
    'What skills do you want to develop and why?'
];

const creativePrompts = [
    'Write a story about a hidden treasure.',
    'Describe a day in the life of a fictional character.',
    'Imagine a world where everyone can fly. What would it be like?'
];

function getRandomPrompt(prompts) {
    return prompts[Math.floor(Math.random() * prompts.length)];
}

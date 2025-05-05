//loading the 10 random dog images 

fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('dogCarousel');
        data.message.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            container.appendChild(img);
        });
    });
        

    //loading dog breeds and creating buttons
fetch('https://api.thedogapi.com/v1/breeds')
    .then(response => response.json())
    .then(data => {
        const buttonContainer = document.getElementById('breed-buttons');
        const breedInfo = document.getElementById('breedInfo');

        data.forEach(breed => {
            const btn = document.createElement('button');
            btn.className = 'custom-button';
            btn.innerText = breed.name;
            btn.addEventListener('click', () => {
                breedInfo.style.display = 'block';
                breedInfo.innerHTML = `
                    <h3>${breed.name}</h3>
                    <p><strong>Description:</strong> ${breed.bred_for || 'N/A'}</p>
                    <p><strong>Life Span:</strong> ${breed.life_span}</p>
                `;
            });
            buttonContainer.appendChild(btn);
        });
    });


//adding the specifc voice command for dog 

if (annyang) {
// define a command.
    const dogCommands = {
        'load dog breed *breed': breed => {
            const buttons = document.querySelectorAll('#breed-buttons button');
            buttons.forEach(btn => {
                if (btn.innerText.toLowerCase() === breed.toLowerCase()) {
                    btn.click();
                }
            });
        }
    };
    // Add our commands to annyang
    annyang.addCommands(dogCommands);
}
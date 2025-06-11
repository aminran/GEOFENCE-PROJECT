const upBtn = document.getElementById('upButton');
    const downBtn = document.getElementById('downButton');

    // Scroll to the top of the webpage when 'Up' button is clicked
    upBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll to the bottom of the webpage when 'Down' button is clicked
    downBtn.addEventListener('click', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        window.scrollTo({ top: documentHeight - windowHeight, behavior: 'smooth' });
    });
const loadWelcomeTemplate = async () => {
    const template = `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                text-align: center;
                padding: 20px;
            }
            h1 {
                color: #FF6347; /* Rojo coral */
            }
            p {
                color: #008080; /* Azul verdoso */
            }
            table {
                width: 80%;
                border-collapse: collapse;
                margin: 20px auto;
                background-color: rgba(255, 255, 255, 0.7); /* Fondo blanco semi-transparente */
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            th {
                background-color: #00CED1; /* Azul turquesa */
                color: #FFD700; /* Dorado */
                padding: 12px;
                text-align: left;
            }
            td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            tr:nth-child(even) {
                background-color: #FF6347; 
                color: #FFF; 
            }
            form {
                max-width: 500px;
                margin: 20px auto;
                background: rgba(255, 20, 147, 0.5); 
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                color: #FFD700; 
            }
            input, textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #FFD700; 
                border-radius: 4px;
                box-sizing: border-box;
            }
            button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                background-color: #32CD32; 
                color: #FFF; 
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background-color: #3CB371; 
            }
            .action-buttons button.delete {
                background-color: #DC143C; 
            }
            .action-buttons button.delete:hover {
                background-color: #B22222; 
            }
            .action-buttons button.update {
                background-color: #1E90FF; 
            }
            .action-buttons button.update:hover {
                background-color: #4169E1; 
            }
        </style>
        <h1>Cartelera Ciñemex</h1>
        <p>Administracion de peliculas en Ciñemex</p>
        <table id="movies-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Género</th>
                    <th>Prologo</th>
                    <th>Administrar</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <form id="create-movie-form">
            <div>
                <label for="name">Nombre:</label>
                <input type="text" id="name" required>
            </div>
            <div>
                <label for="genre">Género:</label>
                <input type="text" id="genre" required>
            </div>
            <div>
                <label for="description">Prologo:</label>
                <textarea id="description" required></textarea>
            </div>
            <button type="submit">Dar de Alta</button>
        </form>
    `;
    document.body.innerHTML = template;

    document.getElementById('create-movie-form').onsubmit = async (event) => {
        event.preventDefault();
        await createMovie();
    };

    await loadMovies();
};

const loadMovies = async () => {
    try {
        const response = await fetch('/movies');
        const movies = await response.json();

        const tableBody = document.getElementById('movies-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing rows
        movies.forEach(movie => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = movie.name;
            row.insertCell(1).textContent = movie.genre;
            row.insertCell(2).textContent = movie.description;

            const actionsCell = row.insertCell(3);
            actionsCell.classList.add('action-buttons');
            actionsCell.appendChild(createActionButton('Eliminar', () => deleteMovie(movie._id), 'delete'));
            actionsCell.appendChild(createActionButton('Actualizar', () => updateMovie(movie._id, movie.name, movie.genre, movie.description), 'update'));
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

const createMovie = async () => {
    const name = document.getElementById('name').value;
    const genre = document.getElementById('genre').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify({ name, genre, description }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const newMovie = await response.json();
            addMovieToTable(newMovie);
            document.getElementById('create-movie-form').reset();
        } else {
            console.error('Error creating movie:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating movie:', error);
    }
};

const addMovieToTable = (movie) => {
    const tableBody = document.getElementById('movies-table').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = movie.name;
    row.insertCell(1).textContent = movie.genre;
    row.insertCell(2).textContent = movie.description;

    const actionsCell = row.insertCell(3);
    actionsCell.classList.add('action-buttons');
    actionsCell.appendChild(createActionButton('Eliminar', () => deleteMovie(movie._id), 'delete'));
    actionsCell.appendChild(createActionButton('Actualizar', () => updateMovie(movie._id, movie.name, movie.genre, movie.description), 'update'));
};

const deleteMovie = async (id) => {
    try {
        await fetch(`/movies/${id}`, { method: 'DELETE' });
        loadWelcomeTemplate();
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
};

const updateMovie = async (id, name, genre, description) => {
    const newName = prompt('Nuevo nombre:', name);
    const newGenre = prompt('Nuevo género:', genre);
    const newDescription = prompt('Nueva descripción:', description);

    try {
        await fetch(`/movies/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name: newName, genre: newGenre, description: newDescription }),
            headers: { 'Content-Type': 'application/json' }
        });
        loadWelcomeTemplate();
    } catch (error) {
        console.error('Error updating movie:', error);
    }
};

const createActionButton = (label, onClick, className) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = onClick;
    button.classList.add(className);
    return button;
};

window.onload = loadWelcomeTemplate;

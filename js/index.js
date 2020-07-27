const d = document;

const db = firebase.firestore();

const formTask = d.getElementById('formTask');

const agregarTarea = (title, desc) => db.collection('tareas').doc().set({
        nombre: title,
        descripcion: desc
    });

const borrarTarea = id => db.collection('tareas').doc(id).delete();

const editarTarea = id => {
    
}

const listarTareas = () => db.collection('tareas').get();

const cargarTareas = async() => {
    const divTareas = d.getElementById('tareas');
    const querySnapshot = await listarTareas();
    
    divTareas.innerHTML = "";

    querySnapshot.forEach(doc => {
        const {id} = doc;
        const {nombre, descripcion} = doc.data();
        
        divTareas.innerHTML += `
        <tr>
            <td>${nombre}</td>
            <td>${descripcion}</td>
            <td>
                <button data-id=${id} class="btn btn-secondary btn-update">Editar</button>
                <button data-id=${id} class="btn btn-danger btn-delete">Borrar</button>
            </td>
        </tr>
        `
    })

    const btnDeletes = d.querySelectorAll('.btn-delete');

    btnDeletes.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            await borrarTarea(e.target.dataset.id);
            cargarTareas();
        })
    })

    const btnUpdates = d.querySelectorAll('.btn-update');

    btnUpdates.forEach(btn => {
        btn.addEventListener('click', async(e) => {
            console.log(e.target.dataset.id);
            // cargarTareas();
        })
    })
}

addEventListener('DOMContentLoaded', async(e) => {
    cargarTareas();
})

formTask.addEventListener('submit', async(e) => {
    e.preventDefault();

    const taskTitle = d.getElementById('taskTitle');
    const taskDesc = d.getElementById('taskDesc');

    await agregarTarea(taskTitle.value, taskDesc.value);

    e.target.reset();
    taskTitle.focus();

    cargarTareas();
})
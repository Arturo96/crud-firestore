const d = document;
let id = "";
const db = firebase.firestore();

const formTask = d.getElementById("formTask");

const agregarTarea = (title, desc) =>
	db.collection("tareas").doc().set({
		nombre: title,
		descripcion: desc
	});

const borrarTarea = id => db.collection("tareas").doc(id).delete();

const editarTarea = (id, updatedTask) => db.collection("tareas").doc(id).update(updatedTask);

const onChangeTasks = callback => db.collection("tareas").onSnapshot(callback);

const listarTareas = () => db.collection("tareas").get();

const listarTareaPorId = id => db.collection("tareas").doc(id).get();

const cargarTareas = async () => {
	const divTareas = d.getElementById("tareas");
	const querySnapshot = await listarTareas();

	divTareas.innerHTML = "";

	querySnapshot.forEach(doc => {
		const { id } = doc;
		let { nombre, descripcion } = doc.data();

		divTareas.innerHTML += `
        <tr>
            <td>${nombre}</td>
            <td>${descripcion}</td>
            <td>
                <button data-id=${id} class="btn btn-secondary btn-update">Editar</button>
                <button data-id=${id} class="btn btn-danger btn-delete">Borrar</button>
            </td>
        </tr>
        `;
	});

	const btnDeletes = d.querySelectorAll(".btn-delete");

	btnDeletes.forEach(btn => {
		btn.addEventListener("click", async e => {
			await borrarTarea(e.target.dataset.id);
			cargarTareas();
		});
	});

	const btnUpdates = d.querySelectorAll(".btn-update");

	btnUpdates.forEach(btn => {
		btn.addEventListener("click", async e => {
			id = e.target.dataset.id;

			const doc = await listarTareaPorId(id);
			let { nombre, descripcion } = doc.data();

			d.getElementById("taskTitle").value = nombre;
			d.getElementById("taskDesc").value = descripcion;

			d.getElementById("btnAddTask").textContent = "Actualizar";

			
		});
	});
};

addEventListener("DOMContentLoaded", async e => {
	cargarTareas();
});

formTask.addEventListener("submit", async e => {
	e.preventDefault();

	const taskTitle = d.getElementById("taskTitle");
	const taskDesc = d.getElementById("taskDesc");

	if (d.getElementById("btnAddTask").textContent === "Agregar") {
		await agregarTarea(taskTitle.value, taskDesc.value);
	} else {
		const updatedTask = {
			nombre: taskTitle.value,
			descripcion: taskDesc.value
		};
		console.log(updatedTask);
		await editarTarea(id, updatedTask);
		d.getElementById("btnAddTask").textContent = 'Agregar'
		cargarTareas();
	}

	e.target.reset();
	taskTitle.focus();

	cargarTareas();
});

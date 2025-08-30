//Obtención de datos del formulario
tablebody = document.querySelector('.main_lista-guide-table-body')
let totalGuides = 0;
let totalInTransitGuides = 0;
let totalDeliveredGuides = 0;

//Funciones cuando se actualiza la pagina o se inicia
document.addEventListener('DOMContentLoaded', () => {
    updateGuideCounts();
    loadGuidesFromSession();
});



document.getElementById('guide-registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    //Obtención de valores
    const guideNumber = document.getElementById('guide_number').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const receiver = document.getElementById('receiver').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;

    // Verifica si ya existe una fila con ese número de guía
    const exists = Array.from(tablebody.getElementsByTagName('tr')).some(tr => {
        return tr.getElementsByTagName('td')[0]?.textContent === guideNumber;
    });
    if (exists) {
        alert('Ya existe una guía con ese número.');
        return;
    }

    //Conversión de valores para estado de guia
    let deliveryStatus = '';
    switch (status){
        case '1':
            deliveryStatus = 'Pendiente';
            break;
        case '2':
            deliveryStatus = 'En tránsito';
            break;
        case '3':
            deliveryStatus = 'Entregado';
            break;
        default:
            deliveryStatus = 'Desconocido';
    }
    //Creación de nueva fila
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${guideNumber}</td>
        <td>${deliveryStatus}</td>
        <td>${origin}</td>
        <td>${destination}</td>
        <td>${date}</td>
        <td class="main_lista-guide-table-body-actions">
            <button class="main_lista-guide-table-body-actions-btn"><img src="img/recharge.png" alt="icono recarga"> Actualizar</button>
            <button class="main_lista-guide-table-body-actions-btn"><img src="img/historial.png" alt="icono historial"> Revisar Historial</button>
            <select class="status-selector main_lista-guide-table-body-actions-btn">
                <option value="1" ${status === '1' ? 'selected' : ''}>Pendiente</option>
                <option value="2" ${status === '2' ? 'selected' : ''}>En tránsito</option>
                <option value="3" ${status === '3' ? 'selected' : ''}>Entregado</option>
            </select>
        </td>
    `;
    tablebody.appendChild(newRow);

    // Añadir event listener al nuevo selector
    const statusSelector = newRow.querySelector('.status-selector');
    statusSelector.addEventListener('change', function() {
        const statusCell = newRow.getElementsByTagName('td')[1];
        switch (this.value) {
            case '1':
                statusCell.textContent = 'Pendiente';
                break;
            case '2':
                statusCell.textContent = 'En tránsito';
                break;
            case '3':
                statusCell.textContent = 'Entregado';
                break;
        }
        saveGuidesToSession();
        updateGuideCounts();
    });

    //Limpiar formulario
    document.getElementById('guide-registration-form').reset();
    updateGuideCounts();
    saveGuidesToSession();
});

// Al cargar la página, añade listeners a los selectores existentes
document.addEventListener('DOMContentLoaded', () => {
    updateGuideCounts();
    document.querySelectorAll('.status-selector').forEach(function(selector) {
        selector.addEventListener('change', function() {
            const row = this.closest('tr');
            const statusCell = row.getElementsByTagName('td')[1];
            switch (this.value) {
                case '1':
                    statusCell.textContent = 'Pendiente';
                    break;
                case '2':
                    statusCell.textContent = 'En tránsito';
                    break;
                case '3':
                    statusCell.textContent = 'Entregado';
                    break;
            }
            saveGuidesToSession();
            updateGuideCounts();
        });
    });
});

//Obtener la cantidad de guías registradas
function updateGuideCounts() {
    const rows = tablebody.getElementsByTagName('tr');
    totalGuides = 0;
    rowTotal = document.querySelector('.main_general-status-table-row1').textContent;
    rowInTransit = document.querySelector('.main_general-status-table-row2').textContent;
    rowDelivered = document.querySelector('.main_general-status-table-row3').textContent;
    totalInTransitGuides = 0;
    totalDeliveredGuides = 0;
    for (let i = 0; i < rows.length; i++) {
        const statusCell = rows[i].getElementsByTagName('td')[1];
        const statusText = statusCell.textContent || statusCell.innerText;

        if (statusText === 'En tránsito') {
            totalInTransitGuides++;
            totalGuides++;
        } else if (statusText === 'Pendiente') {
            totalGuides++;
            
        }
    }
    console.log('Total de guías entregadas:', totalDeliveredGuides); 
    console.log('Total de guías en tránsito:', totalInTransitGuides);
    document.querySelector('.main_general-status-table-row1').textContent = totalGuides;
    document.querySelector('.main_general-status-table-row2').textContent = totalInTransitGuides;
    document.querySelector('.main_general-status-table-row3').textContent = totalDeliveredGuides;
    if(rowTotal == totalGuides && rowInTransit == totalInTransitGuides && rowDelivered == totalDeliveredGuides){
        console.log('Todos los contadores están sincronizados.');
    }
    
}

// Guardar registros
function saveGuidesToSession() {
    let data = [];
    const rows = tablebody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        // Concatenar los valores de las celdas principales (ajusta según tus columnas)
        let rowData = [
            cells[0].textContent, // Número de guía
            cells[1].textContent, // Estado
            cells[2].textContent, // Origen
            cells[3].textContent, // Destino
            cells[4].textContent  // Fecha
        ].join(';');
        data.push(rowData);
    }
    sessionStorage.setItem('guides', data.join('|'));
}

// Cargar registros
function loadGuidesFromSession() {
    const data = sessionStorage.getItem('guides');
    if (!data) return;
    const rows = data.split('|');
    rows.forEach(row => {
        const fields = row.split(';');
        if (fields.length < 5) return;

        // Verifica si ya existe una fila con ese número de guía
        const exists = Array.from(tablebody.getElementsByTagName('tr')).some(tr => {
            return tr.getElementsByTagName('td')[0]?.textContent === fields[0];
        });
        if (exists) return;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${fields[0]}</td>
            <td>${fields[1]}</td>
            <td>${fields[2]}</td>
            <td>${fields[3]}</td>
            <td>${fields[4]}</td>
            <td class="main_lista-guide-table-body-actions">
                <button class="main_lista-guide-table-body-actions-btn"><img src="img/recharge.png" alt="icono recarga"> Actualizar</button>
                <button class="main_lista-guide-table-body-actions-btn"><img src="img/historial.png" alt="icono historial"> Revisar Historial</button>
                <select class="status-selector main_lista-guide-table-body-actions-btn">
                    <option value="1" ${fields[1] === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="2" ${fields[1] === 'En tránsito' ? 'selected' : ''}>En tránsito</option>
                    <option value="3" ${fields[1] === 'Entregado' ? 'selected' : ''}>Entregado</option>
                </select>
            </td>
        `;
        tablebody.appendChild(newRow);
        // Añade el event listener al selector como antes
        const statusSelector = newRow.querySelector('.status-selector');
        statusSelector.addEventListener('change', function() {
            const statusCell = newRow.getElementsByTagName('td')[1];
            switch (this.value) {
                case '1': statusCell.textContent = 'Pendiente'; break;
                case '2': statusCell.textContent = 'En tránsito'; break;
                case '3': statusCell.textContent = 'Entregado'; break;
            }
            saveGuidesToSession();
            updateGuideCounts();
        });
    });
    updateGuideCounts();
}

// Dados dos veículos (simulando localStorage para deploy estático)
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

// Elementos do DOM
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.querySelector('.close');
const maintenanceForm = document.getElementById('maintenanceForm');
const vehiclesList = document.getElementById('vehiclesList');
const historyList = document.getElementById('historyList');

// Controle de abas
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        if (targetTab === 'vehicles') {
            document.getElementById('vehicles-tab').classList.add('active');
        } else {
            document.getElementById('history-tab').classList.add('active');
        }

        renderVehicles();
    });
});

// Filtros
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderVehicles();
    });
});

// Modal
openModalBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Adicionar Manutenção';
    maintenanceForm.reset();
    document.getElementById('editIndex').value = '';
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Formatação de moeda
document.getElementById('valorOrcamento').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    e.target.value = 'R$ ' + value.replace('.', ',');
});

// Submissão do formulário
maintenanceForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const vehicle = {
        id: Date.now(),
        modelo: document.getElementById('modelo').value,
        placa: document.getElementById('placa').value.toUpperCase(),
        oficina: document.getElementById('oficina').value,
        numeroOS: document.getElementById('numeroOS').value,
        problema: document.getElementById('problema').value,
        valorOrcamento: document.getElementById('valorOrcamento').value,
        previsaoSaida: document.getElementById('previsaoSaida').value,
        status: document.getElementById('status').value,
        dataRegistro: new Date().toISOString()
    };

    const editIndex = document.getElementById('editIndex').value;

    if (editIndex !== '') {
        // Editar veículo existente
        vehicles[editIndex] = { ...vehicles[editIndex], ...vehicle, id: vehicles[editIndex].id };
    } else {
        // Adicionar novo veículo
        vehicles.push(vehicle);
    }

    saveVehicles();
    modal.style.display = 'none';
    maintenanceForm.reset();
    renderVehicles();
});

// Salvar no localStorage
function saveVehicles() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Renderizar resumo por oficina
function renderWorkshopSummary() {
    const summaryContainer = document.getElementById('workshopSummary');
    const activeVehicles = vehicles.filter(v => v.status !== 'entregue');

    if (activeVehicles.length === 0) {
        summaryContainer.innerHTML = '';
        return;
    }

    // Agrupar veículos por oficina
    const workshopCounts = {};
    activeVehicles.forEach(vehicle => {
        const workshop = vehicle.oficina;
        workshopCounts[workshop] = (workshopCounts[workshop] || 0) + 1;
    });

    // Ordenar por quantidade (maior para menor)
    const sortedWorkshops = Object.entries(workshopCounts).sort((a, b) => b[1] - a[1]);

    const statsHTML = sortedWorkshops.map(([workshop, count]) => `
        <div class="workshop-stat">
            <span class="workshop-name">${workshop}</span>
            <span class="workshop-count">${count}</span>
        </div>
    `).join('');

    summaryContainer.innerHTML = `
        <h3>📊 Veículos por Oficina</h3>
        <div class="workshop-stats">
            ${statsHTML}
        </div>
    `;
}

// Renderizar veículos
function renderVehicles() {
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    renderWorkshopSummary();

    if (activeTab === 'vehicles') {
        renderActiveVehicles();
    } else {
        renderHistoryVehicles();
    }
}

function renderActiveVehicles() {
    const activeVehicles = vehicles.filter(v => v.status !== 'entregue');

    const filteredVehicles = currentFilter === 'all'
        ? activeVehicles
        : activeVehicles.filter(v => v.status === currentFilter);

    if (filteredVehicles.length === 0) {
        vehiclesList.innerHTML = '<p style="text-align: center; color: #94A3B8; padding: 40px;">Nenhum veículo encontrado.</p>';
        return;
    }

    vehiclesList.innerHTML = filteredVehicles.map((vehicle, index) => {
        const realIndex = vehicles.indexOf(vehicle);
        return createVehicleCard(vehicle, realIndex);
    }).join('');
}

function renderHistoryVehicles() {
    const historyVehicles = vehicles.filter(v => v.status === 'entregue');

    if (historyVehicles.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #94A3B8; padding: 40px;">Nenhum veículo no histórico.</p>';
        return;
    }

    historyList.innerHTML = historyVehicles.map((vehicle, index) => {
        const realIndex = vehicles.indexOf(vehicle);
        return createVehicleCard(vehicle, realIndex, true);
    }).join('');
}

function createVehicleCard(vehicle, index, isHistory = false) {
    const statusLabels = {
        'orcamento': 'Orçamento',
        'aguardando-aprovacao': 'Aguardando Aprovação',
        'aguardando-peca': 'Aguardando Peça',
        'em-execucao': 'Em Execução',
        'pronto': 'Pronto',
        'entregue': 'Entregue'
    };

    const previsao = vehicle.previsaoSaida
        ? new Date(vehicle.previsaoSaida + 'T00:00:00').toLocaleDateString('pt-BR')
        : 'Não informada';

    return `
        <div class="vehicle-card">
            <div class="vehicle-header">
                <div class="vehicle-modelo">${vehicle.modelo}</div>
                <div class="vehicle-placa">${vehicle.placa}</div>
            </div>

            <div class="vehicle-info">
                <div class="info-row">
                    <span class="info-label">Oficina:</span>
                    <span class="info-value">${vehicle.oficina}</span>
                </div>
                ${vehicle.numeroOS ? `
                <div class="info-row">
                    <span class="info-label">Nº OS:</span>
                    <span class="info-value">${vehicle.numeroOS}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Previsão:</span>
                    <span class="info-value">${previsao}</span>
                </div>
                ${vehicle.valorOrcamento ? `
                <div class="info-row">
                    <span class="info-label">Valor:</span>
                    <span class="info-value">${vehicle.valorOrcamento}</span>
                </div>
                ` : ''}
            </div>

            <div class="vehicle-problema">
                <strong>Problema:</strong> ${vehicle.problema}
            </div>

            <div class="status-badge status-${vehicle.status}">
                ${statusLabels[vehicle.status]}
            </div>

            ${!isHistory ? `
            <div class="vehicle-actions">
                <button class="btn-action btn-edit" onclick="editVehicle(${index})">Editar</button>
                <button class="btn-action btn-delete" onclick="deleteVehicle(${index})">Excluir</button>
            </div>
            ` : `
            <div class="vehicle-actions">
                <button class="btn-action btn-delete" onclick="deleteVehicle(${index})">Excluir</button>
            </div>
            `}
        </div>
    `;
}

// Editar veículo
function editVehicle(index) {
    const vehicle = vehicles[index];

    document.getElementById('modalTitle').textContent = 'Editar Manutenção';
    document.getElementById('editIndex').value = index;
    document.getElementById('modelo').value = vehicle.modelo;
    document.getElementById('placa').value = vehicle.placa;
    document.getElementById('oficina').value = vehicle.oficina;
    document.getElementById('numeroOS').value = vehicle.numeroOS || '';
    document.getElementById('problema').value = vehicle.problema;
    document.getElementById('valorOrcamento').value = vehicle.valorOrcamento || '';
    document.getElementById('previsaoSaida').value = vehicle.previsaoSaida || '';
    document.getElementById('status').value = vehicle.status;

    modal.style.display = 'block';
}

// Excluir veículo
function deleteVehicle(index) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        vehicles.splice(index, 1);
        saveVehicles();
        renderVehicles();
    }
}

// Inicialização
renderVehicles();

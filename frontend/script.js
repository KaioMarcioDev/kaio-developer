const API_URL = 'http://localhost:3001/api/users';

class UserManager {
    constructor() {
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupEventListeners();
        this.setupModal();
    }

    setupEventListeners() {
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
    }

    setupModal() {
        this.modal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.closeBtn = document.querySelector('.close');
        this.cancelBtn = document.querySelector('.cancel-btn');

        // Eventos para fechar modal
        this.closeBtn.onclick = () => this.closeModal();
        this.cancelBtn.onclick = () => this.closeModal();
        
        // Fechar ao clicar fora do modal
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        };

        // Submit do formulário de edição
        this.editForm.onsubmit = (e) => {
            e.preventDefault();
            this.submitEdit();
        };
    }

    async loadUsers() {
        try {
            this.showLoading();
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const users = await response.json();
            this.displayUsers(users);
        } catch (error) {
            this.showError('Erro ao carregar usuários: ' + error.message);
        }
    }

    displayUsers(users) {
        const usersList = document.getElementById('usersList');
        
        if (users.length === 0) {
            usersList.innerHTML = '<p class="loading">Nenhum usuário cadastrado</p>';
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div class="user-card" data-id="${user.id}">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Idade: ${user.age || 'Não informada'}</p>
                    <small>Criado em: ${new Date(user.created_at).toLocaleDateString('pt-BR')}</small>
                </div>
                <div class="user-actions">
                    <button class="edit" onclick="userManager.editUser(${user.id})">Editar</button>
                    <button class="delete" onclick="userManager.deleteUser(${user.id})">Excluir</button>
                </div>
            </div>
        `).join('');
    }

    async createUser() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;

        if (!name || !email) {
            this.showError('Nome e email são obrigatórios');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    age: age ? parseInt(age) : null
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao criar usuário');
            }

            const newUser = await response.json();
            document.getElementById('userForm').reset();
            this.loadUsers();
            this.showSuccess('Usuário criado com sucesso!');
            
        } catch (error) {
            this.showError('Erro ao criar usuário: ' + error.message);
        }
    }

    async editUser(id) {
        try {
            this.currentEditId = id;
            const response = await fetch(`${API_URL}/${id}`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const user = await response.json();
            this.openModal(user);
        } catch (error) {
            this.showError('Erro ao carregar usuário: ' + error.message);
        }
    }

    openModal(user) {
        document.getElementById('editId').value = user.id;
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editAge').value = user.age || '';
        
        this.modal.style.display = 'block';
        
        // Foco no primeiro campo
        setTimeout(() => {
            document.getElementById('editName').focus();
        }, 100);
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.editForm.reset();
        this.currentEditId = null;
    }

    async submitEdit() {
        const id = this.currentEditId;
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const age = document.getElementById('editAge').value;

        if (!name || !email) {
            this.showError('Nome e email são obrigatórios');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    age: age ? parseInt(age) : null
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao atualizar usuário');
            }

            this.closeModal();
            this.loadUsers();
            this.showSuccess('Usuário atualizado com sucesso!');
            
        } catch (error) {
            this.showError('Erro ao atualizar usuário: ' + error.message);
        }
    }

    async deleteUser(id) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao excluir usuário');
            }

            this.loadUsers();
            this.showSuccess('Usuário excluído com sucesso!');
            
        } catch (error) {
            this.showError('Erro ao excluir usuário: ' + error.message);
        }
    }

    showLoading() {
        document.getElementById('usersList').innerHTML = '<p class="loading">Carregando usuários...</p>';
    }

    showError(message) {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = `
            <div class="error">
                <strong>Erro:</strong> ${message}
                <button onclick="userManager.loadUsers()" style="margin-left: 10px; padding: 5px 10px;">Tentar Novamente</button>
            </div>
        `;
        
        console.error('Erro:', message);
    }

    showSuccess(message) {
        // Poderia implementar um toast bonito aqui
        console.log('Sucesso:', message);
        
        // Feedback visual temporário
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1001;
            animation: fadeInOut 3s ease-in-out;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new UserManager();
});

// CSS animation para o toast de sucesso
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);
import './ListUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getUsuarios, deleteUsuario } from '../../shared/api.js';

const pageName = 'Usuário';

class ListUsuarioPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-usuario">
                        <ion-icon name="person-add" slot="start"></ion-icon>
                        Adicionar Novo Usuário
                    </ion-button>
                </div>
                <div class="list-usuario"></div>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        this.querySelector('#btn-add-usuario').addEventListener('click', () => {
            document.querySelector('ion-router').push('/usuario/create', 'forward');
        });

        await this.loadUsuarios();
    }

    async loadUsuarios() {
        const loading = await showLoading('Buscando usuários...');
        try {
            const usuarios = await getUsuarios();
            this.renderUsuarios(usuarios);
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }

    renderUsuarios(usuarios) {
        const container = this.querySelector(".list-usuario");

        if (usuarios.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;"> Nenhum usuario encontrado </p>'
            return;
        }
        
        const usuarioItems = usuarios.map(usuario => `
            <ion-item>
                <ion-label>
                <h2 style="display: flex; align-items: center; gap: 8px;">
                    <ion-icon
                    name="${usuario.perfil == 0 ? 'restaurant' : 'person'}"
                    color="${usuario.perfil == 0 ? 'primary' : 'secondary'}"
                    style="flex-shrink: 0;"
                    ></ion-icon>
                    <span>${usuario.nome}</span>
                </h2>
                <p>${usuario.usuario}</p>
                </ion-label>

                <ion-buttons slot="end">
                <ion-button fill="clear" class="btn-edit" data-id="${usuario.id}">
                    <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" class="btn-delete" data-id="${usuario.id}">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-item>
            `).join('');
    
        container.innerHTML = `<ion-list>${usuarioItems}</ion-list>`;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.querySelector('ion-router').push(`/usuario/edit?id=${id}`, 'forward');
            });
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const alert = document.createElement('ion-alert');
                alert.header = 'Confirmar Exclusão';
                alert.message = 'Tem certeza que deseja excluir este usuário?';
                alert.buttons = [
                    { text: 'Cancelar', role: 'cancel' },
                    {
                        text: 'Excluir',
                        handler: async () => {
                            const loading = await showLoading('Excluindo...');
                            try {
                                await deleteUsuario(id);
                                toast('Usuário excluído com sucesso!', 'success');
                                await this.loadUsuarios();
                            } catch (err) {
                                toast(err.message);
                            } finally {
                                await loading.dismiss();
                            }
                        }
                    }
                ];
                document.body.appendChild(alert);
                await alert.present();
            });
        });
    }
}

customElements.define('list-usuario-page', ListUsuarioPage);

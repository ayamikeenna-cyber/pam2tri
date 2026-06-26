import './ListMesaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getMesas, deleteMesa } from '../../shared/api.js';

const pageName = 'Mesa';

class ListMesaPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-mesa">
                        <ion-icon name="person-add" slot="start"></ion-icon>
                        Adicionar Nova Mesa
                    </ion-button>
                </div>
                <div class="list-mesa"></div>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        this.querySelector('#btn-add-mesa').addEventListener('click', () => {
            document.querySelector('ion-router').push('/mesa/create', 'forward');
        });

        await this.loadMesas();
    }

    async loadMesas() {
        const loading = await showLoading('Buscando mesas...');
        try {
            const mesas = await getMesas();
            this.renderMesas(mesas);
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }

    renderMesas(mesas) {
        const container = this.querySelector(".list-mesa");

        if (mesas.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;"> Nenhuma mesa encontrada </p>'
            return;
        }
        
        const mesaItems = mesas.map(mesa => `
            <ion-item>
                <ion-label>
                <h2 style="display: flex; align-items: center; gap: 8px;">
                    <ion-icon
                    name="${mesa.status ? 'checkmark-circle' : 'close-circle'}"
                    color="${mesa.status ? 'success' : 'danger'}"
                    style="flex-shrink: 0;"
                    ></ion-icon>
                    <span>Mesa ${mesa.id}</span>
                </h2>
                <p>Cadeiras: ${mesa.qtd_cadeiras}</p>
                </ion-label>

                <ion-buttons slot="end">
                <ion-button fill="clear" class="btn-edit" data-id="${mesa.id}">
                    <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" class="btn-delete" data-id="${mesa.id}">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-item>
            `).join('');
    
        container.innerHTML = `<ion-list>${mesaItems}</ion-list>`;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.querySelector('ion-router').push(`/mesa/edit?id=${id}`, 'forward');
            });
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const alert = document.createElement('ion-alert');
                alert.header = 'Confirmar Exclusão';
                alert.message = 'Tem certeza que deseja excluir esta mesa?';
                alert.buttons = [
                    { text: 'Cancelar', role: 'cancel' },
                    {
                        text: 'Excluir',
                        handler: async () => {
                            const loading = await showLoading('Excluindo...');
                            try {
                                await deleteMesa(id);
                                toast('Mesa excluída com sucesso!', 'success');
                                await this.loadMesas();
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

customElements.define('list-mesa-page', ListMesaPage);

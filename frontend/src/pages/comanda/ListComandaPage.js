import './ListComandaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getComandas, deleteComanda } from '../../shared/api.js';

const pageName = 'Comandas';

class ListComandaPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-comanda">
                        <ion-icon name="add-circle" slot="start"></ion-icon>
                        Abrir Nova Comanda
                    </ion-button>
                </div>
                <div class="list-comanda"></div>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        this.querySelector('#btn-add-comanda').addEventListener('click', () => {
            document.querySelector('ion-router').push('/comanda/create', 'forward');
        });

        await this.loadComandas();
    }

    async loadComandas() {
        const loading = await showLoading('Buscando comandas...');
        try {
            const comandas = await getComandas();
            this.renderComandas(comandas);
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }

    renderComandas(comandas) {
        const container = this.querySelector(".list-comanda");

        if (comandas.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;"> Nenhuma comanda encontrada </p>'
            return;
        }
        
        const comandaItems = comandas.map(comanda => `
            <ion-item>
                <ion-label>
                <h2 style="display: flex; align-items: center; gap: 8px;">
                    <ion-icon
                    name="receipt"
                    color="primary"
                    style="flex-shrink: 0;"
                    ></ion-icon>
                    <span>Comanda #${comanda.id}</span>
                </h2>
                <p>Status: ${comanda.status ? 'Aberta' : 'Fechada'}</p>
                </ion-label>

                <ion-buttons slot="end">
                <ion-button fill="clear" class="btn-edit" data-id="${comanda.id}">
                    <ion-icon slot="icon-only" name="eye-outline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" class="btn-delete" data-id="${comanda.id}">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-item>
            `).join('');
    
        container.innerHTML = `<ion-list>${comandaItems}</ion-list>`;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.querySelector('ion-router').push(`/comanda/edit?id=${id}`, 'forward');
            });
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const alert = document.createElement('ion-alert');
                alert.header = 'Confirmar Exclusão';
                alert.message = 'Tem certeza que deseja excluir esta comanda?';
                alert.buttons = [
                    { text: 'Cancelar', role: 'cancel' },
                    {
                        text: 'Excluir',
                        handler: async () => {
                            const loading = await showLoading('Excluindo...');
                            try {
                                await deleteComanda(id);
                                toast('Comanda excluída com sucesso!', 'success');
                                await this.loadComandas();
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

customElements.define('list-comanda-page', ListComandaPage);

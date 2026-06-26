import './ListProdutoPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getProdutos, deleteProduto } from '../../shared/api.js';

const pageName = 'Produto';

class ListProdutoPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-produto">
                        <ion-icon name="add-circle" slot="start"></ion-icon>
                        Adicionar Novo Produto
                    </ion-button>
                </div>
                <div class="list-produto"></div>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        this.querySelector('#btn-add-produto').addEventListener('click', () => {
            document.querySelector('ion-router').push('/produto/create', 'forward');
        });

        await this.loadProdutos();
    }

    async loadProdutos() {
        const loading = await showLoading('Buscando produtos...');
        try {
            const produtos = await getProdutos();
            this.renderProdutos(produtos);
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }

    renderProdutos(produtos) {
        const container = this.querySelector(".list-produto");

        if (produtos.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;"> Nenhum produto encontrado </p>'
            return;
        }

        const formatMoeda = (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        const produtoItems = produtos.map(produto => `
            <ion-item>
                <ion-label>
                    <h2 style="display: flex; align-items: center; gap: 8px;">
                        <ion-icon
                            name="${produto.status ? 'checkmark-circle' : 'close-circle'}"
                            color="${produto.status ? 'success' : 'danger'}"
                            style="flex-shrink: 0;"
                        ></ion-icon>
                        <span>${produto.dsc_produto}</span>
                    </h2>
                    <p>${formatMoeda(produto.valor_unit)}</p>
                </ion-label>

                <ion-buttons slot="end">
                    <ion-button fill="clear" class="btn-edit" data-id="${produto.id}">
                        <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="danger" class="btn-delete" data-id="${produto.id}">
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-item>`).join('');

        container.innerHTML = `<ion-list>${produtoItems}</ion-list>`;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.querySelector('ion-router').push(`/produto/edit?id=${id}`, 'forward');
            });
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const alert = document.createElement('ion-alert');
                alert.header = 'Confirmar Exclusão';
                alert.message = 'Tem certeza que deseja excluir este produto?';
                alert.buttons = [
                    { text: 'Cancelar', role: 'cancel' },
                    {
                        text: 'Excluir',
                        handler: async () => {
                            const loading = await showLoading('Excluindo...');
                            try {
                                await deleteProduto(id);
                                toast('Produto excluído com sucesso!', 'success');
                                await this.loadProdutos();
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

customElements.define('list-produto-page', ListProdutoPage);

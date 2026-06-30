import './EditProdutoPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getProdutoById, updateProduto } from '../../shared/api.js';

const pageName = 'Editar Produto';

class EditProdutoPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-produto">
                    <ion-list>
                        <ion-item>
                            <ion-input type="text" name="dsc_produto"
                            label="Descrição do Produto" label-placement="floating" required>
                            </ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input type="number" step="0.01" name="valor_unit"
                            label="Valor Unitário" label-placement="floating" required>
                            </ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label>Ativo</ion-label>
                            <ion-toggle slot="end" name="status"></ion-toggle>
                        </ion-item>
                    </ion-list>
                    <div class="ion-padding">
                        <ion-button expand="block" type="submit" class="ion-margin-top">
                        Salvar Produto
                        </ion-button>
                        <ion-button expand="block" color="danger" id="btn-cancelar">
                        Cancelar
                        </ion-button>
                    </div>
                </form>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);
        this.querySelector('#btn-cancelar').addEventListener('click', () => window.history.back());

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            await this.loadProduto(id);
        } else {
            toast('ID do produto não encontrado!');
            document.querySelector('ion-router').push('/produto/list', 'back');
        }

        this.querySelector('#form-produto').addEventListener('submit', async (e) => {
            e.preventDefault();

            const dsc_produto = this.querySelector('[name="dsc_produto"]').value;
            const valor_unit = this.querySelector('[name="valor_unit"]').value;
            const status = this.querySelector('[name="status"]').checked;

            if (!dsc_produto || !valor_unit) {
                toast('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            const dados = {
                id: parseInt(id),
                dsc_produto,
                valor_unit: parseFloat(valor_unit),
                status
            };

            const loading = await showLoading('Atualizando produto...');
            try {
                await updateProduto(id, dados);
                toast('Produto atualizado com sucesso!', 'success');
                document.querySelector('ion-router').push('/produto/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }

    async loadProduto(id) {
        const loading = await showLoading('Carregando dados...');
        try {
            const produto = await getProdutoById(id);
            const form = this.querySelector('#form-produto');

            form.querySelector('[name="dsc_produto"]').value = produto.dsc_produto;
            form.querySelector('[name="valor_unit"]').value = produto.valor_unit;
            form.querySelector('[name="status"]').checked = produto.status;
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }
}

customElements.define('edit-produto-page', EditProdutoPage);

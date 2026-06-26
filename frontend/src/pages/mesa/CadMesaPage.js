import './CadMesaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { createMesa } from '../../shared/api.js';

const pageName = 'Cadastrar Mesa';

class CadMesaPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-mesa">
                <ion-list>
                    <ion-item>
                    <ion-input type="number" name="qtd_cadeiras" label="Quantidade de Cadeiras" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-select name="status" label="Status" label-placement="floating" value="1">
                        <ion-select-option value="1">Disponível</ion-select-option>
                        <ion-select-option value="0">Ocupada</ion-select-option>
                    </ion-select>
                    </ion-item>
                </ion-list>

                <div class="ion-padding">
                    <ion-button expand="block" type="submit" class="ion-margin-top">
                    <ion-icon name="checkmark-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Salvar Mesa
                    </ion-button>
                    <ion-button expand="block" color="danger" id="btn-cancelar">
                    <ion-icon name="close-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Cancelar
                    </ion-button>
                </div>
                </form>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);
        this.querySelector('#btn-cancelar').addEventListener('click', () => window.history.back());

        this.querySelector('#form-mesa').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const qtd_cadeiras = this.querySelector('[name="qtd_cadeiras"]').value;
            const status = this.querySelector('[name="status"]').value;

            if (!qtd_cadeiras) {
                toast('Por favor, preencha a quantidade de cadeiras!');
                return;
            }

            const dados = {
                qtd_cadeiras: parseInt(qtd_cadeiras),
                status: parseInt(status) === 1
            };

            const loading = await showLoading('Salvando mesa...');
            try {
                await createMesa(dados);
                toast('Mesa cadastrada com sucesso!', 'success');
                document.querySelector('ion-router').push('/mesa/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }
}

customElements.define('cad-mesa-page', CadMesaPage);

import './CadMesaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/util.js';

const pageName = 'Cadastrar mesa';

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
                            <ion-input type="text" name="qtd_cadeiras"
                            label="Descrição do Mesa" label-placement="floating" required>
                            </ion-input>
                        </ion-item>
                       
                        
                       
                    </ion-list>
                    <div class="ion-padding">
                        <ion-button expand="block" type="submit" class="ion-margin-top">
                        Salvar Mesa
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
        this.querySelector('#btn-cancelar').addEventListener('click', () =>  windows.history.back());
    }
}

customElements.define('cad-mesa-page', CadMesaPage);
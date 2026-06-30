# Plano de Implementação de Criação de Usuário

## Objetivo
Implementar a funcionalidade de criação de usuário no frontend Ionic, conectando-se ao backend via API.

## Detalhes do Plano

0.  **Salvar Plano:** Criar um diretório `plans` na raiz do projeto (se não existir) e salvar este plano detalhado como um arquivo markdown (e.g., `plans/user-creation.md`). (Concluído)
1.  **Integrar Serviço de API:** Em `frontend/src/pages/usuario/CadUsuarioPage.js`, importar o serviço `api` de `../../shared/api.js`.
2.  **Implementar Handler de Envio do Formulário:** Adicionar um event listener ao `form-usuario` em `frontend/src/pages/usuario/CadUsuarioPage.js`. Este handler irá:
    *   Prevenir o comportamento padrão de envio do formulário.
    *   Coletar dados dos inputs `nome`, `usuario`, `senha`, e `perfil`.
    *   Realizar uma requisição `POST` para o endpoint `/usuario` usando `api.post('/usuario', userData)`.
3.  **Coletar Dados do Formulário:** (Integrado ao passo 2) Extrair valores dos inputs do formulário e formatá-los em um objeto de dados compatível com `CreateUsuarioDto` (backend).
4.  **Realizar Chamada à API:** (Integrado ao passo 2) Executar a chamada `api.post`.
5.  **Lidar com Respostas:**
    *   **Sucesso:** Exibir um toast de sucesso e navegar o usuário de volta para a lista de usuários ou página inicial usando `ion-router`.
    *   **Erro:** Exibir um toast de erro com uma mensagem útil.
6.  **Tratamento de Erros:** Envolver a chamada à API em um bloco `try-catch` para lidar com erros de rede ou do servidor de forma elegante.

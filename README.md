# AtlanticoFrontEnd

Projeto responsável pelo front-end do cadastro de usuários

## Considerações

* Foi utilizado angular 12 com material design e bootstrap. 
* Angular-jwt para gerenciamento de token vindo do back-end

## Pontos de melhoria

* Paginação da tabela de usuário vinda do back-end ainda não está totalmente correta. O datatable utilizado, pega toda a lista e faz a paginação em memória ao invez de buscar novamente no back-end. Precisa ser implementado
* Trocar autenticação e autorização para utilizado o KeycloakSSO. O próprio angular tem vários pacotes no npm para este tipo de funcionalidade
* Colocar filtro de pesquisa para listar os usuários
* Melhorar o mapeamente de perfil onde:
    * Usuário comum somente pode alterar o seu usuário
    * Somente usuário administrador pode alterar outros usuários
    * Somente usuário adminsitrador pode mexer no perfil dos outros usuários

## Rodando o projeto

* Executar "npm i --verbose" para baixar as dependências
* Executar "npm start"
* Executar o arquivo [docker](https://github.com/holocaster/atlantico-user-api/blob/master/src/main/docker/docker-compose.yml) para back da aplicação

    * Commando: "docker-compose -f <NOME_ARQUIVO> up -d
* Acessar a URL "http://localhost:4200"

    * Acessar com usuário "admin" e senha "123"

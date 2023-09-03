# Angular + Java - Gerenciamento de Clientes

Este é um projeto desenvolvido em Angular (Frontend) e Java (Backend) para o gerenciamento de clientes.

## Funcionalidades

- Consulta de clientes por nome e/ou status (ativos/inativos).
- Inclusão, alteração e exclusão de clientes.
- Cadastro de clientes com informações detalhadas.
- Validação de CPF/CNPJ duplicados.
- Gerenciamento de telefones associados a um cliente.

## Requisitos

- Angular CLI
- Java Development Kit (JDK)
- Spring Boot
- MySql (ou outro banco de dados compatível)
- Maven

## Configuração

### Backend

1. Importe o projeto Java no seu IDE.
2. Configure o banco de dados no arquivo `application.properties`:
   - Na linha 5, substitua `nome_da_sua_database` pelo nome da sua base de dados.
   - Na linha 11, coloque a senha do seu banco de dados.
3. Execute o build no arquivo `ApiApplication.java` para criar as tabelas e rodar a API.

### Frontend

1. Configure o backend como descrito acima.
2. Navegue até o diretório `frontend` do projeto.
3. Execute o seguinte comando para instalar as dependências:
$ npm install

# Para desenvolvimento:
$ npm start

# Para produção:
$ npm run build

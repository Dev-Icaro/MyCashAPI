# 💰 MyCash API

Bem-vindo à API do MyCash, uma API de gerenciamento financeiro desenvolvida em NodeJS usando padrões de arquitetura MVC (Model View Controller) e autenticação JWT. Este projeto utiliza o ORM sequelize o que permite se conectar com diferentes bancos de dados sem alterar sua sintaxe além
de facilitar a migração entre bancos.

# 🌟 Funcionalidades

    - CRUD completo de contas bancárias, despesas, receitas, categorias.
    - Serviço de envio de emails.
    - Controle de saldo bancário.
    - Controle de transações bancárias.
    - Autenticação e autorização usando JWT (JSON Web Tokens).
    - Validações de dados utilizando libs como Yup, express-validator e validator.js.
    - API RESTful seguindo as boas práticas de design.

# 🚀 Começando

Para começar a usar a API do MyCash, siga os seguintes passos:

    - Clone este repositório em sua máquina local.
    - Configure o arquivo de conexão do sequelize no caminho 'src/config/config.json'
    - Configure as variaveis de ambiente seguindo o exemplo no caminho 'src/config/.env.example
    - Execute o comando "npm install" para instalar todas as dependências necessárias.
    - Execute o comando "npx sequelize db:migrate" para efetuar todas as migrações para o banco de dados.
    - Execute o comando "npm run start" para iniciar a API.

A API estará disponível na porta configurada no .env ou http://localhost:8080.

# 📚 Rotas

A API do MyCash possui as seguintes rotas:

Autenticação

    POST /api/auth/signup: Cria um novo usuário.
    POST /api/auth/signin: Autentica um usuário existente.
    POST /api/auth/forgot-password: Envia um email com um reset-token para o email no body da requisição.
    POST /api/auth/reset-password: Altera o password do usuário caso as informações contidas no body da requisição sejam válidas.

Obs: A funcionalidade de envio de email deverá ser configurada antes
seguindo o exemplo no caminho /src/config/email-config.example.

Contas Bancárias.

    GET /api/account: Retorna todas as contas.
    GET /api/account/{id}: Pega conta pelo ID.
    POST /api/account: Cria nova conta.
    PUT /api/account/{id}: Atualiza conta pelo ID.
    DELETE /api/account/{id}: Deleta conta pelo ID.

Despesas

    GET /api/expenses: Retorna todas as despesas.
    GET /api/expenses/{id}: Retorna despesa pelo ID.
    GET /api/expenses/account/{accountId}: Retorna despesas relacionadas a uma conta bancária.
    GET /api/expenses/category/{categoryId}: Retorna despesas
    relacionadas a uma categoria.
    GET /api/expenses/account/{accountId}/category/{categoryId}: Retorna despesas relacionadas a uma conta e categoria específica.
    POST /api/expenses: Cria uma nova despesa.
    PUT /api/expenses/{id}: Atualiza despesa pelo ID.
    DELETE /api/expenses/{id}: Deleta uma despesa pelo ID.

Receitas

    GET /api/incomes: Retorna todas as receitas.
    GET /api/incomes/{id}: Retorna receita pelo ID.
    GET /api/incomes/account/{accountId}: Retorna receitas relacionadas a uma conta bancária.
    GET /api/incomes/category/{categoryId}: Retorna receitas
    relacionadas a uma categoria.
    GET /api/incomes/account/{accountId}/category/{categoryId}: Retorna receitas relacionadas a uma conta e categoria específica.
    POST /api/incomes: Cria uma nova receita.
    PUT /api/incomes/{id}: Atualiza receita pelo ID.
    DELETE /api/incomes/{id}: Deleta uma receita pelo ID.

Categorias

    GET /api/category: Retorna todas as categorias.
    POST /api/category: Cria uma nova categoria.
    GET /api/category/{id}: Retorna categoria pelo ID.
    PUT /api/category/{id}: Atualiza uma categoria pelo ID.
    DELETE /api/category/{id}: Deleta uma categoria pelo ID.

# 🛠️ Tecnologias utilizadas

    NodeJS
    SequelizeORM
    JWT (JSON Web Tokens)
    Dotenv
    Body-Parser
    Express-validator
    Yup
    Winston
    Eslint
    Prettier
    Bcrypt
    Nodemailer
    Nodemon

# 📖 Conclusão

A API MyCash é uma solução completa para gerenciamento financeiro,
oferecendo um vasto controle de despesas, receitas, saldos bancários,
transações e muito mais...

Nela foram utilizadas técnicas eficazes de segurança como autenticação com JWT, criptografia de dados sensíveis, endpoints para recuperação de senha e envio de emails.

Além disso, a API segue os princípios RESTful, facilitando a integração com outras aplicações e garantindo escalabilidade e manutenibilidade.

Espero que esse projeto possa acrescentar nos seus estudos e agregar conhecimento a sua jornada, sinta-se avontade para sugestões.

## English Version

# 💰 MyCash API

Welcome to the MyCash API, a financial management API developed in NodeJS using MVC (Model View Controller) architecture patterns and JWT authentication. This project utilizes the Sequelize ORM, which allows seamless connection to different databases without altering the syntax and facilitates migration between databases.

# 🌟 Features

    - Complete CRUD operations for bank accounts, expenses, incomes, and categories.
    - Email sending service.
    - Bank account balance control.
    - Bank transaction control.
    - Authentication and authorization using JSON Web Tokens (JWT).
    - Data validations using libraries like Yup, express-validator, and validator.js.
    - RESTful API following best design practices.

# 🚀 Getting Started

To get started with the MyCash API, follow these steps:

    - Clone this repository to your local machine.
    - Configure the sequelize connection file at 'src/config/config.json'.
    - Configure environment variables following the example at 'src/config/.env.example'.
    - Run the command "npm install" to install all the necessary dependencies.
    - Run the command "npx sequelize db:migrate" to perform all migrations to the database.
    - Run the command "npm run start" to start the API.

The API will be available at http://localhost:{PORT FROM .ENV FILE} or http://localhost:8080.

# 📚 Routes

The MyCash API has the following routes:

Authentication

    POST /api/auth/signup: Creates a new user.
    POST /api/auth/signin: Authenticates an existing user.
    POST /api/auth/forgot-password: Sends an email with a reset-token to the email provided in the request body.
    POST /api/auth/reset-password: Changes the user's password if the information in the request body is valid.
    Note: The email sending functionality should be configured beforehand following the example at /src/config/email-config.example.

Bank Accounts

    GET /api/account: Retrieves all bank accounts.
    GET /api/account/{id}: Retrieves a bank account by ID.
    POST /api/account: Creates a new bank account.
    PUT /api/account/{id}: Updates a bank account by ID.
    DELETE /api/account/{id}: Deletes a bank account by ID.

Expenses

    GET /api/expenses: Retrieves all expenses.
    GET /api/expenses/{id}: Retrieves an expense by ID.
    GET /api/expenses/account/{accountId}: Retrieves expenses related to a bank account.
    GET /api/expenses/category/{categoryId}: Retrieves expenses related to a category.
    GET /api/expenses/account/{accountId}/category/{categoryId}: Retrieves expenses related to a specific account and category.
    POST /api/expenses: Creates a new expense.
    PUT /api/expenses/{id}: Updates an expense by ID.
    DELETE /api/expenses/{id}: Deletes an expense by ID.

Incomes

    GET /api/incomes: Retrieves all incomes.
    GET /api/incomes/{id}: Retrieves an income by ID.
    GET /api/incomes/account/{accountId}: Retrieves incomes related to a bank account.
    GET /api/incomes/category/{categoryId}: Retrieves incomes related to a category.
    GET /api/incomes/account/{accountId}/category/{categoryId}: Retrieves incomes related to a specific account and category.
    POST /api/incomes: Creates a new income.
    PUT /api/incomes/{id}: Updates an income by ID.
    DELETE /api/incomes/{id}: Deletes an income by ID.

Categories

    GET /api/category: Retrieves all categories.
    POST /api/category: Creates a new category.
    GET /api/category/{id}: Retrieves a category by ID.
    PUT /api/category/{id}: Updates a category by ID.
    DELETE /api/category/{id}: Deletes a category by ID.

# 🛠️ Technologies Used

    NodeJS
    Sequelize ORM
    JSON Web Tokens (JWT)
    Dotenv
    Body-Parser
    Express-validator
    Yup
    Winston
    Eslint
    Prettier
    Bcrypt
    Nodemailer
    Nodemon

# 📖 Conclusion

The MyCash API is a comprehensive solution for financial management, offering extensive control over expenses, incomes, bank balances, transactions, and more.

It incorporates effective security techniques, such as JWT authentication, sensitive data encryption, endpoints for password recovery, and email sending.

Additionally, the API follows RESTful principles, facilitating integration with other applications and ensuring scalability and maintainability.

I hope this project can contribute to your studies and add knowledge to your journey. Feel free to provide suggestions and feedback.

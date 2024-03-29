<h1 align="center">Foodfy</h1>
<h1 align="center">
<img src=".github/chef.png" >
</h1>

**:hamburger: O QUE É ESTE PROJETO? / WHAT IS THIS PROJECT?**

<p align="justify">
Foodfy é uma aplicação MVC focada em apresentar, criar e gerenciar receitas e seus respectivos Chefs. Esta aplicação tem duas sessões, uma pública e outra administrativa. A primeira é uma apresentação das receitas e dos chefs e a segunda é onde as receitas, chefs e usuários são criados e gerenciados.
</p>
:us:
<p align="justify">
Foodfy is a MVC application focused on presenting, creating and managing recipes and it's respectively Chefs. This application has two sessions, public and administrative. The fist one is the recipes and chefs presentation and the second one is where the recipes, chefs and Users are created and managed.
</p>

<p>&nbsp;</p>

<h3><strong>SESSÃO PÚBLICA / PUBLIC SESSION</strong></h3>
<h1 align="center">
  <img src=".github/PublicSession.gif" >
</h1>

<h><strong>SESSÃO PRIVADA / PRIVATE SESSION</strong></h3>

<h1 align="center">
  <img src=".github/PrivateSession.gif" >
</h1>

<p>&nbsp;</p>

**:computer: TECNOLOGIAS / TECHNOLOGIES**

### Frontend:

- [JavaScript][javascript]
- [HTML][html]
- [CSS][css]
- [Nunjucks][njk]
- [Lottie][lottie]

### Backend:

- [Node.js][nodejs]
- [Express][express]
- [PG][pg]
- [PostgreSQL][postgresql]
- [Multer][multer]
- [Faker][faker]
- [BcryptJs][bcryptjs]
- [Nodemailer][nodemailer]

  <p>&nbsp;</p>

**:rocket: COMO ACESSAR / HOW TO ACCESS**

> COPIANDO DO GITHUB / COPYING FROM GITHUB:

```bash
$ git clone https://github.com/Henryquecimento/foodfy_project.git
```

> INSTALANDO DEPENDÊNCIAS NECESSÁRIAS / INSTALLING NECESSARY DEPENDENCIES:

```bash
npm install
```

**:gear: CONFIGURAÇÃO DO BANCO DE DADOS /DATABASE CONFIGURATION**

Primeiramente, você precisa ter instalado o [PostgreSQL] e o [Postbird][postbird] para lhe auxiliar no gerenciamento do BD e demais atividades.
</br>
First of all, you must've been installed [PostgreSQL] and [Postbird][postbird] to help you with DB management and other activities.

- <a href="https://www.postgresql.org/download/">POSTGRES</a>
- <a href="https://www.electronjs.org/apps/postbird">POSTBIRD</a>

Obs / Disclaimer: </br>
Minha versão do Postgres é a 13, atenção na versão do seu.
</br>
:us:
</br>
My Postgres version is 13, pay attention to yours.

#### WINDOWS OS

1. Abra o Powershell como administrador e navegue até a pasta de instalação
   </br>
   Open you Powershell as Administrator and browse to the installation folder:

```bash
$ cd "C:\Program Files\PostgreSQL\13\bin\"
```

2. Inicie o Postgres com o comando abaixo
   </br>
   Initiate Postgres with the command below:

```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" start
```

3. Após o uso, você pode desligá-lo com o comando
   </br>
   After the usage, you can shut it down with the command:

```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" stop
```

#### MAC OS

1. Iniciar o Postgres com
   </br>
   Initiate Postgres with:

```shell
pg_ctl -D /usr/local/var/postgres start
```

2. Desligar o Postgresql com
   </br>
   Shut down Postgres with:

```shell
pg_ctl -D /usr/local/var/postgres stop
```

#### LINUX OS

[Documentação Oficial para instalar e usar Postgres no Linux OS / Official Documentation to install and use Postgres on Linus OS][postgres-linux]

#### :birthday: USANDO O POSTBIRD / USING POSTBIRD

Primeiro, após ligar o Postgres, você pode acessar o Postbird e criar um banco de dados para o Foodfy. Você pode estar copiando as informações do BD no arquivo `foodfyDB`, na raiz do projeto, e utilizando a Query do Postbird para adicionar as tabelas.

:us:

First, after you turn on Postgres, you can access Postbird and create a database to Foodfy. You can copying the DB's information in the file `foodfyDB`, at the root of the project, and using the Postbird's Query to add the tables.

<p>&nbsp;</p>

### :cherries: NO PROJETO / IN THE PROJECT

Você deve modificar as configurações do BD para seu USER e PASSWORD. Acesse o arquivo `src/config/db.js`.
</br>
You must change the DB configurations to your USER and PASSWORD. Acess the file `src/config/db.js`.

```
module.exports = new Pool({
  user: "YOUR_USER",
  password: "YOUR_PASSWORD",
  host: "localhost",
  port: 5432,
  database: "foodfydb",
});
```

<p>&nbsp;</p>

**:computer: EXECUTANDO A APLICAÇÃO / EXECUTING THE APPLICATION**
</br>

1. Acesse o repositório do Foodfy / Access the Foodfy repository:

```bash
$ cd foodfy_project
```

2. Na aplicação, popule com dados falsos o BD (usando o Faker.js) / In the application, populate with fake date the DB (using Faker.js):

```bash
$ node seed.js
```

3. Inicie a aplicação (está rodando na porta 5000 - http://localhost:5000/) </br>
   Initiate the application (It's working on port 5000 - http://localhost:5000/) :

```bash
$ npm start
```

### :wrench: PARA USAR O EMAIL PARA RECUPERAR A SENHA (DURANTE O USO DA APLICAÇÃO)/ TO USE THE EMAIL TO RECOVER PASSWORD (DURING THE APPLICATION USAGE)

</br>
OBS/DISCLAIMER: </br>

Você precisará ter uma conta no [MAILTRAP][mailtrap]. Após criar sua conta e criar um inbox de email, selecione a opção `nodemailer` para integração com sua aplicação, será fornecido um objeto com sua auteticação com USER e PASSWORD.

:us:

You'll need to have an account in [MAILTRAP][mailtrap]. After the account and the email inbox have been created, select the option `nodemailer` to integrate with your application, it'll be provided an authentication with USER and PASSWORD.

Após conseguir sua autenticação, você pode copiar e colar no arquivo `src/lib/mailer.js`, como mostrado abaixo:

After you get your authentication, you can copy and paste in the file `src/lib/mailer.js`, as shown down below:

```
module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "YOUR_USER",
    pass: "YOUR_PASSWORD"
  }
});
```

## :lock: ACESSANDO A SESSÃO PRIVADA / ACCESSING PRIVATE SESSION

Após utilizar o `seed.js`, você pode pegar o e-mail de um usuário cadastado no banco de dados. A senha é **padrão** para todos os usuários, a **SENHA PADRÃO** é `101010` (você pode checar no arquivo `seed.js`).

:us:

After using `seed.js`, you can take the user email registred in the database. The password is **default** to all users, the **DEFAULT PASSWORD** is `101010` (you can check in the file `seed.js`).

## :key: LICENÇA / LICENCE:

Este Projeto está sob licença MIT, para saber mais acesse [LICENCE][licence].

This project is under MIT licence, to know more acess [LICENCE][licence].

<p>&nbsp;</p>

Feito com :yellow_heart: por Henryque Rodz :rocket:

[javascript]: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
[nodejs]: https://nodejs.org/en/
[express]: https://expressjs.com/pt-br/
[html]: https://developer.mozilla.org/pt-BR/docs/Web/HTML
[css]: https://developer.mozilla.org/pt-BR/docs/Web/CSS
[njk]: https://mozilla.github.io/nunjucks/
[postgresql]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
[postgres-linux]: https://www.postgresql.org/download/linux/
[pg]: https://github.com/brianc/node-postgres/tree/master/packages/pg
[postbird]: https://www.electronjs.org/apps/postbird
[multer]: https://github.com/expressjs/multer
[lottie]: https://github.com/airbnb/lottie-web
[nodemailer]: https://nodemailer.com/about/
[bcryptjs]: https://www.npmjs.com/package/bcrypt
[faker]: https://github.com/marak/Faker.js/
[mailtrap]: https://mailtrap.io/
[licence]: https://github.com/Henryquecimento/foodfy_project/blob/master/LICENSE

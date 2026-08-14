# ConectAção

O **ConectAção** é uma aplicação desenvolvida com o objetivo de aproximar pessoas interessadas em realizar doações de ONGs e instituições sociais.

A proposta é centralizar informações sobre organizações, campanhas e doações em uma única plataforma, facilitando a descoberta de ONGs, aumentando a transparência e tornando o processo de doação mais simples e acessível.

> Projeto desenvolvido para fins acadêmicos.

---

## Objetivo

O ConectAção busca oferecer uma plataforma onde usuários possam:

- Encontrar ONGs;
- Visualizar informações sobre organizações;
- Consultar campanhas;
- Realizar doações;
- Acompanhar seu histórico de doações;
- Favoritar ONGs;
- Visualizar informações de transparência e impacto.

O sistema ainda está em desenvolvimento e as funcionalidades serão implementadas progressivamente.

---

# Tecnologias

## Backend

- Java 26
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Hibernate
- Maven
- PostgreSQL

## Mobile

O aplicativo mobile será desenvolvido utilizando:

- React Native
- TypeScript
- Expo

A arquitetura planejada para o aplicativo mobile é **MVVM**.

---

# Arquitetura do Backend

O backend segue uma arquitetura em camadas:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / Hibernate
    ↓
PostgreSQL
```

Cada camada possui uma responsabilidade específica.

### Controller

Responsável por receber requisições HTTP e devolver respostas para o cliente.

Exemplo:

```text
GET /ongs
```

### Service

Responsável pelas regras de negócio da aplicação.

O Controller não deve acessar diretamente o banco de dados.

### Repository

Responsável pelo acesso aos dados.

Os repositories utilizam o **Spring Data JPA**, que fornece operações comuns de banco de dados como:

```java
findAll()
findById()
save()
deleteById()
existsById()
```

### Entity

Representa as entidades armazenadas no banco de dados.

Exemplo:

```text
Classe Java Ong
      ↕
     JPA
      ↕
Tabela PostgreSQL ongs
```

---

# Estrutura atual do Backend

A estrutura principal segue o padrão:

```text
src/main/java/com/connectacao/backend
│
├── BackendApplication.java
│
├── controller
│   └── OngController.java
│
├── entidade
│   └── Ong.java
│
├── repository
│   └── OngRepository.java
│
└── service
    └── OngService.java
```

Novas entidades seguirão a mesma organização conforme forem implementadas.

---

# Banco de Dados

O projeto utiliza **PostgreSQL**.

Nome utilizado atualmente para o banco:

```text
connectacao
```

O modelo de dados do sistema prevê as seguintes entidades principais:

```text
usuarios
ongs
usuarios_ongs
categorias
campanhas
doacoes
favoritos
```

---

# Relacionamentos principais

O modelo possui, entre outros, os seguintes relacionamentos:

```text
Categoria
    1
    │
    N
   ONG
```

Uma ONG pertence a uma categoria.

```text
ONG
 1
 │
 N
Campanha
```

Uma ONG pode possuir várias campanhas.

```text
Usuario
   N
   │
   N
  ONG
```

Usuários podem estar associados a várias ONGs e uma ONG pode possuir vários usuários.

Esse relacionamento é representado por:

```text
usuarios_ongs
```

Também existe um relacionamento de favoritos entre usuários e ONGs.

---

# API

Por padrão, o backend roda em:

```text
http://localhost:8080
```

---

# CRUD de ONGs

Atualmente o CRUD de ONGs está implementado.

## Listar todas as ONGs

```http
GET /ongs
```

Exemplo:

```text
http://localhost:8080/ongs
```

### Resposta

```json
[
  {
    "id": 1,
    "categoriaId": 1,
    "nome": "ONG Exemplo",
    "cnpj": "00.000.000/0001-00",
    "descricao": "Descrição da ONG",
    "email": "contato@ong.org",
    "telefone": "11999999999",
    "cep": "00000-000",
    "logradouro": "Rua Exemplo",
    "numero": "100",
    "complemento": null,
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "latitude": -23.550520,
    "longitude": -46.633308,
    "imagemUrl": null
  }
]
```

Caso não existam ONGs cadastradas:

```json
[]
```

---

## Buscar ONG por ID

```http
GET /ongs/{id}
```

Exemplo:

```text
GET http://localhost:8080/ongs/1
```

Caso a ONG exista:

```text
HTTP 200 OK
```

Caso não exista:

```text
HTTP 404 Not Found
```

---

## Cadastrar ONG

```http
POST /ongs
```

Exemplo de corpo da requisição:

```json
{
  "categoriaId": 1,
  "nome": "ONG Exemplo",
  "cnpj": "00.000.000/0001-00",
  "descricao": "Descrição da organização",
  "email": "contato@ong.org",
  "telefone": "11999999999",
  "cep": "00000-000",
  "logradouro": "Rua Exemplo",
  "numero": "100",
  "complemento": null,
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "imagemUrl": null
}
```

Em caso de sucesso:

```text
HTTP 201 Created
```

O ID da ONG é gerado pelo banco de dados.

---

## Atualizar ONG

```http
PUT /ongs/{id}
```

Exemplo:

```text
PUT http://localhost:8080/ongs/1
```

O corpo deve conter os dados atualizados da ONG.

Exemplo:

```json
{
  "categoriaId": 1,
  "nome": "ONG Exemplo Atualizada",
  "cnpj": "00.000.000/0001-00",
  "descricao": "Nova descrição",
  "email": "novoemail@ong.org",
  "telefone": "11999999999",
  "cep": "00000-000",
  "logradouro": "Rua Exemplo",
  "numero": "200",
  "complemento": null,
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "imagemUrl": null
}
```

Caso a ONG exista:

```text
HTTP 200 OK
```

Caso não exista:

```text
HTTP 404 Not Found
```

---

## Excluir ONG

```http
DELETE /ongs/{id}
```

Exemplo:

```text
DELETE http://localhost:8080/ongs/1
```

Caso a ONG exista e seja removida:

```text
HTTP 204 No Content
```

Caso não exista:

```text
HTTP 404 Not Found
```

---

# Fluxo de uma requisição

Exemplo para:

```http
GET /ongs
```

O fluxo interno é:

```text
Cliente
  ↓
GET /ongs
  ↓
OngController
  ↓
OngService
  ↓
OngRepository
  ↓
Spring Data JPA
  ↓
Hibernate
  ↓
PostgreSQL
  ↓
List<Ong>
  ↓
JSON
```

---

# Executando o projeto

## Pré-requisitos

Para executar o backend localmente é necessário possuir:

- Java 26
- PostgreSQL
- Git

O projeto utiliza o **Maven Wrapper**, portanto não é obrigatório possuir uma instalação global do Maven.

---

## Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd ConnectAcao
```

Depois entre na pasta onde está localizado o `pom.xml` do backend.

---

# Configuração do PostgreSQL

Crie um banco chamado:

```text
connectacao
```

As configurações de conexão do Spring Boot devem apontar para esse banco.

Exemplo conceitual:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/connectacao
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

O projeto utiliza:

```properties
spring.jpa.hibernate.ddl-auto=none
```

Isso significa que o Hibernate **não deve criar ou modificar automaticamente as tabelas do banco**.

O schema do PostgreSQL deve ser criado previamente conforme o modelo definido pelo projeto.

---

# Segurança das credenciais

Nunca envie para o GitHub:

- senha do PostgreSQL;
- arquivos `.env` contendo credenciais;
- tokens;
- chaves privadas;
- outras informações sensíveis.

Credenciais pessoais devem permanecer somente no ambiente local do desenvolvedor.

---

# Executando o backend

No Windows:

```bash
.\mvnw.cmd spring-boot:run
```

Ou execute diretamente:

```text
BackendApplication.java
```

pela IDE.

Quando a aplicação iniciar corretamente, deve aparecer algo semelhante a:

```text
Tomcat started on port 8080
Started BackendApplication
```

A API estará disponível em:

```text
http://localhost:8080
```

---

# Testando a API

É possível testar utilizando:

- Navegador para requisições GET;
- Postman;
- Insomnia;
- Bruno;
- IntelliJ HTTP Client;
- curl.

Exemplo:

```bash
curl http://localhost:8080/ongs
```

---

# Status do Projeto

### Backend

- [x] Configuração inicial do Spring Boot
- [x] Integração com PostgreSQL
- [x] JPA / Hibernate
- [x] Entidade ONG
- [x] Repository de ONG
- [x] Service de ONG
- [x] Controller de ONG
- [x] GET `/ongs`
- [x] GET `/ongs/{id}`
- [x] POST `/ongs`
- [x] PUT `/ongs/{id}`
- [x] DELETE `/ongs/{id}`
- [ ] Categoria
- [ ] Usuário
- [ ] Associação Usuário ↔ ONG
- [ ] Campanhas
- [ ] Favoritos
- [ ] Doações
- [ ] Autenticação
- [ ] Autorização

### Mobile

- [ ] Configuração inicial React Native / Expo
- [ ] Autenticação
- [ ] Tela inicial
- [ ] Listagem de ONGs
- [ ] Perfil da ONG
- [ ] Campanhas
- [ ] Doações
- [ ] Histórico
- [ ] Favoritos
- [ ] Dashboard
- [ ] Configurações

---

# Próximas etapas

Entre as próximas etapas planejadas estão:

1. Implementação da entidade `Categoria`;
2. Relacionamento entre ONG e Categoria;
3. Implementação de usuários;
4. Associação entre usuários e ONGs;
5. Implementação de campanhas;
6. Implementação de favoritos;
7. Implementação de doações;
8. Autenticação e autorização;
9. Integração com o aplicativo React Native;
10. Implementação das telas do aplicativo.

---

# Convenções do projeto

O backend deve preservar o fluxo:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Banco de Dados
```

Algumas regras importantes:

- Controllers não devem acessar repositories diretamente;
- Regras de negócio devem ficar na camada Service;
- Acesso ao banco deve ficar na camada Repository;
- Entidades representam os dados persistidos;
- Novas funcionalidades devem respeitar a arquitetura já existente;
- Credenciais não devem ser versionadas.

---

# Equipe

Projeto acadêmico desenvolvido pela equipe do **ConectAção**.

---

# Licença

Projeto desenvolvido para fins acadêmicos e educacionais.

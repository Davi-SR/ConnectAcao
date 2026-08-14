# ConectAcao Backend

## Pre-requisitos

- Docker
- Docker Compose

## Execucao

1. Copie `.env.example` para `.env`.
2. Ajuste as variaveis do `.env` se necessario.
3. Execute:

   ```bash
   docker compose up --build
   ```

O backend fica disponivel em `http://localhost:8080`.

Teste o endpoint:

```http
GET http://localhost:8080/ongs
```

Para parar os containers:

```bash
docker compose down
```

Para remover tambem o volume local do PostgreSQL e recriar o banco do zero:

```bash
docker compose down -v
```

O comando `docker compose down -v` apaga os dados locais do PostgreSQL Docker.

## Schema do banco

O repositorio ainda nao possui um schema SQL confiavel para a tabela `ongs`. Por isso, o PostgreSQL do Compose inicia sem tabelas de aplicacao e o CRUD so podera ser usado depois que o schema oficial for disponibilizado e importado. O Hibernate permanece com `spring.jpa.hibernate.ddl-auto=none` e nao cria nem altera tabelas automaticamente.
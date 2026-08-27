# ConectAção Mobile

Aplicativo mobile inicial do ConectAção com React Native, Expo, TypeScript e arquitetura MVVM.

## Arquitetura

- `src/model/`: entidades, repositories e serviço HTTP.
- `src/view/`: telas e componentes visuais.
- `src/viewmodel/`: estado, loading, erros e ações das telas.
- `src/navigation/`: stack de navegação e tipos dos parâmetros.

O fluxo adotado é `View -> ViewModel -> Repository -> Service HTTP -> API REST Spring Boot`.

## Configuração

Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL`:

```text
EXPO_PUBLIC_API_URL=http://SEU_HOST:8080
```

Essa variável é pública no bundle do Expo e não deve conter segredos. O arquivo `.env` é ignorado pelo Git.

`localhost` pode funcionar na Web/local. No Expo Go em dispositivo físico, use o IP da máquina que executa o backend, por exemplo `http://192.168.x.x:8080`, com ambos na mesma rede.

## Autenticação

O fluxo restaura a sessão validando o token salvo com `GET /me`; o logout remove apenas o token local, pois o backend é stateless e não possui endpoint de logout.

No Android/iOS, o JWT é armazenado com `expo-secure-store`. Na Web, o fallback usa `localStorage` apenas para desenvolvimento e não oferece a mesma proteção contra XSS; senhas nunca são persistidas.

## Desenvolvimento

Na pasta `mobile/`:

```bash
npm install
npm start
```

Comandos principais:

```bash
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

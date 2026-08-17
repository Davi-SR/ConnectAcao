# ConectAção Mobile

Aplicativo mobile inicial do ConectAção com React Native, Expo, TypeScript e arquitetura MVVM.

## Arquitetura

- `src/model/`: entidades, repositories e serviço HTTP. É a camada de dados e não renderiza interface.
- `src/view/`: telas e componentes visuais. A View chama ações dos ViewModels e não acessa a API diretamente.
- `src/viewmodel/`: estado, loading, erros e ações das telas, sem JSX.
- `src/navigation/`: stack de navegação e tipos dos parâmetros entre telas.

O fluxo adotado é `View -> ViewModel -> Repository -> Service HTTP -> API REST Spring Boot`.

## Configuração

Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL`:

```text
EXPO_PUBLIC_API_URL=http://SEU_HOST:8080
```

Essa variável é pública no bundle do Expo e não deve conter segredos. O arquivo `.env` é ignorado pelo Git.

`localhost` depende do ambiente: pode funcionar na Web/local; no Android Emulator, normalmente use o endereço próprio do emulador para a máquina host; no Expo Go em dispositivo físico, use o IP da máquina que executa o backend, com ambos na mesma rede. Não há descoberta automática de IP.

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

O aplicativo inicia na Home e permite navegar para detalhes de uma ONG e suas campanhas. Login, doações, favoritos, usuário e demais funcionalidades ainda não fazem parte desta etapa.

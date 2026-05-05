# Baseline Frontend

Interface web para o sistema de gerenciamento de tarefas desenvolvido como projeto de TCC. Construída com Next.js 16, React 19 e TypeScript, consome a [API REST do Baseline Backend](./README-BACKEND.md).

## Funcionalidades

- **Autenticação** — Telas de login e cadastro com validação via React Hook Form + Zod
- **Painel Kanban** — Visualização de tarefas em colunas por status (A Fazer / Em Andamento / Finalizado)
- **Estatísticas** — Cards com contagem de tarefas por status
- **Tarefas** — Criação, edição e exclusão com suporte a título, descrição, prioridade, data de vencimento e tags
- **Tags** — Categorização de tarefas com cores personalizadas
- **Ordenação automática** — Tarefas ordenadas por prioridade (alta → baixa) e data de vencimento
- **Autenticação via JWT** — Token armazenado no `localStorage` e enviado automaticamente em todas as requisições

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Ícones | Lucide React |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Linguagem | TypeScript 5 |

## Pré-requisitos

- Node.js 18+
- [Baseline Backend](./README-BACKEND.md) rodando em `http://localhost:3333`

## Instalação

```bash
git clone https://github.com/CaioSousaa/baseline-frontend.git
cd baseline-frontend
npm install
```

## Executando

```bash
# Desenvolvimento (com hot-reload)
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

```bash
# Build de produção
npm run build
npm start
```

## Estrutura do projeto

```
app/
├── components/
│   ├── Column.tsx       # Coluna do Kanban com lista de tarefas
│   ├── Navbar.tsx       # Barra de navegação
│   ├── StatCard.tsx     # Card de estatística
│   ├── TagModal.tsx     # Modal de criação/edição de tags
│   ├── TaskCard.tsx     # Card individual de tarefa
│   └── TaskModal.tsx    # Modal de criação/edição de tarefas
├── login/
│   └── page.tsx         # Tela de login
├── register/
│   └── page.tsx         # Tela de cadastro
├── types/
│   └── index.ts         # Tipos compartilhados (Task, Tag, etc.)
├── globals.css
├── layout.tsx
└── page.tsx             # Painel principal (Kanban)

lib/
└── axios.ts             # Instância do Axios com interceptor de autenticação
```

## Variáveis de ambiente

Por padrão, a API é consumida em `http://localhost:3333`. Para alterar, edite [lib/axios.ts](lib/axios.ts):

```ts
export const api = axios.create({
  baseURL: 'http://localhost:3333',
});
```

## Backend

Veja a documentação completa da API em [README-BACKEND.md](./README-BACKEND.md).

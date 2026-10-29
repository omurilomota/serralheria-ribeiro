# Serralheria Ribeiro

Orçamento de portões, calhas e estruturas metálicas.

> **Demonstração pública.** Telefones, WhatsApp, e-mail, endereço, CNPJ, redes sociais e dados de clientes são fictícios. Nenhum pedido, mensagem ou formulário é enviado a um canal real.

[**Ver demonstração**](https://serralheria-ribeiro-web-project.vercel.app) · Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL + Drizzle ORM · Tailwind CSS 4

## O que tem

- Site institucional com serviços e portfólio
- Calculadora de faixa de orçamento
- Funil de leads e acompanhamento
- Painel administrativo de orçamentos e projetos
- SEO local e dados estruturados

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL + Drizzle ORM
- Tailwind CSS 4

## Rodando localmente

```bash
npm ci
cp .env.example .env.local
# edite .env.local com a sua connection string
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Connection string PostgreSQL/Neon |
| `ADMIN_PASSWORD` | Sim | Senha do painel |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública usada em metadados |

## Banco de dados

PostgreSQL no Neon (banco `serralheria`). O schema fica em `src/db/schema.ts` e é aplicado com `npx drizzle-kit push`. Em produção, use uma connection string Neon com `sslmode=require`.

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Home institucional |
| `/orcamento` | Calculadora e solicitação |
| `/portfolio` | Portfólio de projetos |
| `/acompanhar` | Acompanhamento de orçamento |
| `/admin/login` | Login do painel |
| `/admin` | Dashboard |
| `/admin/leads` | Leads |
| `/admin/orcamentos` | Orçamentos |
| `/admin/portfolio` | Portfólio |

## Testes e qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploy

O deploy é feito na Vercel. Configure as variáveis acima no painel do projeto, conecte o repositório e use `npm run build`.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/app/(site)/` | Páginas públicas |
| `src/app/admin/` | Painel administrativo |
| `src/components/` | Site, calculadora e UI |
| `src/db/` | Schema Drizzle e seed |
| `src/lib/` | Configuração, estimativa e tipos |

## Licença

MIT — veja [LICENSE](LICENSE).

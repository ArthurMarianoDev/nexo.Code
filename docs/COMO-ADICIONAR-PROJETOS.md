# Como adicionar projetos autorais à Nexo.Code

O portfólio público fica em **/projetos/**. O conteúdo é controlado por um arquivo:
`src/data/projects.ts`. Você não precisa duplicar páginas nem editar componentes.

## 1. Adicionar um projeto
Abra `src/data/projects.ts`. Dentro do array `authorialProjects`, adicione outro objeto:

```ts
{
  slug: "nome-do-projeto",
  name: "NOME DO PROJETO",
  eyebrow: "02 / DIGITAL EXPERIENCE",
  category: "E-commerce premium",
  year: "2026",
  description: "Descrição verdadeira do que o projeto faz e demonstra.",
  services: ["Design de interface", "Desenvolvimento", "E-commerce"],
  stage: "development",
  liveUrl: null,
  cover: null,
  tone: "cyan",
},
```

- **stage**: `"development"` exibe "Em desenvolvimento"; `"published"` habilita "Explorar experiência" se `liveUrl` for preenchida.
- **liveUrl**: URL **pública**, HTTPS, do site já publicado; nunca use URL de repositório privado.
- **cover**: opcional, imagem local, por exemplo `"/projects/meu-projeto.webp"`. Coloque o arquivo em `public/projects/meu-projeto.webp`. Prefira WebP/AVIF com proporção aproximada de 1.16:1, 1600px de largura e arquivo otimizado. Se `null`, aparece um visual editorial abstrato.
- **tone**: `champagne`, `cyan`, `violet`, `lime` — define a cor do visual sem imagem.
- **services**: chips de competências demonstradas.
- O projeto é exibido automaticamente na ordem do array.

## 2. Publicar a AUREA RESIDENCES quando estiver pronta
No objeto `aurea-residences`, altere:
```ts
stage: "published",
liveUrl: "https://ENDERECO-PUBLICO-DA-AUREA.pages.dev/",
cover: "/projects/aurea-residences.webp",
```
Troque `ENDERECO-PUBLICO-DA-AUREA` pelo domínio **real** que a Cloudflare fornecer. Não publique URL fictícia. A imagem de capa é opcional; se não tiver, mantenha `cover: null`.

## 3. Deploy
Faça commit no GitHub na branch `main` da **Nexo.Code**. O Cloudflare Pages integrado ao GitHub gera e publica a atualização da Nexo.Code. O projeto AUREA tem repositório e deploy independentes: publicar na AUREA não atualiza automaticamente o catálogo da Nexo.Code; atualize `projects.ts` quando quiser divulgar.

## 4. Boas práticas
- Declare projetos conceituais como conceituais; não invente depoimentos, métricas, clientes ou resultados comerciais.
- Só marque como `published` após verificar que o link público funciona, inclusive no celular.
- Não coloque tokens de API, senhas ou dados privados no catálogo.
- Mantenha títulos, descrições e imagens representativos do trabalho.

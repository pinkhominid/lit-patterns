# Lit Patterns

[Live](https://pinkhominid.github.io/lit-patterns/)

Local
```sh
npm i
npx snowpack
npx http-server -o
```

Create your own patterns repo from scratch
```sh
mkdir my-lit-patterns
cd my-lit-patterns
git init
echo -e 'node_modules/\nweb_modules/' > .gitignore
npm init -y
npm i -D snowpack http-server
npm i lit-element
npx snowpack
touch index.html patterns.js
# edit index.html and patterns.js
npx http-server -o
```

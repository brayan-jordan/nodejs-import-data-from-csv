# nodejs-import-data-from-csv
Criei um servidor HTTP para realizar o CRUD de tarefas, o principal motivador para o desenvolvimento foi, 
aprender a trabalhar com o conceito de Stream's na hora de ler algum arquivo (por exemplo o dessa aplicação que é um .csv).

Ao utilizar o conceito de Stream's é possível ler o arquivo aos poucos, sem precisar do carregamento completo para iniciar o tratamento dos dados (que nesse caso é o cadastro de tarefas em massa).

Esse conceito pode ser fundamental ao trabalhar com migração de dados através de arquivos com larga dimensão, o que possibilita o carregamento e tratativa dos dados do arquivo aos poucos, podendo gerar menos sobrecarga no seu servidor.

## start application
Para iniciar a API de CRUD de tarefas basta seguir esses passos:
```bash
# instalar as dependências (necessário somente para trabalhar com o import do .csv)
$ npm install

# iniciar a aplicação (porta 59876)
$ npm start
```
Agora a parte mais legal, que contém um exemplo prático de carregamento de um arquivo .csv, para isso,
execute o arquivo que contém todo código para carregar o arquivo .csv que está na raiz do projeto e realizar requisições para salvar as informações no banco de dados, usando o seguinte comando:
```bash
$ node ./src/utils/parse-csv.js
```
## extra
Caso queira testar os endpoints da aplicação, deixei na raiz do projeto a Request Collection que criei utilizando o Insomnia, basta baixar e importar na sua máquina

Esse é o código responsável por ler o arquivo e fazer as requisições:
```javascript
import { parse } from "csv-parse";
import fs from "node:fs/promises";

(async () => {
  const parser = parse({
    delimiter: ",",
    columns: true,
  });

  const dataPath = new URL("../../data.csv", import.meta.url);

  const csvData = await fs.readFile(dataPath);

  parser.write(csvData);

  for await (const row of parser) {
    fetch("http://localhost:59876/tasks", {
      method: "POST",
      body: JSON.stringify(row),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
})();
```

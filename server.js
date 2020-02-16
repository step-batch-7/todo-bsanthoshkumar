const { app } = require('./lib/app');
const defaultPort = 3333;

const main = cmdLineArgs => {
  let [, , port] = [...cmdLineArgs];
  port = port || defaultPort;
  app.listen(port, () => console.log(`started listening on ${port}\n`));
};

main(process.argv);

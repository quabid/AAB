const chalk = require("chalk");
const MSG = chalk.keyword("orange")(
  `Server started on port ${process.env.PORT}\n`
);

module.exports = {
  ADDRESS: process.env.ADDRESS || "0.0.0.0",
  PORT: process.env.PORT || 5000,
  SERVER_STATUS: ((arg = `${MSG}`) => console.log(`\n\t${arg}`))(),
};

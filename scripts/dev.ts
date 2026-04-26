export {};

const bun = process.execPath;

const server = Bun.spawn([bun, "run", "dev:server"], {
  stdio: ["inherit", "inherit", "inherit"]
});

const client = Bun.spawn([bun, "run", "dev:client"], {
  stdio: ["inherit", "inherit", "inherit"]
});

const shutdown = () => {
  server.kill();
  client.kill();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await Promise.all([server.exited, client.exited]);

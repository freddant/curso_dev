import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const res = await database.query("SHOW max_connections;");
  const maxConnections = res.rows[0].max_connections;

  const resposta_versao = await database.query("SHOW server_version;");
  const pgVersion = resposta_versao.rows[0].server_version;

  const dbName = process.env.POSTGRES_DB;
  const resposta = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const usedConnections = resposta.rows[0].count;
  console.log(usedConnections);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        pg_version: pgVersion,
        max_connections: parseInt(maxConnections),
        used_connections: usedConnections,
      },
    },
  });
}

export default status;

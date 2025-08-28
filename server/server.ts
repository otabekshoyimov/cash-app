import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { implement } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createServer } from "node:http";
import {contract} from "../shared/contract.ts"
import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient()

const sample_transactions = [
  { id: "a1", date: "d1", description: "transaction 1", amount: 10 },
  { id: "a2", date: "d2", description: "transaction 2", amount: 20 },
];

const os_contract = implement(contract);

export const list_transaction = os_contract.transaction.list.handler(
  async () => {
    return sample_transactions;
  }
);

export const router = os_contract.router({
  transaction: {
    list: list_transaction,
  },
});

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: { headers: req.headers },
  });

  if (!result.matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
});

const PORT = 3000
server.listen(PORT, "localhost", () =>
  console.log(`Listening on http://localhost:${PORT}`)
);

const handler = new OpenAPIHandler(router, {
  plugins: [new CORSPlugin()],
});

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

const spec = await generator.generate(contract, {
  info: {
    title: "Transactions API",
    version: "1.0.0",
  },
});

console.log(JSON.stringify(spec, null, 2));

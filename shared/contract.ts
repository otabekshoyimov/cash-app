import { oc } from "@orpc/contract";
import type { InferContractRouterOutputs } from "@orpc/contract";
import { z } from "zod";

export const Transaction_Schema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  amount: z.number(),
});

export const list_transactions = oc
  .route({ method: "GET", path: "/transactions" })
  .output(z.array(Transaction_Schema));

export const contract = oc.router({
  transaction: oc.router({
    list: list_transactions,
  }),
});

export type list_outputs = InferContractRouterOutputs<typeof contract>;

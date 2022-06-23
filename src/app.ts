import fastify, { FastifyInstance } from "fastify";
import { dbPlugin } from "./events/plugin";
import fp from "fastify-plugin";

import eventRouter from "./events/index";

const app: FastifyInstance = fastify();

app.register(fp(dbPlugin), { url: process.env.DB_ADDRESS });
app.register(eventRouter, { prefix: "/events" });

export default app;

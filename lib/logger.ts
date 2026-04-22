import pino from "pino";

export const logger = pino({}, pino.destination("./logs/app.json"));

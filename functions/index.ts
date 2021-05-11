import * as functions from "firebase-functions";
import {Endpoint} from "rickety";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {createGameHandler, submitGameHandler} from "./handlers";
import {clearCache} from "./signing";

// Rickety tries to match path and method, which is not useful for functions.
const forceHandle = <RQ, RS>(endpoint: Endpoint<RQ, RS>, handler: any): any => {
    console.log("START forceHandle");
    return (req: any, res: any) => {
        console.log("START forceHandle callback");
        req.method = endpoint.method;
        req.originalUrl = endpoint.path;
        console.log("START forceHandle handler");
        return handler(req, res);
    };
};

export const createGame = functions.https.onRequest(
    forceHandle(CreateGame, createGameHandler),
);
export const submitGame = functions.https.onRequest(
    forceHandle(SubmitGame, submitGameHandler),
);
export const clearTokenCache = functions.pubsub
    .schedule("0 * * * *")
    .onRun(clearCache);

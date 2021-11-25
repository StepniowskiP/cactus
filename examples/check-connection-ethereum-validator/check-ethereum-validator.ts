import { Router, NextFunction, Request, Response } from "express";
import { getLogger } from "log4js";
import { TransactionManagement } from "../../packages/cactus-cmd-socketio-server/src/main/typescript/routing-interface/TransactionManagement";
import { RIFError } from "../../packages/cactus-cmd-socketio-server/src/main/typescript/routing-interface/RIFError";
import { ConfigUtil } from "../../packages/cactus-cmd-socketio-server/src/main/typescript/routing-interface/util/ConfigUtil";

const config: any = ConfigUtil.getConfig();
const moduleName = "check-ethereum-validator";
const logger = getLogger(`${moduleName}`);
logger.level = config.logLevel;

const router: Router = Router();
export const transactionManagement: TransactionManagement = new TransactionManagement();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("check-ethereum-validator()");
    const tradeID: string = transactionManagement.startBusinessLogic(req);
    const result = { tradeID: tradeID };
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof RIFError) {
      res.status(err.statusCode);
      res.send(err.message);
      return;
    }
    next(err);
  }
});

export default router;

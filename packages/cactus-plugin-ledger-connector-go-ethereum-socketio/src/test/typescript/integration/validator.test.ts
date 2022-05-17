import {
    LoggerProvider,
    LogLevelDesc,
    Logger
} from "@hyperledger/cactus-common";

import {
    pruneDockerAllIfGithubAction,
    OpenEthereumTestLedger,
} from "@hyperledger/cactus-test-tooling";

import "jest-extended";

import {ServerPlugin} from "../../../main/typescript/connector/ServerPlugin"

const logLevel: LogLevelDesc = "DEBUG";

const log: Logger = LoggerProvider.getOrCreate({
  label: "go-ethereum-validator.test",
  level: logLevel,
});

let TEST_ACCOUNT: any;
let TEST_ACCOUNT_2: any;

const json2str = (jsonObj: any) => {
  try {
    return JSON.stringify(jsonObj);
  } catch (error) {
    return null;
  }
};

describe("Go Ethereum validator Test Suite", () =>{

    beforeAll(async () => {

      const pruning = await pruneDockerAllIfGithubAction({ logLevel });
      expect(pruning).toBeTruthy();

    });

    let server: ServerPlugin;

    test("Setup Environment", async() => {

      log.debug(`Create instance of eth ledger`);
      log.debug(`Start ledger`);
      const ethLedger = new OpenEthereumTestLedger({ logLevel });
      await ethLedger.start();

      const asset = 2000000;
      TEST_ACCOUNT = await ethLedger.createEthTestAccount(asset);

      log.debug(`Test account: ${TEST_ACCOUNT}`);

      expect(TEST_ACCOUNT).not.toBe(undefined);
      expect(TEST_ACCOUNT.address).not.toBe(undefined || "");
      expect(TEST_ACCOUNT.privateKey).not.toBe(undefined || "");

      log.debug(`Created test account: ${json2str(TEST_ACCOUNT)} with asset amount: ${asset}`);

      TEST_ACCOUNT_2 = await ethLedger.createEthTestAccount(asset);

      log.debug(`Test account 2: ${TEST_ACCOUNT_2}`);

      expect(TEST_ACCOUNT_2).not.toBe(undefined);
      expect(TEST_ACCOUNT_2.address).not.toBe(undefined || "");
      expect(TEST_ACCOUNT_2.privateKey).not.toBe(undefined || "");

      log.debug(`Created test account 2: ${json2str(TEST_ACCOUNT_2)} with asset amount: ${asset}`);

      const ethPort = await ethLedger.getHostPortHttp();
      const ledgerUrl = await ethLedger.getRpcApiHttpHost("", ethPort);
      log.debug(`Ledger URL: ${ledgerUrl}`);
      
      log.debug(`Create Verifier instance`);

      server = new ServerPlugin();
      expect(server).not.toBe(undefined);
      
      log.debug("Setup Environment test finished.");

    });

    // test("Get Numeric Balance", async() => {

    //   log.debug(`Creating requestData`);
    //   const reqID = "reqID_001_Balance";

    //   const requestData = {
    //     args: {
    //       args: [TEST_ACCOUNT.address]
    //     },
    //     reqID: reqID
    //   };

    //   log.debug(`Request data: ${json2str(requestData)}`);

    //   log.debug("Sending request");
    //   const response: any = await server.getNumericBalance(requestData);

    //   log.debug(`Received response: ${json2str(response)}`);

    //   log.debug("Validating received response");
    //   expect(response).not.toBe(undefined);
    //   expect(response.resObj.status).toBe(200);
    //   expect(response.resObj.amount).toBe(2000000);
    //   expect(response.id).toBe(reqID);

    //   log.debug("Get Numeric Balance test finished.");

    // });

    test("Transfer numeric asset", async() => {

      log.debug(`Creating requestData`);
      const reqID = "reqID_002_Transfer_numeric_data";
      const transferAmount = 15000;

      const requestData = {
        args: {
          args: [
            {
              "fromAddress": TEST_ACCOUNT.address,
              "toAddress": TEST_ACCOUNT_2.address,
              "amount": transferAmount
            }
          ]
        },
        reqID: reqID
      };

      log.debug(`Request data: ${json2str(requestData)}`);

      log.debug("Sending request");
      const response: any = await server.transferNumericAsset(requestData);

      log.debug(`Received response: ${json2str(response)}`);

      log.debug("Validating received response");
    });

    // test("Send Raw Transation", () => {

    // });

    // test("Transfer numeric asset", () => {

    // });

    // afterAll(async () => {

    //   // await ethLedger.stop();
    //   // await ethLedger.destroy();
    
    //   const pruning = await pruneDockerAllIfGithubAction({ logLevel });
    //   expect(pruning).toBeTruthy();
    // });
});
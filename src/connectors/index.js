import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 42, 56, 97, 1001, 9731, 9732, 43114, 43113, 59140, 1285, 80001,
    137, 5656,
  ],
});

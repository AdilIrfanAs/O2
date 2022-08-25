import Web3 from "web3";
import contractAbi from "./OC2abi/oc2.abi.json";
import {
  TokenTransfer,
  ExchangeTokentansfer,
  SendSolToken,
  DepositBSCOutlandOdyssey,
} from "../api/Web3.api";
import axios from "axios";
import { toast } from "react-toastify";
interface payload {
  type: string;
  amount: number;
  address: string;
  txHash: string;
  network: string;
  userId: string;
}
interface Exchange {
  txHash: string;
  amount: number;
  address: string;
  to: string;
  fromCurrency: string; //BSC, SOL
  toCurrency: string; //BSC, SOL
  userId: string;
  status: Boolean;
}
interface solToken {
  to: string;
  amount: number;
  exchangeId: string;
}
declare var window: any;
const ContractAddress = process.env.REACT_APP_BSC_O2_CONTRACT_ADDRESS;
export const getWeb3 = async () => {
  if (window.ethereum) {
    const web3: any = new Web3(Web3.givenProvider || "ws://localhost:8545");
    return web3;
  } else {
    return false;
  }
};
export const getBscBalance = async (address: string) => {
  const web3: any = await getWeb3();
  try {
    let result: any = await web3.eth.getBalance(address);
    return result;
  } catch (err) {
    return false;
  }
};
export const getbalance = async (address: string) => {
  const web3: any = await getWeb3();
  try {
    let contract: any = new web3.eth.Contract(contractAbi, ContractAddress);
    const result = await contract.methods.balanceOf(address).call();
    return result;
  } catch (err) {
    return false;
  }
};
export const Approve = async (amount: number) => {
  const web3: any = await getWeb3();
  try {
    let contract: any = new web3.eth.Contract(contractAbi, ContractAddress);
    const accounts: string = await web3.eth.getAccounts();
    let amountVal: number = web3.utils.toWei(amount.toString(), "ether");
    let hash: any = await contract.methods
      .approve(ContractAddress, amountVal)
      .send({ from: accounts[0] });
    toast.success("Your transaction is being approved. Please wait ");

    const transaction: any = hash;
    if (transaction.transactionHash) {
      var receipt: any = await web3.eth.getTransactionReceipt(
        transaction.transactionHash
      );
    }
    return receipt.status;
  } catch (e) {
    return false;
  }
};

export const Transfer = async (amount: number, userId: string, to: string) => {
  const web3: any = await getWeb3();
  try {
    let contract: any = new web3.eth.Contract(contractAbi, ContractAddress);
    const accounts: string[] = await web3.eth.getAccounts();
    let amountVal: number = web3.utils.toWei(amount.toString(), "ether");
    let hash: any = await contract.methods
      .transfer(ContractAddress, amountVal)
      .send({ from: accounts[0] });
    const txHash: string = hash.transactionHash;
    const address: string = accounts[0];
    const payload: payload = {
      type: "1",
      amount,
      address,
      txHash,
      network: "1",
      userId,
    };
    //Api
    toast.success("Your transaction is being processed. Please wait ");
    const ethToken = await TokenTransfer(payload);

    if (ethToken) {
      const payload: Exchange = {
        txHash,
        amount,
        address,
        to,
        fromCurrency: "BSC", //BSC, SOL
        toCurrency: "SOL", //BSC, SOL
        userId,
        status: false,
      };
      const exchange = await ExchangeTokentansfer(payload);
      let exchangeId = exchange.data.data._id;
      if (exchange) {
        toast.success("Tokens are trasferring to target account.");

        const payload: solToken = {
          to,
          amount,
          exchangeId,
        };
        const result = await SendSolToken(payload);
        toast.success("Tokens are transferred successfully");
      }
    }
    var receipt = await web3.eth.getTransactionReceipt(txHash);
    return receipt;
  } catch (e) {
    return false;
  }
};
export const DepositOutlandOdyssey = async (
  amount: number,
  userId: string,
  to: string
) => {
  const web3: any = await getWeb3();
  try {
    let contract: any = new web3.eth.Contract(contractAbi, ContractAddress);
    const accounts: string[] = await web3.eth.getAccounts();
    let amountVal: number = web3.utils.toWei(amount.toString(), "ether");
    let hash: any = await contract.methods
      .transfer(ContractAddress, amountVal)
      .send({ from: accounts[0] });
    const txHash: string = hash.transactionHash;
    const address: string = accounts[0];
    const payload: payload = {
      type: "1",
      amount,
      address,
      txHash,
      network: "1",
      userId,
    };
    //Api
    toast.success("Your transaction is being processed. Please wait ");
    const ethToken = await DepositBSCOutlandOdyssey(payload);
    var receipt = await web3.eth.getTransactionReceipt(txHash);
    return receipt;
  } catch (e) {
    return false;
  }
};

export const getBSCBalanceandToken = async (address: any) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.get(
      `${url + `transactions/bsc-balance/${address}`}`
    );
    const { data } = response;
    return data.data;
  } catch (e) {}
};

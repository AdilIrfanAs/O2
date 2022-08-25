import {
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { toast } from "react-toastify";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Solflare from "@solflare-wallet/sdk";
import {
  TokenTransfer,
  ExchangeTokentansfer,
  SendBSCToken,
} from "../api/Web3.api";

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
export const sendTokenfromSolFlare = async (
  publicKey: string,
  userId: string,
  amount: number,
  to: string
) => {
  let connection = new Connection(clusterApiUrl("devnet"));
  let wallet = new Solflare();
  await wallet.connect();
  try {
    const toPublicKey = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    const fromPublicKey = new PublicKey(publicKey);
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromPublicKey
    );
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      toPublicKey
    );
    const amountVal = amount * 1000000000;
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromPublicKey,
        [],
        amountVal
      )
    );
    transaction.feePayer = fromPublicKey;
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    let signed = await wallet.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());

    const address = fromPublicKey.toBase58();
    //Api Payload
    const txHash = txid;
    const payload: payload = {
      type: "1",
      amount,
      address,
      txHash,
      network: "2",
      userId,
    };
    //
    toast.success("Your transaction is being processed. Please wait ");
    await sleep(10000);
    const ethToken = await TokenTransfer(payload);

    if (ethToken) {
      const payload: Exchange = {
        txHash,
        amount,
        address,
        to,
        fromCurrency: "SOL", //BSC, SOL
        toCurrency: "BSC", //BSC, SOL
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
        const result = await SendBSCToken(payload);
        toast.success("Tokens are transferred successfully");
      }
    }
    return txid;
  } catch (error) {
    return false;
  }
};

export const getSolflareTokenBalance = async (publicKey: string) => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    const frompublicKey = new PublicKey(publicKey);
    // Link connection with Token program
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    // create or get Associat Account info
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      frompublicKey
    );
    const balance = await connection.getTokenAccountBalance(
      fromTokenAccount.address
    );
    return balance.value.amount;
  } catch (err) {
    return false;
  }
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

//============================ Token Management=============================================//

export const DepositOutlandOdysseySolflare = async (
  publicKey: string,
  userId: string,
  amount: number
) => {
  let connection = new Connection(clusterApiUrl("devnet"));
  let wallet = new Solflare();
  await wallet.connect();
  try {
    const toPublicKey = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    const fromPublicKey = new PublicKey(publicKey);
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromPublicKey
    );
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      toPublicKey
    );
    const amountVal = amount * 1000000000;
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromPublicKey,
        [],
        amountVal
      )
    );
    transaction.feePayer = fromPublicKey;
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    let signed = await wallet.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());

    return txid;
  } catch (error) {
    return false;
  }
};

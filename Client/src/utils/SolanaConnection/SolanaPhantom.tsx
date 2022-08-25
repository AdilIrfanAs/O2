import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { programs } from '@metaplex/js';
import bs58 from "bs58";
import { toast } from "react-toastify";
import { ExchangeTokentansfer, SendBSCToken, TokenTransfer } from "../api/Web3.api";
import { findMetadataPda } from '@metaplex-foundation/js';

export class Creator {
  address;
  verified;
  share;
  constructor(args) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

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
export const getSPlTokenBalance = (wallet: string) => {
  try {
    var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const key = new PublicKey(wallet);
    const resp = connection.getBalance(key);
    return resp;
  } catch (err) {
    // error message
    toast.error(err);
  }
};
export const sendSPLToken = async (
  publicKey: string,
  userId: string,
  amount: number,
  to: string
) => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const toPublicKey = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    const fromPublicKey = new PublicKey(publicKey);
    // Link connection with Token program
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    // create or get Associat Account info
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromPublicKey
    );
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      toPublicKey
    );
    // convert the amount according to token
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
    //add feePayer in the Transaction
    transaction.feePayer = fromPublicKey;
    //add Blockhash in the Transaction
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    //SendTransaction
    const signature = await window.solana.signAndSendTransaction(transaction);
    const address = fromPublicKey.toBase58();
    //Api Payload
    const txHash = signature.signature;
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
        await SendBSCToken(payload);
        toast.success("Tokens are transferred successfully");
      }
    }
    return signature;
  } catch (error) {
    toast.error(error);
  }
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const getSolanaTokenBalance = async (publicKey: string) => {

  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const fromPublicKey = new PublicKey(publicKey);
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    const balance: any = await connection.getParsedTokenAccountsByOwner(
      fromPublicKey, { mint: mint }
    );
    return balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
  } catch (err) {
    return false;
  }
};

//============================ Token Management=============================================//
export const DepositOutlandOdysseySolana = async (
  publicKey: string,
  userId: string,
  amount: number
) => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const toPublicKey = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    const fromPublicKey = new PublicKey(publicKey);
    // Link connection with Token program
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    // create or get Associat Account info
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromPublicKey
    );
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      toPublicKey
    );
    // convert the amount according to token
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
    //add feePayer in the Transaction
    transaction.feePayer = fromPublicKey;
    //add Blockhash in the Transaction
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    //SendTransaction
    await window.solana.connect();
    const signature = await window.solana.signAndSendTransaction(transaction);
    //
    toast.success("Your transaction is being processed. Please wait ");
    await sleep(10000);
    return signature;
  } catch (error) {
    toast.error(error);
  }
};

export const getSolanaO2TokenBalnce = async () => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const toPublicKey = new PublicKey(
      process.env.REACT_APP_SOL_DEPLOYER_ADDRESS
    );
    // mint owner PublicKey
    const mint = new PublicKey(process.env.REACT_APP_SOL_O2_PUBLIC_KEY);
    // Token owner PrivateKey
    const payer = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_SOL_O2_PRIVATE_KEY)
    );
    // Link connection with Token program
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    // create or get Associat Account info
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      toPublicKey
    );
    const balance: any = await connection.getTokenAccountBalance(
      toTokenAccount.address
    );
    return balance.value.amount;
  } catch (err) {
    return false;
  }
};

export const getSolanaShillToken = async () => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const toPublicKey = new PublicKey(
      process.env.REACT_APP_SOL_DEPLOYER_ADDRESS
    );
    // mint owner PublicKey
    const mint = new PublicKey(
      process.env.REACT_APP_SOL_SHILL_CONTRACT_ADDRESS
    );
    const balance: any = await connection.getParsedTokenAccountsByOwner(
      toPublicKey, { mint: mint }
    );
    return balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
  } catch (err) {
    return false;
  }
};

export const getSolanaShillTokenBalance = async (publicKey: string) => {
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const fromPublicKey = new PublicKey(publicKey);
    // mint owner PublicKey
    const mint: any = new PublicKey(
      process.env.REACT_APP_SOL_SHILL_CONTRACT_ADDRESS
    );
    const balance: any = await connection.getParsedTokenAccountsByOwner(
      fromPublicKey, { mint: mint }
    );
    return balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
  } catch (err) {
    console.log(err)
    return false;
  }
};

//============================ Update Nft Metadata =============================================//

export const updateNftMetadata = async (form) => {
  let { metadata: { UpdateMetadata, MetadataDataData, Creator } } = programs;
  // Wallet  connection
  var connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    // Update Authority Onwer Address
    const wallet = Keypair.fromSecretKey(
      bs58.decode(process.env.REACT_APP_ONWER_PRIVATE_KEY)
    )
    // Nft Mint Key 
    const mint = new PublicKey(form.tokenMint)
    // Find the Meta data of Minted Nft
    const metadataPDA = await findMetadataPda(mint);
    //  Nft Creator
    let selfCreator = new Creator({
      address: wallet.publicKey.toBase58(),
      verified: false,
      share: 100,
    });
    // Update Metadata
    let newMetadataData = new MetadataDataData({
      name: form.name,
      symbol: form.symbol,
      sellerFeeBasisPoints: 500,
      uri: form.metadata,
      creators: [selfCreator]
    })
    // Update Metadata
    const updateTx = new UpdateMetadata(
      { feePayer: wallet.publicKey },
      {
        metadata: metadataPDA,
        updateAuthority: wallet.publicKey,
        metadataData: newMetadataData,
        newUpdateAuthority: wallet.publicKey,
        primarySaleHappened: true,
      },
    );
    // send Transaction
    let signature = await connection.sendTransaction(updateTx, [wallet]);
    return signature
  }
  catch (e) {
    console.log(e)
  }
}
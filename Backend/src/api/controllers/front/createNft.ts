import { Wallet } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import bs58 from 'bs58';
import WalletModel from '../../models/wallets.model';
import Activity from "../../models/activity.model"
import {
    TOKEN_PROGRAM_ID, MINT_SIZE, createInitializeMintInstruction,
    getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction,
} from "@solana/spl-token";
import {
    createCreateMasterEditionV3Instruction, createCreateMetadataAccountV2Instruction, DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
var solanaWeb3 = require('@solana/web3.js');


export const mintNft = async (req, res, next) => {

    const payload = req.body
    let user: any = await WalletModel.findOne({ '_id': payload.walletId }).exec();
    const PRIVATE_KEY = user.sol.private_key



    try {
        const updateAuthorityPrivateKey = process.env.SOL_TRANSFER_PRIVATE_KEY

        const updateAuthority = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                updateAuthorityPrivateKey
            )
        );
        const keypair = anchor.web3.Keypair.fromSecretKey(
            bs58.decode(PRIVATE_KEY)
        );

        const wallet = new Wallet(keypair);
        const updateAuthorityWallet = new Wallet(updateAuthority)

        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
            'confirmed',
        );
        //Add the blockhash and feePayer 
        const { blockhash } = await connection.getLatestBlockhash("finalized");

        const transaction = new anchor.web3.Transaction({
            recentBlockhash: blockhash,
            feePayer: wallet.publicKey,
        });

        const mintKey = anchor.web3.Keypair.generate();
        const lamports = await connection.getMinimumBalanceForRentExemption(
            MINT_SIZE
        );

        transaction.add(
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: wallet.publicKey, // The account that will transfer lamports to the created account
                newAccountPubkey: mintKey.publicKey, // Public key of the created account
                space: MINT_SIZE, // Amount of space in bytes to allocate to the created account
                lamports, // Amount of lamports to transfer to the created account
                programId: TOKEN_PROGRAM_ID, // Public key of the program to assign as the owner of the created account
            }),
            createInitializeMintInstruction(
                mintKey.publicKey, // mint pubkey
                0, // decimals
                wallet.publicKey, // mint authority
                wallet.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
            )
        );
        // ata stands for Associated Token Account
        let wallet_ata = await getAssociatedTokenAddress(
            mintKey.publicKey, // mint
            wallet.publicKey, // owner
        );


        transaction.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                wallet_ata,
                wallet.publicKey,
                mintKey.publicKey
            ),
            createMintToInstruction(
                mintKey.publicKey, // mint
                wallet_ata,
                wallet.publicKey,

                1
            )
        );

        const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );

        const [metadatakey] = await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKey.publicKey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        const [masterKey] = await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKey.publicKey.toBuffer(),
                Buffer.from("edition"),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        const data: DataV2 = {
            name: payload.name,
            symbol: payload.symbol,
            uri: payload.uri,
            sellerFeeBasisPoints: 500,
            creators: [
                {
                    address: updateAuthority.publicKey,
                    verified: true,
                    share: 100,
                }
            ],
            collection: {
                key: updateAuthority.publicKey,
                verified: false
            },
            uses: null,
        };

        const args = {
            data,
            isMutable: true,
        };

        const createMetadataV2 = createCreateMetadataAccountV2Instruction(
            {
                metadata: metadatakey,
                mint: mintKey.publicKey,
                mintAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                updateAuthority: updateAuthorityWallet.publicKey,
            },
            {
                createMetadataAccountArgsV2: args,
            }
        );

        transaction.add(createMetadataV2);

        const createMasterEditionV3 = createCreateMasterEditionV3Instruction(
            {
                edition: masterKey,
                mint: mintKey.publicKey,
                updateAuthority: updateAuthorityWallet.publicKey,
                mintAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                metadata: metadatakey,
            },
            {
                createMasterEditionArgs: {
                    maxSupply: new anchor.BN(0),
                },
            }
        );
        transaction.add(createMasterEditionV3);

        transaction.partialSign(mintKey);
        transaction.partialSign(updateAuthority)
        transaction.partialSign(keypair)
        let signed_transaction = await updateAuthorityWallet.signTransaction(transaction);
        const serialized_transaction = signed_transaction.serialize();
        const signature = await connection.sendRawTransaction(serialized_transaction);
        await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction Signature", signature);
        if (signature) {

            const activityPayload = new Activity({
                title: "Mint Nft",
                item: mintKey.publicKey,
                from: wallet.publicKey,
                to: keypair.publicKey.toBase58(),
            })

            await activityPayload.save()
            let mintresponse = { signature: signature, mintAddress: mintKey.publicKey.toBase58() }
            return res.json({ status: true, message: 'Nft mint successfully', mintresponse })
        }
    } catch (error) {
        console.log("Error: " + error);
        return res.json({ status: false, message: error, })
    }
}
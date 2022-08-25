import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';

const Data = () => {
    const { publicKey } = useWallet()

    React.useEffect(() => {
        if(publicKey){
        const walletAddress = publicKey.toBase58()
        localStorage.setItem("publickey", walletAddress)
        }
    }, [publicKey])

    return (
        <div></div>
    )
}
export default Data
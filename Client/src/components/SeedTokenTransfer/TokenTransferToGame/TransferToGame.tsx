import './TokenTransferToGame.css'

const TransferToGame = () => {

    return (
        <>
            <div>
                <div className='d-block shadow-button my-5'>
                    <a className='text-uppercase theme-color'>TRANSFER TOKEN TO WALLET</a>
                    <p>You will transfer XXX,XXX (TOKEN) from your game account to OxXX...XXXX.</p>
                </div>
                <div className='token-transfer-form'>

                    <div className='wrap-token'>
                        <div className='wrap-token-title'>
                            <h3 className='text-uppercase theme-color mb-2'>TRANSFER TOKEN TO Game</h3>
                            <p>
                                Select token and the amount that you want to transfer to wallet account.
                            </p>
                        </div>
                    </div>

                    <p className="text-center">
                        Token will be deposited to wallet once the transaction is complete.
                    </p>
                </div>
                <div className='d-block shadow-button'>
                    <a className='text-uppercase theme-color'>TOKEN WITHDRAWAL STATUS</a>
                </div>
            </div>
        </>
    );
}

export default TransferToGame;



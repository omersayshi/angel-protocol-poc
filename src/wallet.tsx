import React from 'react';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';

export function Wallet() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet();
  console.log({
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  });


  const CHROME_EXTENSION: string= 'CHROME_EXTENSION';


  return (
    <div style={{fontSize: "20px"}}>
      <h1>Connect Wallet</h1>
      <p>
      {JSON.stringify(
            {
              status,
              network,
              wallets,
              availableConnectTypes,
              availableInstallTypes,
            },
            null,
            2,
          )}
        </p>
      <footer>
        {status === WalletStatus.WALLET_NOT_CONNECTED && (
            <button
                key={'connect-' + CHROME_EXTENSION}
                onClick={() => connect(CHROME_EXTENSION as any)}
            >
                Connect Wallet
            </button>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <button onClick={() => disconnect()}>Disconnect</button>
        )}
      </footer>
    </div>
  );
}

import { LCDClient, Coin, Coins, MsgSend, StdFee } from '@terra-money/terra.js';
import {
  useConnectedWallet,
  TxResult,
} from '@terra-money/wallet-provider';
import React, { useEffect, useMemo, useState, useCallback } from 'react';

export function Withdraw() {
  const connectedWallet = useConnectedWallet();

  const [bank, setBank] = useState<null | string>();
  const [withdrawLimit, setWithdrawLimit] = useState<null | number>();
  const [withdraw, setWithdraw] = useState<null | Coins>();
  
  const [txResult, setTxResult] = useState<null | TxResult>(null);

  const angelWallet:string = "omer";


  const checkDust = () => {
    if (withdrawLimit && connectedWallet) {
      lcd?.bank.balance(connectedWallet.walletAddress).then((coins) => {
        setWithdraw(coins.filter((coin) => 
          Number(lcd.market.swapRate(coin, "uusd")) < withdrawLimit
        ));
      });
    }
  }

  const makeTransaction = useCallback(() => {
    setTxResult(null);
    if (withdraw && connectedWallet) {
      connectedWallet
      .post({
        fee: new StdFee(1000000, '200000uusd'),
        msgs: [
          new MsgSend(connectedWallet.walletAddress, angelWallet, withdraw),
        ],
      })
      .then((nextTxResult: TxResult) => {
        console.log(nextTxResult);
        setTxResult(nextTxResult);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
    } else {
      return;
    }
  }, [connectedWallet, withdraw]);

  const lcd = useMemo(() => {
    if (!connectedWallet) {
      return null;
    }

    return new LCDClient({
      URL: connectedWallet.network.lcd,
      chainID: connectedWallet.network.chainID,
    });
  }, [connectedWallet]);

  useEffect(() => {
    if (connectedWallet && lcd) {
      lcd.bank.balance(connectedWallet.walletAddress).then((coins) => {
        setBank(coins.toString());
      });
    } else {
      setBank(null);
    }
  }, [connectedWallet, lcd]);

  return (
    <div>
      <h1>Withdraw Sample</h1>
      <div style={{fontSize: "15px"}}>
        {bank && <pre>{bank}</pre>}
        {!connectedWallet && <p>Wallet not connected!</p>}
        {connectedWallet && withdraw && <pre>{withdraw.toString()}</pre>}
        <input style={{width: '150px'}} type="number" onChange={(e) => setWithdrawLimit(Number(e.currentTarget.value))} />
        <button onClick={() => checkDust()}> Check Dust</button>
        <button onClick={() => makeTransaction()}> Withdraw</button>
      </div>
    </div>
  );
}
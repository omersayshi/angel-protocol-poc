import { LCDClient, Coin, Coins, MsgSend, StdFee } from '@terra-money/terra.js';
import {
  useConnectedWallet,
  TxResult,
} from '@terra-money/wallet-provider';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { constants } from './constants';

export function Withdraw() {
  const connectedWallet = useConnectedWallet();

  const [bank, setBank] = useState<null | string>();
  const [withdrawLimit, setWithdrawLimit] = useState<null | number>();
  const [withdraw, setWithdraw] = useState<null | Coins>();
  
  const [_, setTxResult] = useState<null | TxResult>(null);

  async function filterCoinLogic (c: Coin, withdrawLimit: number): Promise<boolean> {
    console.log("checking", c);
    if (c.denom !== 'uusd' && c.denom !== 'uluna') {
      const result = await lcd?.market.swapRate(c, "uusd");
      return Number(JSON.parse(result?.toJSON() as string).amount) < (withdrawLimit * 1000000)
    }
    return false;
  }
  const checkDust = () => {
    if (withdrawLimit && connectedWallet) {
      lcd?.bank.balance(connectedWallet.walletAddress).then(async (coins) => {
        console.log("baby george", withdraw);
        let res: Coin[] = [];
        for(let coin of coins.toArray()){
          const filter = await filterCoinLogic(coin, withdrawLimit);
          if (filter) res.push(coin);
        }
        setWithdraw(new Coins(res));
      });
    }
  }

  const makeTransaction = useCallback(() => {
    setTxResult(null);
    if (withdraw && connectedWallet) {
      connectedWallet
      .post({
        fee: new StdFee(1000000, '200000uluna'),
        msgs: [
          new MsgSend(connectedWallet.walletAddress, constants.angelAddy, withdraw),
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
        {bank && <pre>Balance: {bank}</pre>}
        {!connectedWallet && <p>Wallet not connected!</p>}
        {connectedWallet && withdraw && <pre> Dust Balance: {withdraw.toString()}</pre>}
        <input style={{width: '150px'}} type="number" onChange={(e) => setWithdrawLimit(Number(e.currentTarget.value))} />
        <button style={{ marginLeft: '5px' }} onClick={() => checkDust()}> Check Dust</button>
        <button style={{ marginLeft: '5px' }} onClick={() => makeTransaction()}> Withdraw</button>
      </div>
    </div>
  );
}

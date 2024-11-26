import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, Flex } from "antd";
import { useCallback, useState } from "react";
import { Description } from "./Description";

export const Disclaimer = () => {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <Flex gap='small' align='start' vertical>
      <Flex vertical={false} gap='middle' justify='space-between' className='caption'>
        <div className='main-title'>WONTOPIA</div>
        <div className='version'>v0.1.0</div>
      </Flex>
      <p className='disclaimer'>
        Welcome to <span className='disclaimer-accent'>Wontopia</span>.<br/>
        It's the place where we have a big utopian dream.<br/>
        The Dream to find the luckiest man in the Universe!
      </p> 
      <p className='disclaimer'>
        Will you dare to challenge the Universe and rise to the top of <span className='disclaimer-accent'>Wontopia</span>?
      </p>
      <div className='disclaimer'>
        The rules are simple.
        <ul>
          <li>At each level, <span className='disclaimer-accent'>you</span> are against two other challengers</li>
          <li>The universe will decide who is the winner and who will receive it all. The winner gets a unique <span className='disclaimer-accent'>NFT</span> item, with the price of the prize</li>
          <li>The winner can withdraw and take his prize, or move forward to the next level to challenge the other two lucky persons</li>
          <li>The win on each level will upgrade your <span className='disclaimer-accent'>NFT</span> item to the more valuable one</li>
          <li>Play to the end! Win it all!</li>
          <li>All the losers will receive unique memorable <span className='disclaimer-accent'>NFT</span> Items</li>
        </ul>
      </div>
      <Button onClick={onOpen} className="links" size="small" block>I want to know more!</Button>
      <Description isOpen={open}  onClose={onClose}/>
      <p className='disclaimer'>To enter the Game, simply press the button and connect your wallet.
        Not sure what a wallet is or how secure it is?
        Just press the button and select the help icon to learn more about wallets and their different types.
      </p>
      <Flex vertical={false} gap='middle' justify='space-between' className='caption'>
          <div className='letsdoit'>Let's do it!</div>
          <TonConnectButton/>
      </Flex>
    </Flex>    
  );
}
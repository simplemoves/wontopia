import { Button, Drawer } from 'antd';
import { AccentB, TON } from './Typography';
import { useNftsStore } from './store/NftsStore';
import { useCallback, useEffect, useState } from 'react';
// import { Lore } from './Lore';

export const Description = ({isOpen, onClose }: {isOpen: boolean, onClose: () => void }) => {
  const nftStore = useNftsStore();

  const clearCache = useCallback(() => nftStore.clearStorage(), [nftStore]);
  const [storageIsEmpty, setStorageIsEmpty] = useState(true);
  useEffect(() => {
    setStorageIsEmpty(nftStore.storageIsEmpty());
  }, [nftStore])
  
  // const storageIsEmpty = useCallback(() => nftStore.storageIsEmpty(), [nftStore]);
  
  return (
    <Drawer
      title=<><AccentB>Wontopia</AccentB> Description</>
      placement='right'
      size='large'
      onClose={onClose}
      open={isOpen}
      key='bottom'>
      
      <div className='disclaimer'>
        <p>
          <AccentB>Wontopia</AccentB> is a unique "Distributed Game of Chance".
        </p>
        <p>
          The game’s logic is transparent and open for examination. Powered by a smart contract on the decentralized <TON/> blockchain, it exposes its decision-making processes so anyone can verify and trust it.
        </p>
        <p>
          To start a game, the player needs only one <TON/> coin.
        </p>
        <p>
          By entering the game, you have the opportunity to win approximately 2.4 <TON/> coins in the first round.
        </p>
        <p>
          The prize is awarded as an unique NFT Item, which represents the win. Players can "sell" the NFT Item at any time, "transfer" it to someone else, or "burn" it to receive the prize as <TON/> coins in their wallet.
        </p>    
        <p>
          Each round starts when three players join the game. One player will be randomly chosen as the winner.
        </p>
        <p>
          Players can continue playing by using their winning NFT items, gaining a chance to triple their prize value. Each NFT item can be played once, but using it destroys the item. Rounds with playable NFTs work the same way: three players use their NFTs, and only one emerges as the winner.
        </p>
      </div>
      <p className='fees'><em>
          Approximately 0.6 <TON/> coins from each initial stake will remain in the game. Part of this amount will be spent on network fees to run the smart contracts, and the remainder will support development and infrastructure.
      </em></p>
      {/* <Lore /> */}
      <p>
        <Button
              disabled={storageIsEmpty}
              size="small"
              type="dashed"
              // color="default"
              // variant="solid"
              shape='round'
              onClick={clearCache}
              // style={{ 
              //     backgroundColor: '#1C1C1C',
              //     borderColor: '#1C1C1C',
              //     color: 'silver' }}>
              >
          Clear Cache 
        </Button>
      </p>
    </Drawer>
  );
}
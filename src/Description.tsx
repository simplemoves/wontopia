import { Card, Drawer } from 'antd';
import { TON } from './Ton';

export const Description = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Drawer
      title=<><span className='disclaimer-accent-b'>Wontopia</span> Description</>
      placement='bottom'
      size='large'
      // closable={false}
      onClose={onClose}
      open={isOpen}
      key='bottom'>
      
      <p className='disclaimer'>
        <span className='disclaimer-accent-b'>Wontopia</span> is a unique "Distributed Game of Chance".
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
      <p className='fees'><em>
        Approximately 0.6 <TON/> coins from each initial stake will remain in the game. Part of this amount will be spent on network fees to run the smart contracts, and the remainder will support development and infrastructure.
      </em></p>
      <Card className='lore'>
        The name <span className='disclaimer-accent-b'>Wontopia</span> is a combination of two words: <span className='disclaimer-accent-b'>Wonton</span> and <span className='disclaimer-accent-b'>Utopia</span>.
        &nbsp;The word <span className='disclaimer-accent-b'>Wonton</span> was chosen because it sounds similar to the phrases:
        <ul>
          <li><em>One </em><TON/> - the cost to enter the game</li>
          <li><em>I <b>Won</b> a</em> <b><TON/></b> - the winner’s exclamation</li>
        </ul>
        Wontons are also a delicious treat that we love.<br/>
        Additionally, the shape of a wonton resembles a money bag, symbolizing luck!<br/>
        The word <span className='disclaimer-accent-b'>Utopia</span> speaks for itself.
        Together, we are building the utopian dream where the <span className='disclaimer-accent-g'>Luck</span> rules the Universe.
      </Card>
    </Drawer>
  );
}
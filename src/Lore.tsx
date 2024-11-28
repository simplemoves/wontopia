import { Card } from "antd";
import { AccentG, TON } from "./Typography";

export const Lore = () => {
  return (
    <Card className='lore'>
      <p>
        The name <span className='disclaimer-accent-b'>Wontopia</span> is a combination of two words: <span className='disclaimer-accent-b'>Wonton</span> and <span className='disclaimer-accent-b'>Utopia</span>.
      </p>
      <p>
        The word <span className='disclaimer-accent-b'>Wonton</span> was chosen because it sounds similar to the phrases:
        <ul>
          <li><em>One </em><TON/> - the cost to enter the game</li>
          <li><em>I <b>Won</b> a</em> <b><TON/></b> - the winner’s exclamation</li>
        </ul>
      </p>
      <p>
        Wontons are also a delicious treat that we love.
      </p>
      <p>
        And finally, the shape of a wonton resembles a money bag, symbolizing luck!<br/>
      </p>
      <p>
        The word <span className='disclaimer-accent-b'>Utopia</span> speaks for itself.
        Together, we are building the utopian dream where the <AccentG>Luck</AccentG> rules the Universe.
      </p>
    </Card>);
}
import './PlayButton.css';
import { Button } from "antd";
import { playStateDescriptions, PlayStateEventsHolder } from "./lib/Types.ts";
import { printJson } from "./lib/ErrorHandler.ts";

export function PlayButton({ sendBet, disabled, playState }: { sendBet: () => Promise<void>, disabled: boolean, playState: PlayStateEventsHolder | undefined }) {
  console.log(`PlayState: ${printJson(playState)}`)
  if (disabled) {
    return <div className="status">{playStateDescriptions(playState?.last_event.state)}</div>
  }

  return <Button
           color="default"
           variant="solid"
           shape="round"
           onClick={sendBet}
           style={{ color: 'var(--primary-color)' }}
           className='play-button'>
              Let's Play!
         </Button>
}
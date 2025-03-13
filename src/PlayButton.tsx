import './PlayButton.css';
import { Button } from "antd";
import { playStateDescriptions, PlayStateEventsHolder } from "./lib/Types.ts";
import { useMemo } from "react";

export function PlayButton({ isInPlay, playState, sendBet }: { isInPlay: boolean, playState: PlayStateEventsHolder | undefined, sendBet: () => Promise<void> }) {
  const [statusDescription, className] = useMemo(() => playStateDescriptions(playState?.last_event.state), [playState?.last_event.state])

  if (isInPlay) {
    return <div className={className}>{statusDescription}</div>
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
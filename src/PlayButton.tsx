import './PlayButton.css';
import { Button } from "antd";

export function PlayButton({ sendBet, disabled }: { sendBet: () => Promise<void>, disabled: boolean }) {
    return !disabled 
    ? (
        <Button
            color="default"
            variant="solid"
            shape='round'
            onClick={sendBet}
            style={{ color: '#B40000' }}
            className='play-button'>
            Let's Play!
        </Button>
    )
    : null;
}
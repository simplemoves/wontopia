import { Button } from "antd";
import { useTonConnect } from "./hooks/useTonConnect";

export function PlayButton({ sendBet }: { sendBet: () => Promise<void> }) {
    const { connected } = useTonConnect();

    return connected && (
        <Button color="default" variant="solid" shape='round' onClick={() => sendBet()}
            style={{ 
                backgroundColor: '#B40000',
                borderColor: '#B40000',
                color: 'black' }}>
            Let's Play!
        </Button>
    );
}
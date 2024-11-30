import { Button } from "antd";
import { useTonConnect } from "./hooks/useTonConnect";

export function PlayButton({ sendBet }: { sendBet: () => Promise<void> }) {
    const { connected } = useTonConnect();

    return connected && (
        <Button color="default" variant="solid" shape='round' onClick={() => sendBet()}
            style={{ 
                backgroundColor: '#E60000',
                borderColor: '#E60000',
                color: 'black' }}>
            Let's Play!
        </Button>
    );
}
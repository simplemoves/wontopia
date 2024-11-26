import { Button } from "antd";
import { useTonConnect } from "./hooks/useTonConnect";

export function PlayButton({ sendBet }: { sendBet: () => Promise<void> }) {
    const { connected } = useTonConnect();

    return connected && (
        <Button onClick={() => sendBet()} block size='large'>
            Let's Play!
        </Button>
    );
}
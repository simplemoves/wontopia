import { Button } from "antd";

export function PlayButton({ sendBet, disabled }: { sendBet: () => Promise<void>, disabled: boolean }) {
    return (
        <Button
            disabled={disabled}
            color="default"
            variant="solid"
            shape='round'
            onClick={sendBet}
            style={{ color: disabled ? '#868686' : '#E60000' }}>
            Let's Play!
        </Button>
    );
}
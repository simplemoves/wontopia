import { Button } from "antd";

export function BurnButton({ sendBurn, disabled }: { sendBurn: () => Promise<void>, disabled: boolean }) {
    return (
        <Button
            disabled={disabled}
            color="default"
            variant="solid"
            shape='round'
            onClick={sendBurn}
            style={{ color: disabled ? '#868686' : 'var(--primary-color)' }}>
            Burn NFT
        </Button>
    );
}
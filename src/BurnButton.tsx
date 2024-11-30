import { Button } from "antd";
import { useTonConnect } from "./hooks/useTonConnect.ts";
import { useCallback } from "react";

export function BurnButton({ sendBurn, closePreview }: { sendBurn: () => Promise<void>, closePreview: () => void }) {
    const { connected } = useTonConnect();

    const onClickHandler = useCallback(() => {
        closePreview();
        sendBurn();
    }, [sendBurn, closePreview])

    return connected && (
        <Button color="default" variant="solid" shape='round' onClick={() => onClickHandler()}
            style={{ 
                backgroundColor: 'black',
                borderColor: 'black',
                color: '#E60000' }}>
            Burn NFT
        </Button>
    );
}
import './Wallet.css'
import { ApiOutlined, CopyOutlined, WalletOutlined } from "@ant-design/icons";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Button, Dropdown, MenuProps } from "antd";
import { useCallback, useMemo } from "react";

type WalletProps = {
    walletAddressStr: string
}
export const Wallet = ({ walletAddressStr }: WalletProps) => {
  const [ tonConnectUI ] = useTonConnectUI();

  const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
    switch(key) {
      case 'disconnect':
        tonConnectUI.disconnect();
        break; 
      case 'copy-to-clipboard':
        navigator.clipboard.writeText(walletAddressStr).catch(console.error);
        break; 
    }
  }, [tonConnectUI, walletAddressStr]);
  
  const walletOperations: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: 'disconnect',
        label: <><ApiOutlined /> Disconnect</>,
      },
      {
        key: 'copy-to-clipboard',
        label: <><CopyOutlined /> Copy address</>,
      },
    ]
  }, []);

  return (
    <Dropdown menu={{ items: walletOperations, onClick }} placement="topRight" overlayClassName="wallet-dropdown">
      <Button color="default" variant="solid" shape='circle' icon={<WalletOutlined />} style={{ color: 'gray'}} />
    </Dropdown>
  );
}

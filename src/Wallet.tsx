import './Wallet.css'
import { ApiOutlined, CopyOutlined, WalletOutlined } from "@ant-design/icons";
import { Address } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Button, Dropdown, MenuProps } from "antd";
import { useCallback, useMemo } from "react";
import { testOnly } from "./lib/Constants.ts";

export const Wallet = ({ walletAddress }: { walletAddress: Address }) => {
  const [ tonConnectUI ] = useTonConnectUI();

  const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
    switch(key) {
      case 'disconnect':
        tonConnectUI.disconnect();
        break; 
      case 'copy-to-clipboard':
        navigator.clipboard.writeText(walletAddress.toString({testOnly}));
        break; 
    }
  }, [tonConnectUI]);
  
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

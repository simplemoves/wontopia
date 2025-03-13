import { Divider, Drawer, Table, TableProps } from 'antd';
import { AccentB, AccentC, AccentT, TON } from './Typography';
import { globalUniversesHolder } from './store/GlobalUniversesHolder';
import { UniversesPrizesItem } from './lib/Types';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';

const columns: TableProps<UniversesPrizesItem>['columns'] = [
  {
    title: <AccentC>Name</AccentC>,
    dataIndex: 'universe',
    key: 'universe',
    render: (wontonPower) => <AccentT>Universe {wontonPower}</AccentT>
  },
  {
    title: <AccentC>Prize</AccentC>,
    dataIndex: 'prize',
    key: 'prize',
    render: (prize) => <AccentT>~ {prize} <TON /></AccentT>
  }
];

const data = globalUniversesHolder.universesPrizes;

export const UniversesDescription = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Drawer
      title={<><AccentB>Wontopia</AccentB> Universes Description</>}
      placement='right'
      size='large'
      onClose={onClose}
      open={isOpen}
      key='bottom'>
      <div className='disclaimer'>
        <Divider orientation="left" plain><b>Refresh Universe</b></Divider>
        <p>
          Clicking the "<ReloadOutlined />" button will initiate the process of finding all items related to <AccentB>Wontopia</AccentB>.
          Please note that finding all items related to <AccentB>Wontopia</AccentB> may take some time, as it involves requesting them from the external indexer of <TON /> Blockchain.
          Universe will refresh automatically after playing, so the Player could view the results of the game.
        </p>
        <Divider orientation="left" plain><b>Dropdown Universes</b></Divider>
        <p>
          Clicking "<DownOutlined />" button will display a list of <AccentB>Wontopia's</AccentB> Universes. Select a Universe to switch to it.
        </p>
        <Divider orientation="left" plain><b>Universes</b></Divider>
        <p>
          Here at <AccentB>Wontopia</AccentB> we have different Universes.
        </p>
        <p>
          Each Universe represent a game level. The higher the level, or Universe - the greater the value of the prize.
        </p>
        <Table<UniversesPrizesItem>
          columns={columns}
          dataSource={data}
          pagination={false} />
        <p>
          <b>Universe 0</b> - is a starting level of the game. Players pays 1 <TON/> to enters.
          If a player wins, he receives an NFT Item with its balance equals to the prize value, and gains access to play in Universe 1, using the NFT he received in the Universe 0.
        </p>
        <p>
          Each winning NFT allows the player to advance to the next Universe, where they can play with other players who have also reached that level. It's the chance to upgrade the NFT and triple its value.
        </p>
        <p>
        Please note that the NFT used to play in a Universe will be destroyed after use.
        </p>
      </div>
    </Drawer>
  );
}
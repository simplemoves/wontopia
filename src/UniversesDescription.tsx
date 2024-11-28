import { Drawer, Table, TableProps } from 'antd';
import { AccentB, TON } from './Typography';
import { globalUniversesHolder } from './store/GlobalUniversesHolder';
import { UniversesPrizesItem } from './lib/Types';

const columns: TableProps<UniversesPrizesItem>['columns'] = [
  {
    title: 'Universe',
    dataIndex: 'universe',
    key: 'universe',
  },
  {
    title: 'Prize',
    dataIndex: 'prize',
    key: 'prize',
    render: (prize) => <>~ {prize} <TON /></>
  }
];

const data = globalUniversesHolder.universesPrizes;

export const UniversesDescription = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
  return (
    <Drawer
      title=<><AccentB>Wontopia</AccentB> Universes Description</>
      placement='bottom'
      size='large'
      onClose={onClose}
      open={isOpen}
      key='bottom'>
      
      <div className='disclaimer'>
        <p>
          Here at <AccentB>Wontopia</AccentB> we have different Universes.
        </p>
        <p>
          Each Universe represent a game level. The higher the level, or Universe - the higher the price of the prize.
        </p>
        <Table<UniversesPrizesItem>
          columns={columns}
          dataSource={data}
          pagination={false} />
      </div>
    </Drawer>
  );
}
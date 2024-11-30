import './Wontopia.css'
import { Flex } from "antd";

export const Wontopia = () => {
  return (
  <Flex vertical={false} gap={'middle'} justify={'space-between'} className={'main-caption'}>
    <div className='main-title1'>
      <div className='fg'>WONTOPIA</div>
    </div>
    <span className='version'>v0.1.0</span>
  </Flex>);
}

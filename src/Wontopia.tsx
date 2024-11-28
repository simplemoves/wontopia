import { Flex } from "antd";

export const Wontopia = () => {
  return (
  <Flex vertical={false} gap={'middle'} justify={'space-between'} className={'caption'}>
    <span className='main-title'>WONTOPIA</span>
    <span className='version'>v0.1.0</span>
  </Flex>);
}

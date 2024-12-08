import './Wontopia.css'
import { Col, Row } from "antd";

export const Wontopia = () => {
  return (
    <Row justify="space-between" wrap={false} style={{backgroundColor: 'red', minWidth: '100%', alignItems: 'baseline'}}>
    {/* <Flex vertical={false} gap={'middle'} justify={'space-between'} className={'main-caption'}> */}
      <Col className='main-title1'><div className='fg'>WONTOPIA</div></Col>
      <Col className='version'>v0.1.0</Col>
      {/* <div className='main-title1'>
        <div className='fg'>WONTOPIA</div>
      </div>
      <span className='version'>v0.1.0</span> */}
    {/* </Flex>); */}
  </Row>);
}

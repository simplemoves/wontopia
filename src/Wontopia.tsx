import './Wontopia.css'
import { Col, Row } from "antd";

export const Wontopia = () => {
  return (
    <Row justify="space-between" wrap={false} className={'main-caption'}>
      <Col className='main-title'><div className='wontopia'>WONTOPIA</div></Col>
      <Col className='version'>v0.1.0</Col>
    </Row>);
}

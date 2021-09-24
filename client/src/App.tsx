import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const App: FC = () => {
   return (
      <Container>
         <Row>
            <Col>Hello</Col>
            <Col>World</Col>
         </Row>
      </Container>
   );
};

export default App;

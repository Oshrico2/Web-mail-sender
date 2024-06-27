import { Col, Container, ListGroup, Row, Button } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { BsFillRecordCircleFill } from "react-icons/bs";


const UserHistoryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserActivities = async () => {
      try {
        const response = await axios.get("/api/users-activity/");
        setUserActivities(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserActivities();
  }, []);

  const handleGetMore = () => {
    setItemsToShow((prevItemsToShow) => prevItemsToShow + itemsToShow);
  };

  return (
    <>
      <Header title="היסטוריית משתמשים" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <div dir="rtl">
            <Container  className="mt-5" style={{maxWidth:'800px'}}>
              {isLoading && <Loader />}
              <ListGroup style={{maxHeight:'60vh',overflowY:'auto'}}>
                {userActivities.length > 0 &&
                  userActivities.slice(0, itemsToShow).map((item, index) => (

                    <ListGroup.Item
                      key={index}
                      className={`text-black ${item.color}`}
                      
                    >
                    <BsFillRecordCircleFill className="ms-2" size={20} style={{
                        color:
                          item.color === 'red'
                            ? 'rgba(220, 53, 69, 0.6)' // bg-danger with 60% opacity
                            : item.color === 'orange'
                            ? 'rgba(255, 193, 7, 0.6)' // bg-warning with 60% opacity
                            : item.color === 'blue'
                            ? 'rgba(0, 123, 255, 0.6)' // bg-primary with 60% opacity
                            : 'rgba(40, 167, 69, 0.6)', // bg-success with 60% opacity
                      }}/>
                      <strong>{item.title} - </strong> {item.description}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
              {itemsToShow < userActivities.length && (
                <div className="text-center mt-3">
                  <Button onClick={handleGetMore}>הצג עוד</Button>
                </div>
              )}
            </Container>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default UserHistoryScreen;

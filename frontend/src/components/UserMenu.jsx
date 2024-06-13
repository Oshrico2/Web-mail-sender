import React, { useState } from "react";
import { Sidenav, Nav /*, Toggle*/ } from "rsuite";
import GroupIcon from "@rsuite/icons/legacy/Group";
import EmailIcon from "@rsuite/icons/Email";
import MemberIcon from "@rsuite/icons/Member";
import SendIcon from "@rsuite/icons/Send";
import { LinkContainer } from "react-router-bootstrap";

const UserMenu = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  return (
    // <div style={{ width: 240 }}>
    //   <Toggle
    //     onChange={setExpanded}
    //     checked={expanded}
    //     checkedChildren="Expand"
    //     unCheckedChildren="Collapse"
    //   />
    //   <hr />
    <Sidenav expanded={expanded} defaultOpenKeys={["3", "4"]}>
      <Sidenav.Body>
        <Nav activeKey={activeKey} onSelect={setActiveKey}>
          <LinkContainer to="/">
            <Nav.Item eventKey="1">דף הבית</Nav.Item>
          </LinkContainer>
          <LinkContainer to="/send-mail">
            <Nav.Item eventKey="2" icon={<EmailIcon />}>
              שליחת מייל לסוכנים
            </Nav.Item>
          </LinkContainer>
          <Nav.Menu
            placement="rightStart"
            eventKey="3"
            title="סוכנים"
            icon={<GroupIcon />}
          >
            <LinkContainer to="/agents">
              <Nav.Item eventKey="3-1">רשימת סוכנים</Nav.Item>
            </LinkContainer>
            <LinkContainer to="/agents/add">
              <Nav.Item eventKey="3-2">הוספת סוכנים</Nav.Item>
            </LinkContainer>
            <LinkContainer to="/agents/per-week">
              <Nav.Item eventKey="3-3">סוכנים בסטטוס שבועי</Nav.Item>
            </LinkContainer>
          </Nav.Menu>
          <Nav.Menu
            placement="rightStart"
            eventKey="4"
            title="עובדים ותחומים"
            icon={<MemberIcon />}
          >
            <LinkContainer to="/employees">
              <Nav.Item eventKey="4-1">רשימת עובדים</Nav.Item>
            </LinkContainer>
            <LinkContainer to="/employees/add">
              <Nav.Item eventKey="4-2">הוספת עובד</Nav.Item>
            </LinkContainer>
          </Nav.Menu>

          <Nav.Menu
            placement="rightStart"
            eventKey="5"
            title="הודעות תפוצה"
            icon={<SendIcon />}
          >
            <LinkContainer to="/mailing">
              <Nav.Item eventKey="5-1">שלח תפוצה</Nav.Item>
            </LinkContainer>
            <LinkContainer to="/agents/confirmed-mailing">
              <Nav.Item eventKey="5-2">סוכנים שנמצאים ברשימת תפוצה</Nav.Item>
            </LinkContainer>
          </Nav.Menu>
        </Nav>
      </Sidenav.Body>
      <Sidenav.Toggle onToggle={(expanded) => setExpanded(expanded)} />
    </Sidenav>
    // </div>
  );
};

export default UserMenu;

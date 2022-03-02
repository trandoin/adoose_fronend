import React from "react";
import Adoose from "../../images/adoose.png";
import {
  Search,
  Button,
  Icon,
  Dropdown as Dropdown1,
  Label,
  List,
} from "semantic-ui-react";
import {
  Menu,
  Dropdown,
  Button as Button1,
  message,
  Space,
  Tooltip,
} from "antd";
import * as api from "../../api/SearchUsers";
import * as NotificationApi from "../../api/NotificationApi";
import { Link, Redirect } from "react-router-dom";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BsChatDots, BsCaretDownFill, BsCoin } from "react-icons/bs";
import { HiCurrencyDollar } from "react-icons/hi";

const resultRenderer = ({ person }) => (
  <Link key={person} to={`../users/${person.split("$")[1]}`} className="w-100">
    <div className="w-100">
      <span style={{ width: "10rem" }}>
        <Label horizontal>{person.split("$")[1]}</Label>
      </span>
      <span style={{ color: "black" }}>{person.split("$")[0]}</span>
    </div>
  </Link>
);

const initialState = {
  loading: false,
  results: [],
  value: "",
};

function exampleReducer(state, action) {
  switch (action.type) {
    case "CLEAN_QUERY":
      return initialState;
    case "Only_Value":
      return { ...state, value: action.query, loading: false };
    case "GET_USERS":
      return { ...state, loading: true, value: action.query };
    case "FINISH_SEARCH":
      return { ...state, loading: false, results: action.results };
    case "UPDATE_SELECTION":
      return { ...state, value: action.selection };

    default:
      throw new Error();
  }
}

function Navbar(props) {
  const [shortSearch, changeShortSearch] = React.useState(false);

  const [state, dispatch] = React.useReducer(exampleReducer, initialState);
  const { loading, results, value } = state;

  const handleSearchChange = React.useCallback(async (e, data) => {
    if (!data.value || data.value.length < 3)
      dispatch({ type: "Only_Value", query: data.value });
    else {
      dispatch({ type: "GET_USERS", query: data.value });
      const People1 = await api.getSearchedUsers({
        text: data.value,
        Username: localStorage.getItem("Username"),
      });
      const people = People1.data.data;
      if (data.value.length === 0) {
        dispatch({ type: "CLEAN_QUERY" });
        return;
      }
      let result = [];
      if (people)
        for (let i = 0; i < people.length; i++)
          if (
            people[i]["Name"] &&
            people[i]["Name"].toUpperCase().includes(data.value.toUpperCase())
          )
            result.push({
              person: `${people[i]["Name"]}$${people[i]["Username"]}`,
            });
          else if (
            people[i]["Username"] &&
            people[i]["Username"]
              .toUpperCase()
              .includes(data.value.toUpperCase())
          )
            result.push({
              person: `${people[i]["Name"]}$${people[i]["Username"]}`,
            });
          else if (
            people[i]["Email"] &&
            people[i]["Email"].toUpperCase().includes(data.value.toUpperCase())
          )
            result.push({
              person: `${people[i]["Name"]}$${people[i]["Username"]}`,
            });
      dispatch({ type: "FINISH_SEARCH", results: result });
    }
  });

  const Logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const editProfile = () => {
    // TODO :
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "Edit":
        editProfile();
        break;
      case "Logout":
        Logout();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {window.innerWidth <= 500 ? (
        <Menu.Item key="support">
          <Link to="/support">
            <Button color="blue">Support</Button>
          </Link>
        </Menu.Item>
      ) : null}
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="Edit">Edit Profile</Menu.Item>
      <Menu.Item key="Logout">Logout</Menu.Item>
      
    </Menu>
  );

  const readAllNotification = async () => {
    await NotificationApi.readAll({
      Username: localStorage.getItem("Username"),
    });
  };

  return (
    <div
      className={`d-flex align-items-center px-3 bg-white justify-content-between NavbarUnlocked`}
    >
      <Link to={"/feed"}>
        <img src={Adoose} alt="logo" style={{ height: "3.75rem" }} />
      </Link>
      {window.innerWidth > 600 ? (
        <div
          className="SearchbarNavbar"
          style={{ maxWidth: "40%", flexGrow: "1" }}
        >
          <Search
            fluid
            className="searchbarForChat"
            loading={loading}
            onSearchChange={handleSearchChange}
            resultRenderer={resultRenderer}
            results={results}
            value={value}
            placeholder="Search with minimum 3 characters of name,company or location..."
            onResultSelect={(e, data) => {
              console.log(data);
              window.location = `/users/${
                data["result"]["person"].split("$")[1]
              }`;
            }}
            // props.location = `/users/${data.results[0]["person"].split('$')[1]}`;
            minCharacters={3}
          />
        </div>
      ) : (
        <>
          {shortSearch ? (
            <div
              className="SearchbarNavbar mb-2"
              style={{
                maxWidth: "100%",
                flexGrow: "1",
                transition: "all 0.2s ease-in",
              }}
            >
              <Search
                fluid
                className="searchbarForChat"
                loading={loading}
                onSearchChange={handleSearchChange}
                resultRenderer={resultRenderer}
                results={results}
                value={value}
                onResultSelect={(e, data) => {
                  console.log(data);
                  window.location = `/users/${
                    data["result"]["person"].split("$")[1]
                  }`;
                }}
                placeholder="Search with minimum 3 characters of name,company or location..."
                onBlur={() => {
                  changeShortSearch(false);
                }}
                minCharacters={3}
              />
            </div>
          ) : (
            <div
              className="SearchbarNavbar mb-2"
              style={{
                maxWidth: "3.2rem",
                flexGrow: "1",
                transition: "all 0.2s ease-in",
              }}
            >
              <Search
                className="searchbarForChat"
                loading={loading}
                onSearchChange={handleSearchChange}
                resultRenderer={resultRenderer}
                onResultSelect={(e, data) => {
                  console.log(data);
                  window.location = `/users/${
                    data["result"]["person"].split("$")[1]
                  }`;
                }}
                results={results}
                value={value}
                onFocus={() => {
                  changeShortSearch(true);
                  console.log("Clicked");
                }}
                placeholder="Search with minimum 3 characters of name,company or location..."
                minCharacters={3}
              />
            </div>
          )}
        </>
      )}

      {window.innerWidth < 600 && shortSearch ? (
        <div></div>
      ) : (
        <div className="d-flex align-items-center">
          {window.innerWidth > 500 ? (
            <Link to="/support" style={{ margin: "0 0.25rem" }}>
              <Button className="d-flex align-items-center" color="linkedin">
                <HiCurrencyDollar
                  size="1.4em"
                  style={{ marginRight: "0.8rem" }}
                />
                <span>Support</span>
              </Button>
            </Link>
          ) : null}

          <Dropdown1
            as="icon"
            className="d-flex mx-2 align-items-center NotificationDropdown DropdownButtonMain NotifyIconNumber"
            floating
            scrolling
            direction="left"
            style={{
              lineHeight: "normal",
              padding: "0.5rem",
              height: "2.5rem",
              borderRadius: "5px",
              fontSize: "1.4rem",
            }}
            icon={
              <Icon name="bell outline">
                {props.Unread > 0 ? (
                  <Label size="tiny" color="blue" floating>
                    {props.Unread}
                  </Label>
                ) : null}
              </Icon>
            }
            onClick={readAllNotification}
          >
            <Dropdown1.Menu>
            <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "3px",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "700" }}>
            Notifications
          </div>
          <div style={{ fontSize: "15px", opacity: "0.6" }}></div>
        </div>
              {props.Notifications.map((list, index) => {
                const zx = list.split("$");
                if (zx[2] === "call") {
                  return (
                    <Dropdown1.Item
                      onClick={(e) => {
                        localStorage.setItem(
                          "CallingPerson",
                          list.split(" ")[0]
                        );
                        window.location.href = "/videocall";
                      }}
                      key={index}
                      style={{
                        borderBottom: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        borderLeft: `4px solid  ${
                          index < props.Unread ? "darkred" : "transparent"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          border: "solid 2px purple",
                          borderRadius: "25%",
                          padding: "5px",
                          justifyContent: "center",
                          alignContent: "center",
                          marginRight: "9px",
                          backgroundColor: 'purple',
                          color: 'red'
                        }}
                      >
                       
                        <Icon
                          name="phone"
                          style={{ transform: "scaleX(-1)",color:'white'}}
                        />
                      </div>
                      {list.split("$")[0]}
                    </Dropdown1.Item>
                  );
                } else
                  return (
                    <Dropdown1.Item
                      key={index}
                      style={{
                        borderBottom: "1px solid #ccc",
                        borderLeft: `4px solid  ${
                          index < props.Unread ? "darkred" : "transparent"
                        }`,
                      }}
                    >
                      <Icon name="phone" style={{ transform: "scaleX(-1)" }} />
                      {list}
                    </Dropdown1.Item>
                  );
              })}
            </Dropdown1.Menu>
          </Dropdown1>

          <Button
            icon
            className="d-flex align-items-center chatDropdown ChatButtonMain"
            style={{
              fontSize: "1.4rem",
              height: "2.5rem",
              borderRadius: "5px",
            }}
          >
            <a href="/chat" style={{ textDecoration: "none", color: "black" }}>
              <IoChatboxEllipsesOutline />
            </a>
          </Button>

          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="d-flex">
              {window.innerWidth > 800 ? (
                <span>{localStorage.getItem("Username")}</span>
              ) : (
                <Icon name="user" />
              )}
              <BsCaretDownFill style={{ marginLeft: "0.5rem" }} />
            </Button>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

export default Navbar;

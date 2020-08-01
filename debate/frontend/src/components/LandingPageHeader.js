import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import "../assets/css/socialHeader.scss";
import { searchDebeate } from "../Actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import SearchResult from "./SearchResult";
import { getUserProfileInfo } from "../Actions/userAction";

function LandingPageHeader(props) {
  const [chkLoginUser, setChkLoginUser] = useState(false);
  const [settingDropDown, setSettingDropDown] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuClass = `dropdown-menu dropdown-menu-right${isOpen ? " show" : ""}`;

  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      setChkLoginUser(true);
      dispatch(getUserProfileInfo(localStorage.getItem("id")));
    } else {
      setChkLoginUser(false);
      // console.log(chkLoginUser);
    }
  }, []);

  const openSettingDropDownMenu = (e) => {
    e.preventDefault();
    if (settingDropDown) {
      setSettingDropDown(false);
    } else {
      setSettingDropDown(true);
    }
  };

  const searchData = async (value) => {
    // props.history.push("/searchData", value);
    setSearchInfo(value);
    if (props.location.pathname == "/debate") {
      const data = {
        name: value,
        type: "debate",
      };
      dispatch(searchDebeate(data));
    } else {
      const data = {
        name: value,
      };
      dispatch(searchDebeate(data));
    }
  };

  const goToLogin = () => {
    props.history.push("/login");
  };

  const toggleValue = () => {
    console.log("fn click");
    setIsOpen(!isOpen);
  };

  const loggedout = () => {
    localStorage.clear();
    props.history.push("/");
    window.location.reload();
  };

  const goToHome = () => {
    props.history.push("/");
  };

  const goToDebate = () => {
    props.history.push("/debate");
  };

  const goToProfile = () => {
    props.history.push("/profile");
  };

  return (
    <div>
      <header>
        <div
          className="logo_container"
          style={{ cursor: "pointer" }}
          onClick={goToHome}
        >
          <div className="logo">pieramo</div>
          <div className="sub_tag_line">your opinion matters.</div>
        </div>

        <div className="main_header">
          <div className="search_field">
            <img
              className="search_icon"
              src={`../assets/images/search.png`}
              style={{ cursor: "pointer" }}
              onClick={goToDebate}
            />
            <input
              type="text"
              placeholder="Search For Debates"
              name="searchDebeate"
              onChange={(e) => searchData(e.target.value)}
            />
          </div>

          {searchInfo ? (
            <div className="upperDiv" style={{ width: "60%" }}>
              <SearchResult value={stateData.searchList} />
            </div>
          ) : (
            <div></div>
          )}

          {/* <div className="side_content">
            <img src={`../assets/images/my_sc.png`} />
            <div>my account</div>
          </div> */}

          <div className="header_items">
            {chkLoginUser ? (
              <div
                className="setting_img"
                onClick={(e) => openSettingDropDownMenu(e)}
              >
                <a href="#">
                  <img
                    className="settings"
                    src={`../assets/images/settings.png`}
                  />
                </a>
              </div>
            ) : null}

            {settingDropDown ? (
              <div class="landingPage-header-setting">
                <ul>
                  <li>Option 1</li>
                  <li>Option 2</li>
                  <li>Option 3</li>
                  <li>Option 4</li>
                </ul>
              </div>
            ) : null}

            {/* <div className="setting_img">
              <a href="#">
                <img
                  className="settings"
                  src={`../assets/images/settings.png`}
                />
              </a>
            </div> */}

            <div className="contry_box">
              <div className="form-group">
                <div id="basic" data-input-name="country" />
              </div>
            </div>

            {chkLoginUser ? (
              ""
            ) : (
              <div
                className="side_content"
                style={{ border: "none", cursor: "pointer" }}
                onClick={goToLogin}
              >
                <p>LOGIN</p>
              </div>
            )}

            {chkLoginUser ? (
              <div className="side_content" style={{ border: "none" }}>
                <img
                  src={
                    `${stateData.userProfileInfo.profilePic}`
                      ? `${stateData.userProfileInfo.profilePic}`
                      : `../assets/images/my_sc.png`
                  }
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  id="dropdownMenuButton"
                  onClick={toggleValue}
                  style={{ borderRadius: "70%" }}
                />

                <div className={menuClass} aria-labelledby="dropdownMenuButton">
                  <ul>
                    <li className="dropdown-item menu" onClick={goToProfile}>
                      <i
                        className="fa fa-user"
                        aria-hidden="true"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      Profile
                    </li>
                    <li className="dropdown-item menu" onClick={loggedout}>
                      <i
                        className="fa fa-power-off"
                        aria-hidden="true"
                        style={{ paddingRight: "5px" }}
                      ></i>
                      Log Out
                    </li>
                    {/* <li className="dropdown-item menu">Link 3</li> */}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

export default withRouter(LandingPageHeader);

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/debate.scss";
import { createDebate, viewDebate } from "../../Actions/debateAction";
import { searchDebeate } from "../../Actions/userAction";
import SelectSearch from "react-select-search";

const Debate = (props) => {
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [opnion, setOpnion] = useState("");
  const [proposal, setProposal] = useState("");
  const [userList, setUserList] = useState([]);

  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    // console.log("debate.. ", state);
    return state.debate;
  });

  const stateUserData = useSelector((state) => {
    return state.user;
  });
  const dataToPass = {
    type: "user",
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    if (
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("id") &&
      localStorage.getItem("email")
    ) {
      dispatch(viewDebate());
      dispatch(searchDebeate(dataToPass));
    } else {
      props.history.push("/");
    }
  }, []);

  const onSubmitDebate = async (event) => {
    event.preventDefault();
    console.log("val... ", name, time, mode);
    const dataToPass = {
      userId: localStorage.getItem("id"),
      topicName: name,
      // debateDate: date,
      language: language,
      debateTime: time,
      status: "pending",
      debateStatus: mode,
      opnion: opnion,
    };

    await dispatch(createDebate(dataToPass));
  };

  const onPrivateSelection = async (event) => {
    // console.log("stateUserData", event);
    setProposal(event);
    let list = [];

    if (
      stateUserData &&
      stateUserData.searchList &&
      stateUserData.searchList.length
    ) {
      stateUserData.searchList.forEach((userInfo) => {
        list.push({
          name: userInfo.topicName,
          value: userInfo.userId,
        });
      });
      setUserList(list);
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <div className="main-content">
        <button
          type="button"
          className="btn btn-default newModal"
          data-toggle="modal"
          data-target="#exampleModal"
          tabIndex={-1}
        >
          Create Debate
        </button>
        <table className="table" style={{ border: "none" }}>
          <thead>
            <tr>
              <td>Topic Name</td>
              <td>Time</td>
              <td>Language</td>
              <td>Opnion</td>
              <td>Debate Mode</td>
            </tr>
          </thead>
          <tbody>
            {stateData.debateList ? (
              stateData.debateList.length ? (
                stateData.debateList.map((debateInfo) => (
                  <tr key={debateInfo._id}>
                    <td>{debateInfo.topicName}</td>
                    {/* <td>{debateInfo.debateDate}</td> */}
                    <td>{debateInfo.debateTime}</td>
                    <td>{debateInfo.language}</td>
                    <td>{debateInfo.opnion}</td>
                    <td>{debateInfo.debateStatus}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-default newModal"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        tabIndex={-1}
                      >
                        Join Debate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p style={{ textAlign: "center" }}>
                      <b>No debates found</b>
                    </p>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="5">
                  <p style={{ textAlign: "center" }}>
                    <b>Loading...</b>
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={(event) => onSubmitDebate(event)}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  New Debate
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect2">
                    Choose a time option
                  </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect2"
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option>Select time option</option>
                    <option value="12 minutes">12 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour and 30 minutes">
                      1 hour and 30 minutes
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="mode">Choose debate mode</label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option>Select debate mode</option>
                    <option value="open mode">open mode</option>
                    <option value="per turns">per turns</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">
                    Enter Debate topic
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Enter Debate topic"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="date1">Select Debate Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date1"
                    placeholder="Select Debate Date"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div> */}
                <div className="form-group">
                  <label htmlFor="lang">Enter Language</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lang"
                    placeholder="Enter Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lang">Select Opnion</label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => setOpnion(e.target.value)}
                  >
                    <option>Select Opnion</option>
                    <option value="AGREE">AGREE</option>
                    <option value="SOMEWHAT AGREE">SOMEWHAT AGREE</option>
                    <option value="SOMEWHAT DISAGREE">SOMEWHAT DISAGREE</option>
                    <option value="DISAGREE">DISAGREE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lang">Select Proposal</label>
                  <select
                    className="form-control"
                    id="mode"
                    onChange={(e) => onPrivateSelection(e.target.value)}
                  >
                    <option>Select Proposal</option>
                    <option value="Private Proposal">Private Proposal</option>
                    <option value="Public Proposal">Public Proposal</option>
                  </select>
                </div>
                {proposal === "Private Proposal" ? (
                  <div className="form-group">
                    <SelectSearch
                      classNamePrefix="form-control"
                      options={userList}
                      search
                      placeholder="SEARCH USER"
                      // onChange={(e) => selectValue(e)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary newModal">
                  {proposal === "Private Proposal"
                    ? "Create and Send Private Proposal"
                    : "Create Debate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debate;

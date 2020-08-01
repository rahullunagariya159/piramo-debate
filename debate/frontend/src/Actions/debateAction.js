import axios from "axios";
import swal from "sweetalert";

export const createDebate = (data) => {
  return (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/createNewDebate`, data)
      .then((result) => {
        if (result.data.code === 200) {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.message,
          });

          swal("Debate created!", result.data.message, "success").then(
            (returnValue) => {
              window.location.reload();
            }
          );
        } else {
          dispatch({
            type: "CREATE_DEBATE",
            payload: result.data.message,
          });

          swal(result.data.message, "error").then((returnValue) => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.log("error in creation... ", error);
        dispatch({
          type: "ERROR",
        });

        swal("Something went wrong!", "error");
      });
  };
};

export const viewDebate = () => {
  return (dispatch) => {
    console.log("view debate in action file");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewDebates?userId=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result.data.. ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "VIEW_DEBATE",
            payload: result.data.data,
          });
        }
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const callVideoRecording = () => {
  return (dispatch) => {
    console.log("video recording fn called");
    let data = {
      time: "12 minutes",
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/storeDebate`, data)
      .then((result) => {
        console.log("result.data of callVideoRecording.. ", result.data);
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const viewFollowersList = () => {
  return (dispatch) => {
    console.log("followers listing ");

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/viewFollowList?userId=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result.data of callVideoRecording.. ", result.data);
        dispatch({
          type: "VIEW_FOLLOWERS",
          action: result.data.data,
        });
      })
      .catch((err) => {
        console.log("error in listing... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const checkFollowed = (id, name) => {
  return (dispatch) => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }debate/checkFollowingOrNot?userId=${localStorage.getItem(
          "id"
        )}&id=${id}&name=${name}`
      )
      .then((result) => {
        console.log("rseult of check following or not.. ", result.data);
        dispatch({
          type: "CHECK_FOLLOW",
          payload: result.data,
        });
      })
      .catch((error) => {
        console.log("error.. ", error);
        swal("Something went wrong!!", "error");
      });
  };
};

export const followUser = (data) => {
  return (dispatch) => {
    console.log("data in follow user.. ", data);
    axios
      .post(`${process.env.REACT_APP_API_URL}debate/makeFollow`, data)
      .then((result) => {
        console.log("res.data in follow user ", result.data);
        if (result.data.code == 200) {
          dispatch({
            type: "FOLLOW_USER",
            payload: result.data.data,
          });

          window.location.reload();
        } else {
          swal("Something went wrong!!", "error");
        }
      })
      .catch((error) => {
        console.log("error.. ", error);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

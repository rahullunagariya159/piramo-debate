import React, { useEffect, useRef, useState } from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import "../../assets/css/debate.scss";
import { callVideoRecording } from "../../Actions/debateAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DebateVideo() {
  const dispatch = useDispatch();
  const history = useHistory();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const [stream, setStream] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setRecevierId] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  let recordedChunks = [];
  let mediaRecorder;

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("debateAccountToken") &&
      localStorage.getItem("email")
    ) {
      dispatch(callVideoRecording());
      socket.current = io.connect("http://localhost:8000");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }

          const options = { mimeType: "video/webm; codecs=vp9" };
          mediaRecorder = new MediaRecorder(stream, options);

          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.start();
        })
        .catch((error) => {
          console.log("errror.. ", error.toString());
          toast.error(error);
        });

      socket.current.on("senderId", (id) => {
        setSenderId(id);
      });

      socket.current.on("receiverId", (users) => {
        setRecevierId(users);
      });

      socket.current.on("hey", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });

      setTimeout(event => {
        console.log("stopping");
        mediaRecorder.stop();
      }, 720000);
    } else {
      history.push("/");
    }
  }, []);

  const handleDataAvailable = (event) => {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log(recordedChunks);
      download();
    } else {
      // ...
      console.log('in else');
    }
  }

  const download = () => {
    var blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `${Date.now()}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);

    let zip = new JSZip();
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, `${Date.now()}.zip`);
    });
  }

  const callPeer = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {},
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: senderId,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <ToastContainer />
      <div className="main-content">
        <div className="row" style={{ marginLeft: "5px" }}>
          <div className="col-6" style={{ border: "solid 1px black" }}>
            <video
              style={{ width: "100%", height: "100%" }}
              controls
              ref={userVideo}
              autoPlay
            ></video>
          </div>
          {callAccepted ? <div className="col-6" style={{ border: "solid 1px black" }}>
            <video
              style={{ width: "100%", height: "100%" }}
              controls
              ref={partnerVideo}
              autoPlay
            ></video>
          </div> : null}
          
        </div>

        <div className="row" style={{ marginLeft: "5px" }}>
          {Object.keys(receiverId).map((key) => {
            if (key === senderId) {
              return null;
            }
            return (
              <button key={key} onClick={() => callPeer(key)}>
                Call {key}
              </button>
            );
          })}
        </div>

        <div className="row">
          {receivingCall ? (
            <div>
              <h1>{caller} is calling you</h1>
              <button onClick={acceptCall}>Accept</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DebateVideo;

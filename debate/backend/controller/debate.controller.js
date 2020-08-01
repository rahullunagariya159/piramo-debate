let debate = require("../model/debate.model");
let user = require("../model/user.model");
const moment = require("moment");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
let privateProposal = require("../model/privateProposal.model");
let debateStream = require("../model/debateStram.model");
let followModel = require("../model/follow.model");
let gridfs = require("gridfs-stream");
const path = require("path");
const mongodb = require("mongodb");

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const { json } = require("express");
const io = socket(server);

const users = {};

gridfs.mongo = mongoose.mongo;
let bucket;

var connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function () {
  // gfs = gridfs(connection.db);
  bucket = new mongodb.GridFSBucket(connection.db);
});

generateHash = (text) => {
  return bcrypt.hashSync(text, bcrypt.genSaltSync(saltRounds), null);
};

verify = (password, DBPassword) => {
  return bcrypt.compareSync(password, DBPassword);
};

exports.changeDebateStatus = async (req, res) => {
  console.log("sdfsfgf", req.body);
  const updDate = moment();
  const updatePendingStatus = await debate.findOneAndUpdate(
    { _id: req.body.debateId },
    {
      $set: {
        status: req.body.status,
        updatedDate: updDate,
      },
    },
    { new: true }
  );

  if (updatePendingStatus) {
    res.json({
      code: 200,
      status: "success",
      message: "debate status updated Successfully",
      data: updatePendingStatus,
    });
  } else {
    res.json({
      code: 404,
      status: "error",
      message: "Somthing want worng! please try again",
    });
  }
};

exports.viewDebates = async (req, res) => {
  // console.log("dsaaaaaaaaa", req.body);

  const getAllDebates = await debate.find({ status: "pending" });

  res.json({
    code: 200,
    status: "success",
    data: getAllDebates,
  });

  //console.log(getAllDebates);
};

exports.deleteDebate = async (req, res) => {
  console.log("request body for delete debate", req.body);

  const removeDebate = await debate.findOneAndDelete({
    _id: req.body.debateId,
  });

  //   console.log(removeDebate);

  if (removeDebate) {
    res.json({
      code: 200,
      status: "success",
      message: "debate deleted Successfully",
    });
  } else {
    res.json({
      code: 403,
      status: "error",
      message: "something want wrong!",
    });
  }
};

exports.updateDebate = async (req, res) => {
  console.log("request body for update debate", req.body);
  const updDate = moment();
  const findBeforUpdate = await debate.findOne({ _id: req.body.debateId });
  if (findBeforUpdate) {
    const updateDebate = await debate.findByIdAndUpdate(
      { _id: req.body.debateId },
      {
        $set: {
          topicName: req.body.topicName,
          debateDate: req.body.debateDate,
          debateTime: req.body.debateTime,
          updatedDate: updDate,
        },
      },
      { new: true }
    );

    if (updateDebate) {
      res.json({
        code: 200,
        status: "success",
        message: "debate updated Successfully",
      });
    } else {
      res.json({
        code: 403,
        status: "error",
        message: "something want wrong! please try again..",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "error",
      message: "record not found!",
    });
  }
};

exports.createNewDebate = async (req, res) => {
  console.log("request body of crearte new debate", req.body);

  const userId = req.body.userId;
  const topicName = req.body.topicName;
  const debateDate = req.body.debateDate;
  const debateTime = req.body.debateTime;
  const status = req.body.status;

  let currentDate = moment().format("YYYY-MM-DD");
  const currentTimeFormat = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(currentTimeFormat);

  const debateDateFormat = moment(debateDate).format("YYYY-MM-DD");

  const debateTimeFormat = moment(debateTime, "HH:mm:ss");

  console.log("db", debateTimeFormat);

  const chkIsBefore = moment(currentDate).isSameOrBefore(debateDateFormat);
  const chkIsSame = moment(currentDate).isSame(debateDateFormat);

  console.log(chkIsBefore);
  console.log(chkIsSame);

  if (chkIsBefore) {
    if (chkIsSame) {
      console.log("innnn");
      const chkIsBeforeTime = moment(currentTimeFormat).isSameOrBefore(
        moment(debateTimeFormat),
        "minutes"
      );

      if (chkIsBeforeTime) {
      } else {
      }

      console.log(chkIsBeforeTime);
    } else {
      console.log("else");
    }
  } else {
  }

  const userExists = await user.findOne({ _id: userId });

  if (userExists) {
    const findMatchedTopic = await debate.find({
      $and: [
        { debateTime: debateTime },
        { topicName: topicName },
        { language: req.body.language },
        { opnion: { $ne: req.body.opnion } },
      ],
    });

    if (findMatchedTopic.length > 0) {
      res.json({
        code: 409,
        status: "error",
        message: "Already found with same name topic!",
      });
    } else {
      let newDebateCreate = new debate();
      newDebateCreate.userId = userId;
      newDebateCreate.topicName = topicName;
      newDebateCreate.debateDate = debateDate;
      newDebateCreate.debateTime = debateTime;
      newDebateCreate.status = status;
      newDebateCreate.debateStatus = req.body.debateStatus; // either open or per tunes
      newDebateCreate.language = req.body.language;
      newDebateCreate.opnion = req.body.opnion;
      const newDebateCreated = await newDebateCreate.save();

      if (newDebateCreated) {
        res.json({
          code: 200,
          status: "success",
          message: "debate created Successfully!",
        });
      } else {
        res.json({
          code: 403,
          status: "error",
          message: "somthing went wrong! please try again",
        });
      }
    }
  } else {
    res.json({
      code: 404,
      status: "error",
      message: "user not found",
    });
  }

  //console.log(debateDateFormate);
};

exports.searchDebeate = async (req, res) => {
  console.log("search debeates... ", req.body);
  let maindData = [];

  if (req.body.type == "debate") {
    const debateList = await debate.find({
      topicName: {
        $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
      },
    });

    console.log("debeate lisat... ", debateList.length);

    if (debateList.length) {
      debateList.forEach((debateInfo) => {
        maindData.push({
          topicName: debateInfo.topicName,
          debateTime: debateInfo.debateTime,
          debateStatus: debateInfo.debateStatus,
          language: debateInfo.language,
          opnion: debateInfo.opnion,
          debateId: debateInfo._id,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  } else if (req.body.type == "user") {
    const userList = await user
      .find({
        status: "active",
        verified: true,
        _id: {
          $ne: req.body.id,
        },
      })
      .exec();

    console.log("debeate lisat... ", userList.length);

    if (userList.length) {
      userList.forEach((userItem) => {
        maindData.push({
          topicName: userItem.userName,
          profilePic: userItem.profilePic,
          userId: userItem._id,
          userType: userItem.userType,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  } else {
    const debateList = await debate.find({
      topicName: {
        $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
      },
    });

    const userList = await user
      .find({
        status: "active",
        verified: true,
        userName: {
          $regex: new RegExp(".*" + req.body.name.toLowerCase() + ".*", "i"),
        },
      })
      .exec();

    console.log("debeate lisat... ", debateList.length, userList.length);

    if (debateList.length || userList.length) {
      debateList.forEach((debateInfo) => {
        maindData.push({
          topicName: debateInfo.topicName,
          debateTime: debateInfo.debateTime,
          debateStatus: debateInfo.debateStatus,
          language: debateInfo.language,
          opnion: debateInfo.opnion,
          debateId: debateInfo._id,
        });
      });

      userList.forEach((userItem) => {
        maindData.push({
          topicName: userItem.userName,
          profilePic: userItem.profilePic,
          userId: userItem._id,
          userType: userItem.userType,
        });
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: maindData,
    });
  }
};

exports.sendPrivateProposal = async (req, res) => {
  console.log("sendPrivateProposal req.body ", req.body);

  let existPrivate = await privateProposal
    .findOne({ userId: req.body.userId })
    .exec();

  if (existPrivate) {
    // let found = existPrivate.connection.find(
    //   ({ userId }) => userId == req.body.receiverId
    // );

    let found =
      existPrivate.debateId == req.body.debateId &&
      existPrivate.connection.find(
        ({ userId }) => userId == req.body.receiverId
      );

    if (found) {
      res.json({
        code: 404,
        status: "err",
        message: "Already send to this user",
      });
    } else {
      let obj = {
        userId: req.body.receiverId,
      };

      privateProposal.findByIdAndUpdate(
        { _id: existPrivate._id },
        {
          $push: {
            connection: obj,
          },
        },
        { new: true },
        (err) => {
          if (err) {
            return;
          }

          res.json({
            code: 200,
            status: "success",
          });
        }
      );
    }
  } else {
    let newPrivateProposal = new privateProposal();
    newPrivateProposal.userId = req.body.userId;
    newPrivateProposal.debateId = req.body.debateId;
    newPrivateProposal.proposalStatus = "pending";
    newPrivateProposal.connection.push({
      userId: req.body.receiverId,
    });
    let storeProposal = await newPrivateProposal.save();

    if (storeProposal) {
      res.json({
        code: 200,
        status: "success",
      });
    }
  }
};

/****onStartRecording call below API******/
exports.upadateToJoinDebate = async (req, res) => {
  console.log("upadateToJoinDebate......", req.body);

  const existDebate = await debate.findOne({ _id: req.body.debateId }).exec();

  if (existDebate) {
    debate.findByIdAndUpdate(
      { _id: existDebate._id },
      {
        $set: {
          status: "joined",
        },
      },
      { new: true },
      (er) => {
        if (er) {
          return;
        }

        res.json({
          code: 200,
          status: "success",
        });
      }
    );
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No debate found",
    });
  }
};

/********** storing debate **********/
exports.storeDebate = async (req, res) => {
  /****** recordRTC.js for recording video *******/
  console.log("store debate req.body.. ", req.body);
  // let countTime = 0;

  // let stream = await navigator.mediaDevices.getUserMedia({
  //   video: true,
  //   audio: true,
  // });

  // if (req.body.time == "30 minutes") {
  //   countTime = 1800000;
  // } else if (req.body.time == "12 minutes") {
  //   countTime = 720000;
  // } else {
  //   countTime = 5400000;
  // }

  // let recorder = new RecordRTCPromisesHandler(stream, {
  //   type: "video",
  // });

  // recorder.startRecording();

  // const sleep = (m) => new Promise((r) => setTimeout(r, m));
  // await sleep(countTime);

  // await recorder.stopRecording();
  // let blob = recorder.getBlob();
  // invokeSaveAsDialog(blob);
};

exports.makeFollow = async (req, res) => {
  console.log("make follow req.body ", req.body);

  let newFollow = new followModel();
  newFollow.name = req.body.name;
  newFollow.id = req.body.id;
  newFollow.followers.push({
    followerId: req.body.userId,
  });
  const storedData = await newFollow.save();
  if (storedData) {
    res.json({
      code: 200,
      status: "success",
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "something wrong",
    });
  }
};

exports.checkFollowingOrNot = async (req, res) => {
  console.log("checkFollowingOrNot req.query ", req.query);

  const matchedList = await followModel
    .findOne({
      id: req.query.id,
      name: req.query.name,
      "followers.followerId": req.query.userId,
    })
    .exec();

  console.log("matched list... ", matchedList);

  if (matchedList) {
    res.json({
      code: 200,
      status: "success",
      data: matchedList,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "Not following anyone",
    });
  }
};

exports.viewFollowList = async (req, res) => {
  console.log("viewFollowList req.query ", req.query);

  const followList = await followModel
    .find({ "followers.followerId": req.query.userId })
    .exec();

  if (followList.length) {
    res.json({
      code: 200,
      status: "sucess",
      data: followList,
    });
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "Not following anyone",
    });
  }
};

exports.applyVoteAndComment = async (req, res) => {
  console.log("apply vote.. ", req.body);

  const foundDebate = await debateStream.findOne({ _id: req.body.id }).exec();

  if (foundDebate) {
    if (req.body.vote) {
      foundDebate.votes.push({
        userId: req.body.userId,
      });
    }
    if (req.body.comment) {
      foundDebate.comments.push({
        userId: req.body.userId,
        message: req.body.comment,
      });
    }

    debateStream.findByIdAndUpdate(
      { _id: foundDebate._id },
      {
        $set: {
          votes: foundDebate.votes,
          comments: foundDebate.comments,
        },
      },
      { new: true },
      (err) => {
        if (err) {
          return;
        }

        res.json({
          code: 200,
          status: "success",
        });
      }
    );
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No debate found",
    });
  }
};

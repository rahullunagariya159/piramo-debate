const express = require("express");
const debate = require("../controller/debate.controller");
const router = express.Router();

router.post("/createNewDebate", debate.createNewDebate);
router.put("/updateDebate", debate.updateDebate);
router.put("/deleteDebate", debate.deleteDebate);
router.get("/viewDebates", debate.viewDebates);
router.put("/changeDebateStatus", debate.changeDebateStatus);
router.post("/searchDebeate", debate.searchDebeate);
router.post("/sendPrivateProposal", debate.sendPrivateProposal);
router.put("/upadateToJoinDebate", debate.upadateToJoinDebate);
router.post("/storeDebate", debate.storeDebate);
router.post("/makeFollow", debate.makeFollow);
router.get("/checkFollowingOrNot", debate.checkFollowingOrNot);
router.get("/viewFollowList", debate.viewFollowList);
router.put("/applyVoteAndComment", debate.applyVoteAndComment);

module.exports = router;

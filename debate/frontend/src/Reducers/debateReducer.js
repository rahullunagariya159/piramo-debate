const debateState = {
  value: "",
};

const debateReducer = (state = debateState, action) => {
  switch (action.type) {
    case "INIT_STATE":
      return {
        ...state,
      };

    case "CREATE_DEBATE":
      return {
        ...state,
        newDebate: action.payload,
      };

    case "VIEW_DEBATE":
      return {
        ...state,
        debateList: action.payload,
      };

    case "VIEW_FOLLOWERS":
      return {
        ...state,
        followerList: action.payload,
      };

    case "CHECK_FOLLOW":
      return {
        ...state,
        checkFollowed: action.payload,
      };

    case "FOLLOW_USER":
      return {
        ...state,
        followUser: action.payload,
      };

    default:
      return state;
  }
};

export default debateReducer;

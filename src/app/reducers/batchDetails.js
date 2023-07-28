import {
  GET_BATCH_DETAILS,
  GET_BATCH_DETAILS_COMPLETED,
  GET_BATCH_DETAILS_ERROR,
  GET_BATCH_DETAILS_REQUEST,
} from '../api/actions';

const INITIAL_STATE = {
  isLoading: false,
  isSuccess: false,
  data: null,
  error: false,
  errorMsg: null,
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  console.log(action.type);
  switch (action.type) {
    case GET_BATCH_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        error: false,
      };
    case GET_BATCH_DETAILS_COMPLETED:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        data: action.response,
        error: false,
      };
    case GET_BATCH_DETAILS_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        data: null,
        error: true,
        errorMsg: action.response,
      };

    case 'RESET_BATCH_DETAILS':
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const getDetails = payload => ({
  type: GET_BATCH_DETAILS,
  payload,
});

export const resetGetDetails = () => ({
  type: 'RESET_BATCH_DETAILS',
});

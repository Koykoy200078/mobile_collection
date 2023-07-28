import {
  UPLOAD_DATA,
  UPLOAD_DATA_COMPLETED,
  UPLOAD_DATA_ERROR,
  UPLOAD_DATA_REQUEST,
} from '../api/actions';

const INITIAL_STATE = {
  isLoading: false,
  data: null,
  error: false,
  errorMsg: null,
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  console.log(action.type);
  switch (action.type) {
    case UPLOAD_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case UPLOAD_DATA_COMPLETED:
      return {
        ...state,
        isLoading: false,
        data: action.response,
        error: false,
      };
    case UPLOAD_DATA_ERROR:
      return {
        ...state,
        isLoading: false,
        data: null,
        error: true,
        errorMsg: action.response,
      };

    case 'RESET_UPLOAD_DATA':
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const uploadData = payload => ({
  type: UPLOAD_DATA,
  payload,
});

export const resetUploadData = () => ({
  type: 'RESET_UPLOAD_DATA',
});

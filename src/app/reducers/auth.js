import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../api/actions';

const INITIAL_STATE = {
  isLoading: false,
  authData: null,
  error: false,
  errorMsg: null,
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case USER_LOGIN_COMPLETED:
      return {
        ...state,
        isLoading: false,
        authData: action.response,
        error: false,
      };
    case USER_LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        authData: null,
        error: true,
        errorMsg: action.response,
      };

    case 'RESET_LOGIN':
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const userLogin = payload => ({
  type: USER_LOGIN,
  payload,
});

export const resetLogin = () => ({
  type: 'RESET_LOGIN',
});

import {
  CHANGE_FONT,
  CHANGE_LANGUAGE,
  CHANGE_THEME,
  FORCE_APPEARANCE,
  SET_INTRO,
  SET_MENU,
} from '../api/actions';

const INITIAL_STATE = {
  theme: 'blue',
  font: null,
  force_dark: null,
  language: null,
  menu: 'ProjectMenu',
  intro: true,
};

export default (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case CHANGE_FONT:
      return {
        ...state,
        font: action.font,
      };
    case FORCE_APPEARANCE:
      return {
        ...state,
        force_dark: action.force_dark,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case SET_MENU:
      return {
        ...state,
        menu: action.menu,
      };
    case SET_INTRO:
      return {
        ...state,
        intro: action.intro,
      };
    default:
      return state;
  }
};

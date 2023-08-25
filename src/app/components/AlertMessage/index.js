import Toast from 'react-native-toast-message';

const showError = ({message, description}) => {
  Toast.show({
    type: 'customError',
    text1: message,
    text2: description,
  });
};

const showInfo = ({message, description}) => {
  Toast.show({
    type: 'customInfo',
    text1: message,
    text2: description,
  });
};

const showSuccess = ({message, description}) => {
  Toast.show({
    type: 'customSuccess',
    text1: message,
    text2: description,
  });
};

export {showError, showInfo, showSuccess};

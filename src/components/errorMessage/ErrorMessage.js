import errorPic from './error.gif';

const ErrorMessage = () => {
   return (
      <img
         style={{ display: 'block', width: 250, height: 250, objectFit: 'contain', margin: '0 auto' }}
         src={errorPic}
         alt="error"
      />
   );
};

export default ErrorMessage;

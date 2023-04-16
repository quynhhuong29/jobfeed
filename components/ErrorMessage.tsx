interface IErrorMessage {
  message?: string;
}

const ErrorMessage = ({ message }: IErrorMessage) => {
  return <p className="text-red-700 text-xs block mt-1.5">{message}</p>;
};

export default ErrorMessage;

interface IErrorMessage {
  message?: string;
}

const ErrorMessage = ({ message }: IErrorMessage) => {
  return (
    <div className="bg-yellow-100 rounded-sm px-1 py-1 mt-1.5">
      <p className="text-red-500 text-xs block">{message}</p>
    </div>
  );
};

export default ErrorMessage;

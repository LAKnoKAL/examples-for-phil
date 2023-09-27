import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';

const Input = styled.input.attrs({
  className: 'leading-base',
})`
  font-size: 15px;

  &::placeholder {
    font-size: 15px;
    color: #a8a8a8;
  }
`;

const TextArea = styled.textarea.attrs({
  className: 'leading-base',
})`
  font-size: 15px;
  border-radius: 0.9375rem;

  &::placeholder {
    font-size: 15px;
    color: #a8a8a8;
  }
`;

const TextField = ({
  className,
  wrapperClassName = '',
  multiline = false,
  error,
  ...rest
}) => {
  const Component = multiline ? TextArea : Input;

  return (
    <>
      <div
        className={cx(
          'relative rounded-15 overflow-hidden flex',
          { 'rounded-br-none': multiline },
          wrapperClassName
        )}
      >
        <Component
          className={cx(
            'w-full p-4 text-black placeholder:text-gray-800 placeholder:leading-base disabled:bg-gray-400 read-only:bg-gray-400',
            className
          )}
          {...rest}
        />
      </div>
      <div className="text-xs text-red-500 ml-4 my-1">
        {error
          ? Array.isArray(error)
            ? error.map((err) => <p>{err.message}</p>)
            : error.message
          : null}
      </div>
    </>
  );
};

export default TextField;

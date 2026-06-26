function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full
        px-4
        py-2
        border
        border-gray-300
        rounded-lg
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-200
        transition
        ${className}
      `}
    />
  );
}

export default Input;
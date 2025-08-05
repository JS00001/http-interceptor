import classNames from "classnames";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary";
}

export default function Button({
  className,
  color = "primary",
  ...props
}: ButtonProps) {
  const colorClasses = {
    primary: classNames(
      "bg-primary-500 text-white",
      "hover:bg-primary-600",
      "active:bg-primary-700"
    ),
    secondary: classNames(
      "bg-gray-100 text-gray-800",
      "hover:bg-gray-200",
      "active:bg-gray-300"
    ),
  }[color];

  const buttonClasses = classNames(
    "transition-all",
    "flex items-center gap-1",
    "text-xs px-3 py-1.5 rounded-lg",
    "hover:cursor-pointer",
    colorClasses,
    className
  );

  return <button className={buttonClasses} {...props} />;
}

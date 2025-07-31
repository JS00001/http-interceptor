import classNames from "classnames";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export default function Button({ className, ...props }: ButtonProps) {
  const buttonClasses = classNames(
    "transition-all",
    "bg-primary-500 text-white",
    "text-xs px-3 py-1.5 rounded-lg",
    "hover:bg-primary-600 hover:cursor-pointer",
    "active:bg-primary-700",
    className
  );

  return <button className={buttonClasses} {...props} />;
}

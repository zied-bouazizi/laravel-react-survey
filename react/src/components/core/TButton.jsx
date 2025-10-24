import { Link } from "react-router-dom";

export default function TButton({
  color = "indigo",
  to = "",
  circle = false,
  href = "",
  link = false,
  target = "_blank",
  onClick = () => {},
  className = "",
  children,
}) {
  let classes = [
    "flex",
    "items-center",
    "whitespace-nowrap",
    "text-sm",
    "border",
    "border-2",
    "border-transparent",
  ];

  if (link) {
    classes = [...classes, "transition-colors"];

    switch (color) {
      case "indigo":
        classes = [...classes, "text-indigo-500", "focus:border-indigo-500"];
        break;
      case "red":
        classes = [...classes, "text-red-600", "focus:border-red-600"];
        break;
      case "sky":
        classes = [...classes, "text-sky-600", "focus:border-sky-600"];
        break;
    }
  } else {
    classes = [...classes, "text-white", "focus:ring-2", "focus:ring-offset-2"];

    switch (color) {
      case "indigo":
        classes = [
          ...classes,
          "bg-indigo-600",
          "hover:bg-indigo-700",
          "focus:ring-indigo-500",
        ];
        break;
      case "red":
        classes = [
          ...classes,
          "bg-red-600",
          "hover:bg-red-700",
          "focus:ring-red-500",
        ];
        break;
      case "green":
        classes = [
          ...classes,
          "bg-emerald-500",
          "hover:bg-emerald-600",
          "focus:ring-emerald-400",
        ];
        break;
        case "sky":
        classes = [
          ...classes,
          "bg-sky-600",
          "hover:bg-sky-700",
          "focus:ring-sky-500",
        ];
        break;
        case "gray":
        classes = [
          ...classes,
          "bg-gray-600",
          "hover:bg-gray-700",
          "focus:ring-gray-500",
        ];
        break;
    }
  }

  if (circle) {
    classes = [
      ...classes,
      "h-8",
      "w-8",
      "items-center",
      "justify-center",
      "rounded-full",
      "text-sm",
    ];
  } else {
    classes = [...classes, "p-0", "py-2", "px-4", "rounded-md"];
  }

  const finalClasses = [...classes, className].join(" ");

  return (
    <>
      {href && (
        <a href={href} className={finalClasses} target={target}>
          {children}
        </a>
      )}
      {to && (
        <Link to={to} className={finalClasses}>
          {children}
        </Link>
      )}
      {!to && !href && (
        <button onClick={onClick} className={finalClasses}>{children}</button>
      )}
    </>
  );
}
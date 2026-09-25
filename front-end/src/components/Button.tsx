import React from "react";

const Button = ({
  children,
  className,
  Icon,
  childClassName,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  Icon?: React.ReactNode;
  childClassName?: string;
  props?: void;
}) => {
  return (
    <>
      <button className={`p-0.5 rounded-xl bg-linear-to-b from-white to-stone-200/40 shadow-card active:shadow-m active:scale-[0.995] cursor-pointer ${className}`} {...props}>
        <div className="bg-linear-to-b  from-stone-200/40 to-white/80 rounded-[10px] p-2 flex items-center">
          {Icon}
          <span className={`font-medium text-sm text-foreground ${childClassName}`}>
            {children}
          </span>
        </div>
      </button>
    </>
  );
};

export default Button;

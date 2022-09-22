import { Button } from "@material-tailwind/react";
import { variant } from "@material-tailwind/react/types/components/button";
import { color } from "@material-tailwind/react/types/components/button";
import React from "react";

const AppButton: React.FC<{
  onClick: () => void;
  icon?: JSX.Element;
  label: string;
  css?: string;
  theme?: color;
  variant?: variant;
}> = ({ onClick, icon, label, css, theme, variant }) => {
  return (
    <Button
      color={theme}
      variant={variant}
      className={`w-full flex flex-row items-center justify-center ${
        css ? css : ""
      }`}
      onClick={() => onClick()}
    >
      {icon}
      {label}
    </Button>
  );
};

export default AppButton;

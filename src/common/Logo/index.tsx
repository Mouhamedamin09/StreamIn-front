import { FC } from "react";
import { Link } from "react-router-dom";

import { useTheme } from "@/context/themeContext";
import { cn } from "@/utils/helper";

interface logoProps {
  className?: string;
  logoColor?: string;
}

const Logo: FC<logoProps> = ({
  className = "",
  logoColor = "text-black dark:text-primary",
}) => {
  const { theme } = useTheme();

  // Use dark logo for light mode, regular logo for dark mode
  const logoSrc = theme === "Light" ? "/streamIn-dark.png" : "/sreamIn.png";

  return (
    <Link
      to="/"
      className={cn(`flex flex-row items-center xs:gap-2 gap-[6px]`, className)}
    >
      <img
        src={logoSrc}
        alt="StreamIn logo"
        className="sm:h-[128px] h-[112px] sm:w-[128px] w-[112px]"
      />
    </Link>
  );
};

export default Logo;

import Logo from "../Logo";
import FooterImg from "@/assets/images/footer-bg.webp";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundImage: `
            linear-gradient(rgba(0,0,0,0.075), rgba(0,0,0,0.075))
        , url(${FooterImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="dark:bg-black lg:py-16 sm:py-10 xs:py-8 py-[30px] w-full"
    >
      <div
        className={cn(
          maxWidth,
          `flex flex-col items-center lg:gap-8 md:gap-6 sm:gap-4 xs:gap-3 gap-2 text-center`
        )}
      >
        <Logo logoColor="text-primary" />

        <div className="max-w-2xl mx-auto">
          <p className="text-gray-300 md:text-lg sm:text-base xs:text-sm text-xs font-nunito leading-relaxed">
            StreamIn is a website for watching movies, TV shows, and anime. All
            data is scraped from various sources and we do not maintain any
            databases or store any content.
          </p>
        </div>

        <div className="text-gray-400 md:text-sm sm:text-xs text-xs font-nunito">
          © 2025 StreamIn. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

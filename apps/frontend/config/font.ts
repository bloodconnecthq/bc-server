import { Bricolage_Grotesque, Poppins, Space_Grotesk } from "next/font/google";

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const bricolageGrotesk = Bricolage_Grotesque({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
});

export const fonts = {
  poppins: poppins,
  bricolageGrotesk: bricolageGrotesk,
};
export const Colors = {
  Primary: "rgb(4, 148, 220)",
  lINK: "#93d2fd",
  PrimaryDark: "##0f1c39",
  PrimaryDisable: "#1e3f6f",
  Background: "#04111d",
  White: "#fefefe",
  Black: "#212121",
  Border: "#e3e3e3",
  Gray: "rgb(148, 155, 164)",
  GrayBG: "#f7f9fa",
  Gradients: { PrimaryToSec: ["#1199fa", "#10c0e9"] },
};

const BreakPoints = {
  MobileS: "320px",
  MobileM: "375px",
  MobileL: "500px", //fixed
  Tablet: "900px", //fixed
  Laptop: "1000px", //fixed
  LaptopL: "1130px", //fixed
  Desktop: "2560px",
};

export const Devices = {
  MobileS: `(min-width: ${BreakPoints.MobileS})`,
  MobileM: `(min-width: ${BreakPoints.MobileM})`,
  MobileL: `(min-width: ${BreakPoints.MobileL})`,
  Tablet: `(min-width: ${BreakPoints.Tablet})`,
  Laptop: `(min-width: ${BreakPoints.Laptop})`,
  LaptopL: `(min-width: ${BreakPoints.LaptopL})`,
  Desktop: `(min-width: ${BreakPoints.Desktop})`,
};

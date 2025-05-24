import _ from "lodash";
import { colors, createTheme, responsiveFontSizes } from "@material-ui/core";
import { softShadows, strongShadows } from "./shadows";
import typography from "./typography";

const baseOptions = {
  direction: "ltr",
  typography,
  overrides: {
    MuiDialog: {
      paper: {
        borderRadius: "10px",
        background: "#746058",
      },
      paperWidthSm: {
        maxWidth: "450px",
      },
    },
    MuiPagination: {
      ul: {
        margin: "0",
        display: "flex",
        padding: "0",
        flexWrap: "wrap",
        listStyle: "none",
        alignItems: "center",
        justifyContent: "end",
      },
    },

    // MuiPaginationItem: {
    //   root: {
    //     color: colors.grey[700],
    //   },
    //   rounded: {
    //     border: "1px solid #616161",
    //   },
    //   // paper: {},
    //   "& .Mui-selected": {
    //     color: colors.common.black,
    //   },
    // },

    MuiPaginationItem: {
      root: {
        color: colors.grey[700],
      },
      rounded: {
        border: "1px solid #616161",
      },
      selected: {
        // color: colors.grey[700],
        backgroundColor: "#000 !important",
      },
    },
    MuiAccordion: {
      root: {
        ".MuiPaper-root": {
          borderRadius: "20px",
        },
      },
    },
    MuiTableHead: {
      root: {
        background: "#746058 !important",
      },
    },
    MuiTable: {
      root: {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "20px 20px 0px 0px",
      },
    },
    MuiTableRow: {
      background: "rgba(255, 255, 255, 0.05)",
      root: {
        "& th": {
          padding: "18px",

          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "13px",
          whiteSpace: "pre",
          lineHeight: "20px",
          textAlign: "center",
          color: "#fff	 !important",
        },
        "& th:first-child": {
          borderRadius: "10px 0px 0px 0px",
        },
        "& th:last-child": {
          borderRadius: "0px 10px 0px 0px",
        },
        // "& th:nth-child(odd)": {
        //   background: "rgba(255, 255, 255, 0.05)",
        //   // boxShadow:"0px -10px 12px 1px #232323de",
        // },
        // "& th:nth-child(even)": {
        //   background: "transparent",
        // },
        "& td": {
          padding: "10px 6px",
          fontFamily: "'Sora', sans-serif",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "12px",
          lineHeight: "15px",
          textAlign: "center",
          wordBreak: "break-word",
          background: "#FFFFFF",
          borderBottom: "1px solid #bdc4d1",
          // whiteSpace: "pre",
        },
        // "& td:nth-child(odd)": {
        //   background: "#FFFFFF",
        // },
        // "& td:nth-child(even)": {
        //   background: "#fff",
        // },
      },
    },

    MuiTableCell: {
      root: {
        fontSize: "12px",
        borderBottom: "transparent",
        padding: "8px",
      },
      head: {
        color: "#fff",
        fontWeight: "300",
        lineHeight: "28px",
      },
      body: {
        color: "#475569 !important",
      },
    },
    MuiTableContainer: {
      root: {
        width: "100%",
        overflowX: "auto",
      },
    },

    MuiTabs: {
      fixed: {
        width: "100%",
        background: "#000",
      },
    },

    MuiIconButton: {
      root: {
        fontSize: "20px",
        color: "#000",
        // "&:hover": {
        //   background: "transparent !important ",
        // },
      },
    },
    MuiDivider: {
      root: {
        // backgroundColor: "#959595 !important",
      },
    },
    MuiInput: {
      underline: {
        "&::after": {
          display: "none",
        },
        "&::before": {
          left: "0",
          right: "0",
          bottom: "0",
          content: '"\\00a0"',
          position: "absolute",
          transition:
            "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          borderBottom: "1px solid #fff",
          pointerEvents: "none",
          display: "none",
        },
      },
    },
    MuiFormControl: {
      root: {
        // width: "100%",
      },
    },
    MuiDialogContent: {
      root: {
        padding: "30px",
        overflow: "unset !important",
      },
    },
    MuiDialogTitle: {
      root: {
        position: "absolute",
        padding: "20px",
        background: "#fff",
        right: 0,
        // "&::after": {
        //   position: "absolute",
        //   bottom: "0",
        //   content: "''",
        //   left: "0",
        //   width: "100%",
        //   height: "2px",
        //   zIndex: "9",
        //   background:
        //     "linear-gradient(90.74deg, rgba(95, 93, 93, 0.15) 7.44%, #666666 42.18%, rgba(102, 102, 102, 0.08) 83.76%)",
        // },
      },
    },
    MuiFormLabel: {
      root: { color: "#222" },
      colorSecondary: {
        "&.Mui-focused": {
          color: "#222",
        },
      },
    },
    MuiListSubheader: {
      root: {
        color: "#000000",
        fontSize: "22px !important",
        fontWeight: "600 !important",
        lineHeight: "33px !important",
      },
    },
    MuiFormHelperText: {
      root: {

        fontWeight: "600 !important",
      },
    },
    MuiPaper: {
      outlined: {
        padding: "20px",
        width: "100%",
      },
      elevation2: {
        padding: "15px",
        borderRadius: "10px",
        background: "#FFFFF",
        boxShadow: "none",
        color: "#000",
        // border: "1px solid #80808036",
      },
      root: {
        color: "#222",
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        backgroundColor: "rgb(255, 255, 255)",
        // boxShadow: "0px 0px 32px rgba(129, 23, 147, 0.03)",
      },
    },
    MuiSelect: {
      icon: {
        color: "#222",
      },
      selectMenu: { height: "17px" },
      defaultProps: {
        MenuProps: {
          anchorOrigin: {
            vertical: "bottom !important",
            horizontal: "left !important",
          },
          transformOrigin: {
            vertical: "top !important",
            horizontal: "left !important",
          },
          getContentAnchorEl: null,
        },
      },
    },
    MuiMenuItem: {
      root: {
        color: "#222",
        fontSize: "14px",
        fontWeight: 500,
        paddingLeft: "15px",
      },
    },
    MuiPopover: {
      root: {
        zIndex: 99999,
      },
    },
    MuiListItem: {
      root: {
        alignItems: "self-start",
      },
      gutters: {
        paddingLeft: 0,
      },
    },
    MuiCheckbox: {
      root: {
        padding: "4px",
        fontSize: "12px",
      },
      colorSecondary: {
        "&.Mui-checked": { color: "#fff" },
      },
    },
    MuiFormControlLabel: {
      root: {
        paddingBottom: "0",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        marginLeft: "-15px",
        // margin-right: 16px;
        verticalAlign: "middle",
        marginBottom: "3px",
        background: "rgba(83, 83, 83, 0.91)",
        // width: "165px",
        // -webkit-tap-highlight-color: transparent;
      },
    },
    MuiListItemSecondaryAction: {
      root: {
        right: 0,
      },
    },
    MuiSwitch: {
      switchBase: {
        color: "#00AFA3 !important",
      },
    },

    MuiInputBase: {
      root: {
        width: "100%",
        // background: "#746058    !important",
        border: "1px solid black !important",
      },
      input: {
        fontSize: "13px !important",
        fontWeight: "400 !important",
        color: "#000 !important",

        height: "1.1876em",
        "&:-webkit-autofill": {
          animationName: "mui-auto-fill",
          animationDuration: "5000s",
          WebkitBackgroundClip: "text !important",
          WebkitTextFillColor: "#000 !important",
          WebkitBoxShadow: "0 0 0 100px #ffffff inset !important",
        },
      },
    },
    MuiBackdrop: {
      root: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    },

    MuiButton: {
      contained: {
        fontSize: "13px",
        borderRadius: "50px",
        header: "47px",
        fontFamily: "Good Times W00 Bold",
      },
      // },
      // MuiButton: {
      root: {
        "&:hover": {
          backgroundColor: "none",
        },
        // },
        // root: {
        "&.Mui-disabled": {
          color: "#606060 !important",
        },
      },

      outlinedSizeSmall: {
        padding: "6px 23px",
        fontSize: "16px",
        lineHeight: " 24px",
      },
      text: {
        fontFamily: "'Mulish', sans-serif",
      },
      textPrimary: {
        color: "#222",
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "0",
      },
    },
    MuiMenu: {
      paper: {
        top: "47px",
        // background: "#000",
      },
    },

    MuiTypography: {
      colorPrimary: {
        color: "#fff",
      },

      colorSecondary: {
        color: "#000 !important",
      },
      subtitle1: {
        color: "#222",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: " 16px",
        colorSecondary: {
          color: "#8d8989",
        },
      },
    },
  },
};

const themesOptions = [
  {
    name: "LIGHT",
    overrides: {
      MuiFilledInput: {
        root: { backgroundColor: " #f8f7f7", color: "#000" },
      },
      MuiAppBar: {
        colorPrimary: {
          // color: "#fff",
          backgroundColor: "none",
        },
        colorDefault: {
          backgroundColor: "none",
        },
      },
      MuiSelect: {
        icon: {
          top: "calc(50% - 20px)",
          color: "#fff",
          right: "0",
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(255, 255, 255, 0.025)",
          borderRadius: "50%",
          padding: "8px",
        },
      },
      MuiButton: {
        root: {
          "&:hover": {
            backgroundColor: "none",
          },
        },
        containedSecondary: {
          color: "#353434",
          filter: "drop-shadow(0px 13px 27px rgba(0, 0, 0, 0.25))",
          padding: "10px 35px",
          fontSize: "12px",
          fontFamily: "'Sora', sans-serif",
          fontWeight: "400",
          lineHeight: "21px",
          borderRadius: "50px",
          backgroundColor: "#fff",
          height: "48px",
          letterSpacing: "1.26px",
          whiteSpace: "pre",
          "&:hover": {
            color: "#ffffff",
            background:
              "linear-gradient(93.14deg, #FFB000 -20.75%, #FF564D 11.84%, #FF0098 53.76%, #5D00C1 102.96%)",
            border: "1px solid #a102afcc",
          },
          "@media(max-width:767px)": {
            fontSize: "10px !important",
          },
        },
        containedPrimary: {
          color: "#fff",
          filter: "drop-shadow(0px 13px 27px rgba(0, 0, 0, 0.25))",
          padding: "10px 35px",
          fontSize: "14px",
          letterSpacing: "1.26px",
          background:
            "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",
          fontFamily: "Roboto Condensed",
          fontWeight: "700",
          lineHeight: "21px",
          borderRadius: "50px",
          backgroundColor: "#898989",
          height: "48px",
          whiteSpace: "pre",
          "&:hover": {
            color: "#000",
            boxShadow:
              "0 1px 0 0 #ff00cd, 0 -1px 0 0 #7d00b9, 1px 0 0 0 #f5673f, -1px 0 0 0 #f5673f, 1px -1px 0 0 #f5673f, -1px 1px 0 0 #f5673f, 1px 1px 0 0 #f5673f, -1px -1px 0 0 #f5673f",
            background: "#fff !important",
          },
          "@media(max-width:767px)": {
            fontSize: "12px !important",
          },
        },
      },
      MuiOutlinedInput: {
        input: {
          borderRadius: "10px",
          "&:-webkit-autofill": {
            "-webkit-background-clip": "text !important",
            // transitionDelay: "9999s",
            // "caret-color": "transparent",
            "-webkit-box-shadow": "0 0 0 100px #ffffff inset !importantt",
            "-webkit-text-fill-color": "#000",
          },
          "&:-internal-autofill-selected": {
            color: "#fff",
          },
        },
      },
      MuiInputBase: {
        root: {
          background: "#FFFFFF",
          color: "#000",
        },
        input: {
          fontSize: "13px",
          fontWeight: "400",
          "&::placeholder": {
            opacity: 1,
            color: "#a1a1a1",
          },
        },
      },
    },
    typography: {
      fontFamily: "'K2D', sans-serif",
    },
    palette: {
      type: "light",
      action: {
        active: colors.blueGrey[600],
      },
      background: {
        default: "#f5f5f5",
        disabled: "#212226a1",
        dark: "#1c2025",
        paper: "#FFFFFF",
        section: "#D5D7DB",
        subpaper:
          "linear-gradient(180deg, #021431 -89.43%, rgb(2 4 8 / 0%) 50.33%)",
        header: "linear-gradient(180deg, #424344 0%, #232427 100%)",
        brown: "#f5f5f5",
        table: "#545252",
        button: "#FFFFFF",
        buttontext: "#FFFFFF",
      },
      primary: {
        main: "#FFFFFF",
      },
      secondary: {
        main: "#000",
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows: softShadows,
  },
  {
    name: "DARK",
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          color: "#fff",
          // backgroundColor: "#212226",
        },
        colorDefault: {
          backgroundColor: "none",
        },
      },

      MuiAccordionSummary: {
        root: {
          // background: "#171616",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "15px 15px 0px 0px",
        },
      },
      MuiAccordionDetails: {
        root: {
          background: "rgba(255, 255, 255, 0.025)",
          borderRadius: "0px 0px 15px 15px",
        },
      },
      MuiSelect: {
        icon: {
          top: "calc(50% - 20px)",
          color: "#000",
          right: "0",
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(255, 255, 255, 0.025)",
          borderRadius: "50%",
          padding: "8px",
        },
      },
      MuiButton: {
        root: {
          "&:hover": {
            backgroundColor: "none",
          },
        },
        containedSecondary: {
          color: "#071c35",
          backgroundColor: "#F4F3FF",
          padding: "14px 30px",
          border: "1px solid #D9D6FE",
          fontSize: "14px",
          fontFamily: "'Sora', sans-serif",
          fontWeight: "700",
          lineHeight: "18px",
          whiteSpace: "pre",
          borderRadius: "8px",
          boxShadow: "none",
          "&:hover": {
            color: "#fff",
            paddingY: "15px !important",
            backgroundColor: "#071c35",
            boxShadow: "none",
          },
          "@media(max-width:767px)": {
            fontSize: "10px !important",
          },
        },
        containedPrimary: {
          color: "#fff",
          boxShadow: "none",
          padding: "15px 30px",
          fontSize: "14px",
          fontFamily: "'Sora', sans-serif",
          fontWeight: "500",
          lineHeight: "18px",
          borderRadius: "8px",
          whiteSpace: "pre",
          backgroundColor: "#071c35",
          border: "1px solid #071c35",
          "&:hover": {
            color: "#071c35",
            backgroundColor: "#F4F3FF",

            border: "1px solid #D9D6FE",
            boxShadow: "none",
          },
          "@media(max-width:767px)": {
            fontSize: "12px !important",
          },
        },
      },
      MuiOutlinedInput: {
        input: {
          borderRadius: "10px",
          padding: "15px",

          "&:-webkit-autofill": {
            "-webkit-background-clip": "text !important",
            // transitionDelay: "9999s",
            "caret-color": "transparent",
            // "-webkit-box-shadow": "0 0 0 100px #101010 inset",
            "-webkit-text-fill-color": "#fff",
          },
          "&:-internal-autofill-selected": {
            color: "#000",
          },
        },
        root: {
          color: "#475569d4 !important",
          position: "relative",
          borderRadius: "10px",
          background: "#fff",
          border: "1px solid #e5e7eb",
        },
        notchedOutline: {
          borderColor: "transparent !important",
        },
      },
      MuiInputBase: {
        root: {
          backgroundColor: "#212226",
          color: "#000",
        },
        input: {
          fontSize: "13px",
          fontWeight: "400",
          "&::placeholder": {
            opacity: 1,
            color: "#98A2B3",
          },
        },
        multiline: {
          // backgroundColor: "#1E1E1E",
          border: "none",
          borderRadius: "10px",
        },
      },
    },
    typography: {
      fontFamily: "'K2D', sans-serif",
    },
    palette: {
      type: "dark",
      action: {
        active: "rgba(255, 255, 255, 0.54)",
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(255, 255, 255, 0.08)",
        disabled: "rgba(255, 255, 255, 0.26)",
        disabledBackground: "rgb(234 236 240)",
        focus: "rgb(234 236 240)",
      },
      background: {
        default: "#5c4d44",
        dark: "#212226",
        paper: "rgba(255, 255, 255, 0.1)",
        section: "#213743",
        subpaper:
          "linear-gradient(180deg, #F1F5FC -89.43%, rgba(241, 245, 252, 0) 19.33%)",
        header: "linear-gradient(180deg, #424344 0%, #232427 100%)",
        brown: "#2B2C31",
        table: "#212226",
        button: "#FFFFFF",
        buttontext: "#212226",
      },
      primary: {
        main: "#FFFFFF",
      },
      secondary: {
        main: "rgba(255, 255, 255, 0.5)",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#adb0bb",
      },
    },
    shadows: strongShadows,
  },
];

export const createThemeFun = (config = {}) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createTheme(
    _.merge({}, baseOptions, themeOptions, { direction: config.direction })
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};

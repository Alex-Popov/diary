//import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import './html-scale.module.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './global.css';

import { createMuiTheme } from '@material-ui/core/styles';
import themeVariables from './variables.module.css';


const themeConfig = createMuiTheme({
    breakpoints: {
        values: { // bootstrap
            xs: 0,
            sm: parseInt(themeVariables.sm, 10),
            md: parseInt(themeVariables.md, 10),
            lg: parseInt(themeVariables.lg, 10),
            xl: parseInt(themeVariables.xl, 10)
        },
        //up: key => `@media (min-width:${values[key]}px)`
    },
    palette: {
        primary: {
            main: themeVariables.colorPrimary
        },
        secondary: {
            main: themeVariables.colorSecondary
        },

        error: {
            main: themeVariables.colorError
        },
        warning: {
            main: themeVariables.colorWarning
        },
        info: {
            main: themeVariables.colorInfo
        },
        success: {
            main: themeVariables.colorSuccess
        },

        background: {
            default: themeVariables.colorBackgroundDefault
        },

        text: {
            primary: themeVariables.colorTextPrimary,
            secondary: themeVariables.colorTextSecondary,
            disabled: themeVariables.colorTextDisabled,
            hint: themeVariables.colorTextHint
        },
        divider: themeVariables.colorBorder
    },
    typography: {
        //fontSize: 12,
        h1: {
            fontSize: '2rem'
        },
        h2: {
            fontSize: '1.75rem'
        },
        h3: {
            fontSize: '1.5rem',
            //fontWeight: 300
        },
        h4: {
            fontSize: '1.2rem',
            //fontWeight: 300
        },
        h5: {
            fontSize: '1rem',
            //fontWeight: 300,
            //textTransform: 'uppercase'
        },
        h6: {
            fontSize: '0.875rem',
            //fontWeight: 300,
            //textTransform: 'uppercase'
        }
    }
});

themeConfig.overrides = {
    MuiDialog: {
        paper: {
            [themeConfig.breakpoints.down('sm')]: {
                width: '100% !important',
                height: '100%',
                margin: 0,
                maxWidth: '100% !important',
                maxHeight: 'none !important',
                borderRadius: 0
            }
        }
    },
    MuiDialogTitle: {
        root: {
            padding: `${themeVariables.p3} ${themeVariables.p4}`
        }
    },
    MuiDialogContent: {
        root: {
            padding: 0
        },
        dividers: {
            padding: 0
        }
    },
    MuiDialogActions: {
        root: {
            padding: `${themeVariables.p3} ${themeVariables.p4}`,
            [themeConfig.breakpoints.down('sm')]: {
                justifyContent: 'space-between'
            }
        }
    },
    MuiIconButton: {
        sizeSmall: {
            padding: 8
        }
    },
    MuiChip: {
        root: {
            height: '26px',
            fontSize: '0.7125rem',
            fontWeight: 500
        },
        label: {
            paddingLeft: '14px',
            paddingRight: '14px'
        }
    },
    MuiAlert: {
        filledInfo: {
            fontWeight: 400
        },
        filledWarning: {
            color: themeVariables.colorTextPrimary,
            fontWeight: 400
        },
        filledError: {
            fontWeight: 400
        },
        filledSuccess: {
            fontWeight: 400
        }
    },
    MuiListItemText: {
        primary: {
            fontSize: '0.875rem',
        }
    },
    MuiListItemIcon: {
        root: {
            minWidth: 0,
            marginRight: '1rem'
        }
    },
    MuiOutlinedInput: {
        root: {
//            padding: '10px 12px',
            backgroundColor: '#fff',
  /*          borderRadius: 'inherit'*/
        },
        adornedStart: {
            paddingLeft: 0
        },
        adornedEnd: {
            paddingRight: 0
        }
    },
/*    MuiInputAdornment: {
        positionStart: {
            marginRight: 0
        },
        positionEnd: {
            marginLeft: 0
        }
    },*/
    MuiButton: {
        root: {
            minWidth: 'none'
        },
        containedSizeLarge: {
            padding: '12px 22px'
        },
        outlinedSizeLarge: {
            padding: '12px 22px'
        }
    }
};


export {
    themeConfig,
    themeVariables
}
export default {
    config: themeConfig,
    variables: themeVariables
}
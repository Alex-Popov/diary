//import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import './html-scale.module.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './global.css';
import './global.module.css';

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

        divider: themeVariables.colorBorder,

        actions: {
            active: themeVariables.colorActionActive,
            hover: themeVariables.colorActionHover,
            selected: themeVariables.colorActionSelected,
            focus: themeVariables.colorActionFocus
        }
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
        },

        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.2,
            letterSpacing: 0
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: 1.2,
            letterSpacing: 0
        },

        overline: {
            fontSize: '0.7125rem'
        }
    },
    zIndex: {
        mobileStepper: parseInt(themeVariables.mobileStepper, 10),
        speedDial: parseInt(themeVariables.speedDial, 10),
        appBar: parseInt(themeVariables.appBar, 10),
        drawer: parseInt(themeVariables.drawer, 10),
        modal: parseInt(themeVariables.modal, 10),
        snackbar: parseInt(themeVariables.snackbar, 10),
        tooltip: parseInt(themeVariables.tooltip, 10)
    },
    shadows: [...Array(25).keys()].map(i => themeVariables['shadow'+i])
});


themeConfig.props = {
    MuiButtonBase: {
        disableRipple: true,
        disableTouchRipple: true
    }
}

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
        },
        spacing: {
            '@global': {
                ' > :not(:first-child)': {
                    marginLeft: themeVariables.p3
                }
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
            height: '20px',
            fontSize: '0.65rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            borderRadius: '3px',
            cursor: 'inherit'
        },
        label: {
            paddingLeft: '8px',
            paddingRight: '8px'
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
            backgroundColor: '#fff'
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
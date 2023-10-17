import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-scom-chart-data-source-setup', {
  $nest: {
    'i-input > input': {
      padding: '0.5rem 1rem'
    },
    '.capture-btn': {
      whiteSpace: 'nowrap'
    }
  }
})

export const comboBoxStyle = Styles.style({
  width: '100% !important',
  $nest: {
    '.selection': {
      width: '100% !important',
      maxWidth: '100%',
      padding: '0.5rem 1rem',
      color: Theme.input.fontColor,
      backgroundColor: Theme.input.background,
      borderRadius: 0
    },

    '.selection input': {
      color: 'inherit',
      backgroundColor: 'inherit',
      padding: 0
    },

    '.selection:focus-within': {
      backgroundColor: `darken(${Theme.input.background}, 20%)`
    },

    '> .icon-btn:hover': {
      backgroundColor: 'transparent'
    }
  }
})

export const uploadStyle = Styles.style({
  height: 'auto',
  width: '100%',
  margin: 0,
  $nest: {
    '> .i-upload-wrapper': {
      marginBottom: 0
    }
  }
});

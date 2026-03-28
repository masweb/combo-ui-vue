/**
 * App Reset by Ben Frain
 * https://github.com/benfrain/app-reset
 */

const RESET_ID = 'cui-reset'

// Minified app-reset
export const RESET_CSS = `:root{interpolate-size:allow-keywords;color-scheme:light dark}html{box-sizing:border-box;--fontStack:-apple-system,BlinkMacSystemFont,"Helvetica Neue","Segoe UI",Tahoma,Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Open Sans",sans-serif;font-family:var(--fontStack);-webkit-tap-highlight-color:transparent}*{user-select:none;box-sizing:inherit}*:before,*:after{box-sizing:inherit}body,h1,h2,h3,h4,h5,h6,p{margin:0;font-size:1rem;font-weight:400}a{text-decoration:none;color:inherit}b{font-weight:400}em,i{font-style:normal}a:focus,button:focus{outline:0}button{appearance:none;background-color:transparent;border:0;padding:0;text-align:inherit;font-family:inherit;font-weight:inherit;font-size:inherit;margin:0}button:hover{cursor:pointer}input,fieldset{appearance:none;border:0;padding:0;margin:0;min-width:0;font-size:inherit;font-family:inherit}input:focus{outline:0}input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{appearance:none}svg{display:block}img{max-width:100%;display:block}body{box-sizing:border-box}`

let injected = false

/**
 * Inject CSS Reset into the page
 */
export function injectReset(): void {
  if (injected) return
  if (typeof document === 'undefined') return

  const existing = document.getElementById(RESET_ID)
  if (existing) {
    injected = true
    return
  }

  const style = document.createElement('style')
  style.id = RESET_ID
  style.textContent = RESET_CSS
  document.head.appendChild(style)
  injected = true
}

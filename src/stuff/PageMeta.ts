export class PageMeta {
  secure: boolean

  // template parameters
  hideNavbar: boolean

  constructor({
    secure = true,
    hideNavbar = false
  }: {secure?: boolean, hideNavbar?: boolean} = {}) {
    this.secure = secure
    this.hideNavbar = hideNavbar
  }
}
export class PageMeta {
  secure: boolean

  // template parameters
  hideAllMenus: boolean

  constructor({
    secure = true,
    hideAllMenus = false
  }: {secure?: boolean, hideAllMenus?: boolean} = {}) {
    this.secure = secure
    this.hideAllMenus = hideAllMenus
  }
}
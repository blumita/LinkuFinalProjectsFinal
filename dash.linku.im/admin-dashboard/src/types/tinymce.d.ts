// TinyMCE type definitions
declare module '@tinymce/tinymce-vue' {
  import { DefineComponent } from 'vue'

  export interface BlobInfo {
    id: () => string
    name: () => string
    filename: () => string
    blob: () => Blob
    base64: () => string
    blobUri: () => string
    uri: () => string | undefined
  }

  export interface FilePickerMeta {
    filetype: string
    fieldname?: string
  }

  export interface TinyMCEEditor {
    id: string
    getContent: (options?: { format?: string }) => string
    setContent: (content: string, options?: { format?: string }) => string
    insertContent: (content: string) => void
    focus: () => void
    on: (event: string, callback: () => void) => void
    selection: {
      getContent: () => string
      setContent: (content: string) => void
    }
    dom: {
      remove: (element: Element) => void
    }
  }

  export interface TinyMCEConfig {
    height?: number
    language?: string
    directionality?: string
    plugins?: string[]
    toolbar?: string
    menubar?: boolean
    branding?: boolean
    statusbar?: boolean
    paste_data_images?: boolean
    automatic_uploads?: boolean
    file_picker_types?: string
    file_picker_callback?: (callback: (url: string) => void, value: string, meta: FilePickerMeta) => void
    images_upload_handler?: (blobInfo: BlobInfo, success: (url: string) => void, failure: (msg: string) => void, progress?: (percent: number) => void) => void
    content_style?: string
    setup?: (editor: TinyMCEEditor) => void
  }

  const Editor: DefineComponent<{
    modelValue?: string
    disabled?: boolean
    id?: string
    init?: TinyMCEConfig
    inline?: boolean
    plugins?: string | string[]
    tag_name?: string
    toolbar?: string | string[]
    value?: string
    'onUpdate:modelValue'?: (value: string) => void
  }>

  export { Editor }
  export default Editor
}

declare global {
  interface Window {
    tinymce: {
      init: (config: Record<string, unknown>) => void
      get: (id?: string) => unknown
      remove: (selector?: string) => void
    }
  }
}

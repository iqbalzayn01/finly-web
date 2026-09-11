export interface SelectOption<T = string> {
  value: T
  label: string
}

export type ModalType = 'info' | 'success' | 'warning' | 'error'

export interface FeedbackModalState {
  open: boolean
  type: ModalType
  title: string
  desc: string
}

export interface DeleteModalState {
  open: boolean
  id?: number | string
  name?: string
}

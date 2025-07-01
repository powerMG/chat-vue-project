export interface TransferOption {
  key: string
  label: string
  disabled: boolean
  id: string
  name: string
  title: string
  published: string,
  token_count_estimate: number
  type: string,
  docpath: string
}
export interface DocumentListState{
  key:string,
  state:string
}
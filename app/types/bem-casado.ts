export interface Recheio {
  id: string
  nome: string
  preco: number
  cor: string
  descricao: string
}

export interface Embalagem {
  id: string
  nome: string
  preco: number
  cor: string
  descricao: string
}

export interface BemCasado {
  recheio: Recheio | null
  embalagem: Embalagem | null
  quantidade: number
  observacoes: string
}

export interface ItemCarrinho {
  id: string
  recheio: Recheio
  embalagem: Embalagem
  quantidade: number
  observacoes: string
  subtotal: number
}

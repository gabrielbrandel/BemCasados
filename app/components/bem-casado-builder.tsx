"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Package, ShoppingCart, Sparkles, Plus, Trash2, Edit, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as UserType } from "../types/user"
import type { BemCasado, Recheio, Embalagem, ItemCarrinho } from "../types/bem-casado"

interface BemCasadoBuilderProps {
  user: UserType
}

export default function BemCasadoBuilder({ user }: BemCasadoBuilderProps) {
  const { toast } = useToast()
  const [bemCasado, setBemCasado] = useState<BemCasado>({
    recheio: null,
    embalagem: null,
    quantidade: 50,
    observacoes: "",
  })

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [editandoItem, setEditandoItem] = useState<string | null>(null)

  const carrinhoKey = `bem-casado-carrinho-${user.id}`

  // Carregar carrinho do localStorage
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem(carrinhoKey)
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo))
    }
  }, [carrinhoKey, user.id])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(carrinhoKey, JSON.stringify(carrinho))
  }, [carrinho, carrinhoKey])

  const recheios: Recheio[] = [
    {
      id: "doce-leite",
      nome: "Doce de Leite",
      preco: 2.5,
      cor: "#D2691E",
      descricao: "Cremoso doce de leite artesanal",
    },
    { id: "brigadeiro", nome: "Brigadeiro", preco: 2.8, cor: "#8B4513", descricao: "Brigadeiro com chocolate belga" },
    { id: "beijinho", nome: "Beijinho", preco: 2.7, cor: "#F5F5DC", descricao: "Beijinho com coco fresco" },
    { id: "nutella", nome: "Nutella", preco: 3.2, cor: "#654321", descricao: "Creme de avelã Nutella" },
    {
      id: "frutas-vermelhas",
      nome: "Frutas Vermelhas",
      preco: 3.5,
      cor: "#DC143C",
      descricao: "Geleia de frutas vermelhas",
    },
    { id: "limao", nome: "Limão", preco: 2.9, cor: "#FFFF00", descricao: "Curd de limão siciliano" },
  ]

  const embalagens: Embalagem[] = [
    { id: "simples", nome: "Simples", preco: 0.5, cor: "#E6E6FA", descricao: "Saquinho transparente com fita" },
    { id: "premium", nome: "Premium", preco: 1.2, cor: "#FFB6C1", descricao: "Caixinha personalizada com laço" },
    { id: "luxo", nome: "Luxo", preco: 2.0, cor: "#DDA0DD", descricao: "Caixa rígida com acabamento especial" },
    {
      id: "personalizada",
      nome: "Personalizada",
      preco: 2.5,
      cor: "#FF69B4",
      descricao: "Design exclusivo com nome dos noivos",
    },
  ]

  const adicionarAoCarrinho = () => {
    if (!bemCasado.recheio || !bemCasado.embalagem) {
      toast({
        title: "🚫 Seleção incompleta",
        description: "Por favor, selecione um recheio e uma embalagem!",
        variant: "destructive",
      })
      return
    }

    if (bemCasado.quantidade < 50) {
      toast({
        title: "⚠️ Quantidade inválida",
        description: "Quantidade mínima é de 50 unidades!",
        variant: "destructive",
      })
      return
    }

    const subtotal = (bemCasado.recheio.preco + bemCasado.embalagem.preco) * bemCasado.quantidade

    const novoItem: ItemCarrinho = {
      id: Date.now().toString(),
      recheio: bemCasado.recheio,
      embalagem: bemCasado.embalagem,
      quantidade: bemCasado.quantidade,
      observacoes: bemCasado.observacoes,
      subtotal,
    }

    setCarrinho([...carrinho, novoItem])

    // Reset do formulário
    setBemCasado({
      recheio: null,
      embalagem: null,
      quantidade: 50,
      observacoes: "",
    })

    toast({
      title: "✅ Item adicionado!",
      description: `${bemCasado.quantidade}x ${bemCasado.recheio.nome} + ${bemCasado.embalagem.nome}`,
    })
  }

  const removerDoCarrinho = (itemId: string) => {
    setCarrinho(carrinho.filter((item) => item.id !== itemId))
    toast({
      title: "🗑️ Item removido",
      description: "Item removido do carrinho.",
    })
  }

  const editarItem = (item: ItemCarrinho) => {
    setBemCasado({
      recheio: item.recheio,
      embalagem: item.embalagem,
      quantidade: item.quantidade,
      observacoes: item.observacoes,
    })
    setEditandoItem(item.id)
  }

  const salvarEdicao = () => {
    if (!bemCasado.recheio || !bemCasado.embalagem || !editandoItem) return

    const subtotal = (bemCasado.recheio.preco + bemCasado.embalagem.preco) * bemCasado.quantidade

    const carrinhoAtualizado = carrinho.map((item) =>
      item.id === editandoItem
        ? {
            ...item,
            recheio: bemCasado.recheio!,
            embalagem: bemCasado.embalagem!,
            quantidade: bemCasado.quantidade,
            observacoes: bemCasado.observacoes,
            subtotal,
          }
        : item,
    )

    setCarrinho(carrinhoAtualizado)
    setEditandoItem(null)

    // Reset do formulário
    setBemCasado({
      recheio: null,
      embalagem: null,
      quantidade: 50,
      observacoes: "",
    })

    toast({
      title: "✏️ Item atualizado!",
      description: "Item atualizado com sucesso.",
    })
  }

  const cancelarEdicao = () => {
    setEditandoItem(null)
    setBemCasado({
      recheio: null,
      embalagem: null,
      quantidade: 50,
      observacoes: "",
    })
  }

  const limparCarrinho = () => {
    setCarrinho([])
    toast({
      title: "🧹 Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    })
  }

  const calcularTotalCarrinho = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0)
  }

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      toast({
        title: "🛒 Carrinho vazio",
        description: "Adicione pelo menos um item ao carrinho!",
        variant: "destructive",
      })
      return
    }

    const pedido = {
      id: Date.now().toString(),
      usuario: user,
      itens: carrinho,
      total: calcularTotalCarrinho(),
      status: "Pendente",
      data: new Date().toISOString(),
    }

    // Salvar pedido no localStorage
    const pedidosExistentes = JSON.parse(localStorage.getItem("bem-casado-pedidos") || "[]")
    pedidosExistentes.push(pedido)
    localStorage.setItem("bem-casado-pedidos", JSON.stringify(pedidosExistentes))

    // Criar mensagem detalhada para WhatsApp
    let mensagem = `🍰 NOVO PEDIDO DE BEM CASADO 🍰

👤 Cliente: ${user.name}
📞 Telefone: ${user.telefone}
📧 Email: ${user.email}
📍 Endereço: ${user.endereco}

📦 ITENS DO PEDIDO:
`

    carrinho.forEach((item, index) => {
      mensagem += `
${index + 1}. ${item.recheio.nome} + ${item.embalagem.nome}
 Quantidade: ${item.quantidade} unidades
 Subtotal: R$ ${item.subtotal.toFixed(2)}`

      if (item.observacoes) {
        mensagem += `
 Obs: ${item.observacoes}`
      }
      mensagem += "\n"
    })

    mensagem += `
💰 VALOR TOTAL: R$ ${calcularTotalCarrinho().toFixed(2)}

🔢 Total de Unidades: ${carrinho.reduce((total, item) => total + item.quantidade, 0)}
`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem.trim())}`
    window.open(whatsappUrl, "_blank")

    toast({
      title: "🎉 Pedido enviado!",
      description: "Pedido enviado com sucesso via WhatsApp.",
    })

    // Limpar carrinho
    setCarrinho([])
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Título Compacto */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Monte seu Bem Casado</h2>
        <p className="text-sm text-gray-600">Crie diferentes combinações e adicione ao carrinho!</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Área de Montagem Visual - Compacta */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Preview Visual - Menor */}
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-pink-700 text-sm">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  {editandoItem ? "Editando" : "Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  {/* Base do bem casado */}
                  <div className="absolute inset-0 bg-yellow-100 rounded-full border-2 border-yellow-200 shadow-md">
                    {/* Recheio */}
                    {bemCasado.recheio && (
                      <div
                        className="absolute inset-2 rounded-full opacity-80 flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: bemCasado.recheio.cor }}
                      >
                        {bemCasado.recheio.nome.split(" ")[0]}
                      </div>
                    )}

                    {/* Embalagem */}
                    {bemCasado.embalagem && (
                      <div
                        className="absolute -inset-1 rounded-full border-4 opacity-60"
                        style={{ borderColor: bemCasado.embalagem.cor }}
                      />
                    )}
                  </div>

                  {/* Instruções */}
                  {!bemCasado.recheio && !bemCasado.embalagem && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center">
                      <div>
                        <Heart className="h-5 w-5 mx-auto mb-1" />
                        <p className="text-xs">Escolha recheio e embalagem</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badges Compactas */}
                {(bemCasado.recheio || bemCasado.embalagem) && (
                  <div className="space-y-1 text-center mb-3">
                    {bemCasado.recheio && (
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800 block">
                        {bemCasado.recheio.nome}
                      </Badge>
                    )}
                    {bemCasado.embalagem && (
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800 block">
                        {bemCasado.embalagem.nome}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Subtotal Compacto */}
                {bemCasado.recheio && bemCasado.embalagem && (
                  <div className="p-2 bg-pink-50 rounded text-center border border-pink-200">
                    <div className="text-sm font-bold text-pink-600">
                      R$ {((bemCasado.recheio.preco + bemCasado.embalagem.preco) * bemCasado.quantidade).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">{bemCasado.quantidade} un.</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configurações - Compactas */}
            <Card className="border-pink-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-pink-700">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <Label htmlFor="quantidade" className="text-xs text-gray-700">
                    Quantidade (mín. 50)
                  </Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="50"
                    value={bemCasado.quantidade}
                    onChange={(e) => setBemCasado({ ...bemCasado, quantidade: Number.parseInt(e.target.value) || 50 })}
                    className="h-8 text-sm border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-xs text-gray-700">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações..."
                    value={bemCasado.observacoes}
                    onChange={(e) => setBemCasado({ ...bemCasado, observacoes: e.target.value })}
                    className="h-16 text-sm border-pink-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                  />
                </div>

                <div className="flex gap-1">
                  {editandoItem ? (
                    <>
                      <Button
                        onClick={salvarEdicao}
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 h-8 text-xs"
                        disabled={!bemCasado.recheio || !bemCasado.embalagem}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        onClick={cancelarEdicao}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={adicionarAoCarrinho}
                      size="sm"
                      className="w-full bg-pink-500 hover:bg-pink-600 h-8 text-xs"
                      disabled={!bemCasado.recheio || !bemCasado.embalagem}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recheios - Grid Compacto */}
            <Card className="border-pink-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-pink-700 text-sm">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Recheios
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {recheios.map((recheio) => (
                    <button
                      key={recheio.id}
                      onClick={() => setBemCasado({ ...bemCasado, recheio })}
                      className={`p-2 rounded border-2 transition-all hover:scale-105 flex flex-col items-center gap-1 ${
                        bemCasado.recheio?.id === recheio.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: recheio.cor }} />
                      <div className="text-center">
                        <div className="text-xs font-medium">{recheio.nome}</div>
                        <div className="text-xs text-gray-500">R$ {recheio.preco.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Embalagens - Linha Horizontal */}
          <Card className="border-pink-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-pink-700 text-sm">
                <Package className="h-4 w-4 text-pink-500" />
                Embalagens
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2">
                {embalagens.map((embalagem) => (
                  <button
                    key={embalagem.id}
                    onClick={() => setBemCasado({ ...bemCasado, embalagem })}
                    className={`p-2 rounded border-2 transition-all hover:scale-105 flex flex-col items-center gap-1 ${
                      bemCasado.embalagem?.id === embalagem.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded border-2"
                      style={{ borderColor: embalagem.cor, backgroundColor: `${embalagem.cor}20` }}
                    />
                    <div className="text-center">
                      <div className="text-xs font-medium">{embalagem.nome}</div>
                      <div className="text-xs text-gray-500">+ R$ {embalagem.preco.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrinho - Compacto */}
        <div className="space-y-4">
          <Card className="border-pink-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-pink-700 text-sm">
                  <ShoppingCart className="h-4 w-4 text-pink-500" />
                  Carrinho ({carrinho.length})
                </CardTitle>
                {carrinho.length > 0 && (
                  <Button
                    onClick={limparCarrinho}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 h-6 text-xs px-2 bg-transparent"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {carrinho.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Carrinho vazio</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {carrinho.map((item) => (
                    <div key={item.id} className="border rounded p-2 space-y-2 border-pink-200">
                      <div>
                        <div className="font-medium text-xs">
                          {item.recheio.nome} + {item.embalagem.nome}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.quantidade} un. • R$ {item.subtotal.toFixed(2)}
                        </div>
                        {item.observacoes && <div className="text-xs text-gray-600 italic">"{item.observacoes}"</div>}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          onClick={() => editarItem(item)}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50 h-6 text-xs"
                          disabled={editandoItem !== null}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => removerDoCarrinho(item.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 h-6 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-2 border-pink-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Total:</span>
                      <span className="text-lg font-bold text-pink-600">R$ {calcularTotalCarrinho().toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {carrinho.reduce((total, item) => total + item.quantidade, 0)} unidades
                    </div>
                    <Button
                      onClick={finalizarPedido}
                      size="sm"
                      className="w-full bg-green-500 hover:bg-green-600 h-8 text-xs"
                    >
                      Finalizar via WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

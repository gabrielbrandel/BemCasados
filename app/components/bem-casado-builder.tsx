"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Package, ShoppingCart, Sparkles, Plus, Trash2, Edit, Save } from "lucide-react"
import type { User } from "../types/user"
import type { BemCasado, Recheio, Embalagem, ItemCarrinho } from "../types/bem-casado"

interface BemCasadoBuilderProps {
  user: User
}

export default function BemCasadoBuilder({ user }: BemCasadoBuilderProps) {
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
  }, [carrinhoKey])

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
      alert("Por favor, selecione um recheio e uma embalagem!")
      return
    }

    if (bemCasado.quantidade < 50) {
      alert("Quantidade mínima é de 50 unidades!")
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

    alert("Item adicionado ao carrinho!")
  }

  const removerDoCarrinho = (itemId: string) => {
    setCarrinho(carrinho.filter((item) => item.id !== itemId))
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

    alert("Item atualizado!")
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
    if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
      setCarrinho([])
    }
  }

  const calcularTotalCarrinho = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0)
  }

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      alert("Adicione pelo menos um item ao carrinho!")
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
    let mensagem = `🍰 *NOVO PEDIDO DE BEM CASADO* 🍰

👤 *Cliente:* ${user.name}
📞 *Telefone:* ${user.phone}
📧 *Email:* ${user.email}
📍 *Endereço:* ${user.endereco}

📦 *ITENS DO PEDIDO:*
`

    carrinho.forEach((item, index) => {
      mensagem += `
${index + 1}. *${item.recheio.nome}* + *${item.embalagem.nome}*
   Quantidade: ${item.quantidade} unidades
   Subtotal: R$ ${item.subtotal.toFixed(2)}`

      if (item.observacoes) {
        mensagem += `
   Obs: ${item.observacoes}`
      }
      mensagem += "\n"
    })

    mensagem += `
💰 *VALOR TOTAL: R$ ${calcularTotalCarrinho().toFixed(2)}*

🔢 *Total de Unidades:* ${carrinho.reduce((total, item) => total + item.quantidade, 0)}
    `

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem.trim())}`
    window.open(whatsappUrl, "_blank")

    alert("Pedido enviado com sucesso!")

    // Limpar carrinho
    setCarrinho([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Monte seu Bem Casado</h2>
        <p className="text-gray-600">Crie diferentes combinações e adicione ao carrinho!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Área de Montagem Visual */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                {editandoItem ? "Editando Item" : "Monte seu Bem Casado"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Base do bem casado */}
                <div className="absolute inset-0 bg-yellow-100 rounded-full border-4 border-yellow-200 shadow-lg">
                  {/* Recheio */}
                  {bemCasado.recheio && (
                    <div
                      className="absolute inset-4 rounded-full opacity-80 flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: bemCasado.recheio.cor }}
                    >
                      {bemCasado.recheio.nome}
                    </div>
                  )}

                  {/* Embalagem */}
                  {bemCasado.embalagem && (
                    <div
                      className="absolute -inset-2 rounded-full border-8 opacity-60"
                      style={{ borderColor: bemCasado.embalagem.cor }}
                    />
                  )}
                </div>

                {/* Instruções */}
                {!bemCasado.recheio && !bemCasado.embalagem && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center">
                    <div>
                      <Heart className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Escolha o recheio e embalagem</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do bem casado montado */}
              {(bemCasado.recheio || bemCasado.embalagem) && (
                <div className="space-y-2 text-center mb-6">
                  {bemCasado.recheio && (
                    <Badge variant="secondary" className="mr-2">
                      Recheio: {bemCasado.recheio.nome}
                    </Badge>
                  )}
                  {bemCasado.embalagem && <Badge variant="secondary">Embalagem: {bemCasado.embalagem.nome}</Badge>}
                </div>
              )}

              {/* Formulário de configuração */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantidade">Quantidade (mínimo 50)</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="50"
                    value={bemCasado.quantidade}
                    onChange={(e) => setBemCasado({ ...bemCasado, quantidade: Number.parseInt(e.target.value) || 50 })}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações para este item</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações específicas para esta combinação..."
                    value={bemCasado.observacoes}
                    onChange={(e) => setBemCasado({ ...bemCasado, observacoes: e.target.value })}
                  />
                </div>

                {bemCasado.recheio && bemCasado.embalagem && (
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <div className="text-lg font-bold text-pink-600">
                      Subtotal: R${" "}
                      {((bemCasado.recheio.preco + bemCasado.embalagem.preco) * bemCasado.quantidade).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">{bemCasado.quantidade} unidades</div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editandoItem ? (
                    <>
                      <Button
                        onClick={salvarEdicao}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        disabled={!bemCasado.recheio || !bemCasado.embalagem}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </Button>
                      <Button onClick={cancelarEdicao} variant="outline" className="flex-1 bg-transparent">
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={adicionarAoCarrinho}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                      disabled={!bemCasado.recheio || !bemCasado.embalagem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opções de Recheio e Embalagem */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recheios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Escolha o Recheio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {recheios.map((recheio) => (
                    <button
                      key={recheio.id}
                      onClick={() => setBemCasado({ ...bemCasado, recheio })}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-3 ${
                        bemCasado.recheio?.id === recheio.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: recheio.cor }} />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{recheio.nome}</div>
                        <div className="text-xs text-gray-500">R$ {recheio.preco.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Embalagens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-pink-500" />
                  Escolha a Embalagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {embalagens.map((embalagem) => (
                    <button
                      key={embalagem.id}
                      onClick={() => setBemCasado({ ...bemCasado, embalagem })}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-3 ${
                        bemCasado.embalagem?.id === embalagem.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border-4"
                        style={{ borderColor: embalagem.cor, backgroundColor: `${embalagem.cor}20` }}
                      />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{embalagem.nome}</div>
                        <div className="text-xs text-gray-500">+ R$ {embalagem.preco.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carrinho */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-pink-500" />
                  Carrinho ({carrinho.length})
                </CardTitle>
                {carrinho.length > 0 && (
                  <Button
                    onClick={limparCarrinho}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {carrinho.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seu carrinho está vazio</p>
                  <p className="text-sm">Adicione itens para continuar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrinho.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {item.recheio.nome} + {item.embalagem.nome}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.quantidade} unidades • R$ {item.subtotal.toFixed(2)}
                          </div>
                          {item.observacoes && (
                            <div className="text-xs text-gray-600 mt-1 italic">"{item.observacoes}"</div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => editarItem(item)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={editandoItem !== null}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => removerDoCarrinho(item.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">Total:</span>
                      <span className="text-2xl font-bold text-pink-600">R$ {calcularTotalCarrinho().toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {carrinho.reduce((total, item) => total + item.quantidade, 0)} unidades no total
                    </div>
                    <Button onClick={finalizarPedido} className="w-full bg-green-500 hover:bg-green-600">
                      Finalizar Pedido via WhatsApp
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

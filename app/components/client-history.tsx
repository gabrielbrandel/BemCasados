"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, XCircle, Eye, Repeat } from "lucide-react"
import type { User } from "../types/user"

interface Pedido {
  id: string
  usuario: {
    name: string
    email: string
    phone: string
    endereco: string
  }
  itens: Array<{
    recheio: { nome: string; preco: number }
    embalagem: { nome: string; preco: number }
    quantidade: number
    observacoes: string
    subtotal: number
  }>
  total: number
  status: string
  data: string
}

interface ClientHistoryProps {
  user: User
}

export default function ClientHistory({ user }: ClientHistoryProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  useEffect(() => {
    const todosPedidos = JSON.parse(localStorage.getItem("bem-casado-pedidos") || "[]")
    const meusPedidos = todosPedidos.filter((pedido: Pedido) => pedido.usuario.email === user.email)
    setPedidos(meusPedidos.sort((a: Pedido, b: Pedido) => new Date(b.data).getTime() - new Date(a.data).getTime()))
  }, [user.email])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmado":
        return "bg-blue-100 text-blue-800"
      case "Em Produção":
        return "bg-purple-100 text-purple-800"
      case "Pronto":
        return "bg-green-100 text-green-800"
      case "Entregue":
        return "bg-gray-100 text-gray-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Clock className="h-4 w-4" />
      case "Confirmado":
        return <CheckCircle className="h-4 w-4" />
      case "Em Produção":
        return <Package className="h-4 w-4" />
      case "Pronto":
        return <CheckCircle className="h-4 w-4" />
      case "Entregue":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelado":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const repetirPedido = (pedido: Pedido) => {
    // Salvar itens do pedido no carrinho
    const carrinhoKey = `bem-casado-carrinho-${user.id}`
    const carrinhoAtual = JSON.parse(localStorage.getItem(carrinhoKey) || "[]")

    const novosItens = pedido.itens.map((item) => ({
      id: Date.now().toString() + Math.random(),
      recheio: item.recheio,
      embalagem: item.embalagem,
      quantidade: item.quantidade,
      observacoes: item.observacoes,
      subtotal: item.subtotal,
    }))

    localStorage.setItem(carrinhoKey, JSON.stringify([...carrinhoAtual, ...novosItens]))

    alert("Itens adicionados ao carrinho! Vá para 'Montar Bem Casado' para finalizar.")
  }

  const calcularEstatisticas = () => {
    const totalPedidos = pedidos.length
    const totalGasto = pedidos.reduce((total, pedido) => total + pedido.total, 0)
    const totalUnidades = pedidos.reduce(
      (total, pedido) => total + pedido.itens.reduce((subtotal, item) => subtotal + item.quantidade, 0),
      0,
    )
    const pedidosEntregues = pedidos.filter((p) => p.status === "Entregue").length

    return { totalPedidos, totalGasto, totalUnidades, pedidosEntregues }
  }

  const stats = calcularEstatisticas()

  if (pedidoSelecionado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setPedidoSelecionado(null)} className="mb-4">
            ← Voltar aos Pedidos
          </Button>
          <h2 className="text-3xl font-bold text-gray-800">Detalhes do Pedido #{pedidoSelecionado.id.slice(-6)}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pedido #{pedidoSelecionado.id.slice(-6)}</CardTitle>
                    <CardDescription>
                      {new Date(pedidoSelecionado.data).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedidoSelecionado.data).toLocaleTimeString("pt-BR")}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(pedidoSelecionado.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(pedidoSelecionado.status)}
                      {pedidoSelecionado.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Itens do Pedido</h4>
                  {pedidoSelecionado.itens.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">
                            {item.recheio.nome} + {item.embalagem.nome}
                          </h5>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantidade} unidades</p>
                          {item.observacoes && (
                            <p className="text-sm text-gray-600 italic mt-1">Obs: {item.observacoes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">R$ {item.subtotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            R$ {(item.recheio.preco + item.embalagem.preco).toFixed(2)} cada
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total de Itens:</span>
                  <span>{pedidoSelecionado.itens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Unidades:</span>
                  <span>{pedidoSelecionado.itens.reduce((total, item) => total + item.quantidade, 0)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {pedidoSelecionado.total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => repetirPedido(pedidoSelecionado)}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  Repetir Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Meus Pedidos</h2>
        <p className="text-gray-600">Acompanhe o status dos seus pedidos e histórico de compras</p>
      </div>

      {/* Estatísticas do Cliente */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPedidos}</p>
              </div>
              <Package className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats.totalGasto.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bem Casados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUnidades}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pedidosEntregues}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Você ainda não fez nenhum pedido</p>
              <p className="text-sm text-gray-400">Que tal criar seu primeiro bem casado personalizado?</p>
            </CardContent>
          </Card>
        ) : (
          pedidos.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Pedido #{pedido.id.slice(-6)}</CardTitle>
                    <CardDescription>
                      {new Date(pedido.data).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedido.data).toLocaleTimeString("pt-BR")}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(pedido.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(pedido.status)}
                      {pedido.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Itens:</strong> {pedido.itens.length} tipo(s) diferentes
                      </p>
                      <p>
                        <strong>Quantidade Total:</strong>{" "}
                        {pedido.itens.reduce((total, item) => total + item.quantidade, 0)} unidades
                      </p>
                      <p>
                        <strong>Valor:</strong>{" "}
                        <span className="text-green-600 font-bold">R$ {pedido.total.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Principais Itens</h4>
                    <div className="space-y-1 text-sm">
                      {pedido.itens.slice(0, 2).map((item, index) => (
                        <p key={index} className="text-gray-600">
                          • {item.recheio.nome} + {item.embalagem.nome} ({item.quantidade}x)
                        </p>
                      ))}
                      {pedido.itens.length > 2 && (
                        <p className="text-gray-500 italic">+ {pedido.itens.length - 2} item(s) adicional(is)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={() => setPedidoSelecionado(pedido)} variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button onClick={() => repetirPedido(pedido)} variant="outline" size="sm" className="flex-1">
                    <Repeat className="h-4 w-4 mr-2" />
                    Repetir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

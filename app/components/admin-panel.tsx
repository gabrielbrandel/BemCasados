"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Users, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

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

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")

  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem("bem-casado-pedidos") || "[]")
    setPedidos(pedidosSalvos)
  }, [])

  const atualizarStatus = (pedidoId: string, novoStatus: string) => {
    const pedidosAtualizados = pedidos.map((pedido) =>
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido,
    )
    setPedidos(pedidosAtualizados)
    localStorage.setItem("bem-casado-pedidos", JSON.stringify(pedidosAtualizados))
  }

  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtroStatus === "todos" || pedido.status.toLowerCase() === filtroStatus,
  )

  const estatisticas = {
    totalPedidos: pedidos.length,
    pedidosPendentes: pedidos.filter((p) => p.status === "Pendente").length,
    pedidosConfirmados: pedidos.filter((p) => p.status === "Confirmado").length,
    faturamentoTotal: pedidos.reduce((total, pedido) => total + pedido.total, 0),
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h2>
        <p className="text-gray-600">Gerencie todos os pedidos de bem casado</p>
      </div>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPedidos}</p>
              </div>
              <Package className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticas.pedidosPendentes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmados</p>
                <p className="text-2xl font-bold text-blue-600">{estatisticas.pedidosConfirmados}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faturamento</p>
                <p className="text-2xl font-bold text-green-600">R$ {estatisticas.faturamentoTotal.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Pedidos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="confirmado">Confirmados</SelectItem>
            <SelectItem value="em produção">Em Produção</SelectItem>
            <SelectItem value="pronto">Prontos</SelectItem>
            <SelectItem value="entregue">Entregues</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </CardContent>
          </Card>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id}>
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
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Dados do Cliente
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Nome:</strong> {pedido.usuario.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {pedido.usuario.email}
                      </p>
                      <p>
                        <strong>Telefone:</strong> {pedido.usuario.phone}
                      </p>
                      <p>
                        <strong>Endereço:</strong> {pedido.usuario.endereco}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Itens do Pedido
                    </h4>
                    <div className="space-y-2 text-sm">
                      {pedido.itens.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <p>
                            <strong>{item.recheio.nome}</strong> + <strong>{item.embalagem.nome}</strong>
                          </p>
                          <p>Quantidade: {item.quantidade} unidades</p>
                          <p>
                            Subtotal: <span className="text-green-600 font-bold">R$ {item.subtotal.toFixed(2)}</span>
                          </p>
                          {item.observacoes && <p className="text-gray-600 italic">Obs: {item.observacoes}</p>}
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <p>
                          <strong>Total Geral:</strong>{" "}
                          <span className="text-green-600 font-bold">R$ {pedido.total.toFixed(2)}</span>
                        </p>
                        <p>
                          <strong>Total de Unidades:</strong>{" "}
                          {pedido.itens.reduce((total, item) => total + item.quantidade, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {pedido.bemCasado.observacoes && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Observações:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{pedido.bemCasado.observacoes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Select value={pedido.status} onValueChange={(novoStatus) => atualizarStatus(pedido.id, novoStatus)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                      <SelectItem value="Em Produção">Em Produção</SelectItem>
                      <SelectItem value="Pronto">Pronto</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

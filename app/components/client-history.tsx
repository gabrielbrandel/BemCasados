"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Eye, Package, Calendar, DollarSign, ArrowLeft } from "lucide-react"
import type { User } from "../types/user"

interface Pedido {
  id: string
  usuario: User
  itens: Array<{
    id: string
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
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem("bem-casado-pedidos")
    if (pedidosSalvos) {
      const todosPedidos = JSON.parse(pedidosSalvos)
      const pedidosDoUsuario = todosPedidos.filter((pedido: Pedido) => pedido.usuario.id === user.id)
      setPedidos(pedidosDoUsuario.reverse()) // Mais recentes primeiro
    }
  }, [user.id])

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmado":
        return "bg-blue-100 text-blue-800"
      case "Em Produção":
        return "bg-orange-100 text-orange-800"
      case "Pronto":
        return "bg-green-100 text-green-800"
      case "Entregue":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="border-pink-300 text-pink-600 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>
          <p className="text-gray-600">Histórico de pedidos de {user.name}</p>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido.</p>
            <Button onClick={() => window.history.back()} className="bg-pink-500 hover:bg-pink-600">
              Fazer Primeiro Pedido
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="border-pink-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">Pedido #{pedido.id.slice(-6)}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatarData(pedido.data)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        R$ {pedido.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(pedido.status)}>{pedido.status}</Badge>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent"
                        onClick={() => setPedidoSelecionado(pedido)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
                      <DialogHeader className="flex-shrink-0 pb-4">
                        <DialogTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-pink-500" />
                          Pedido #{pedidoSelecionado?.id.slice(-6)}
                        </DialogTitle>
                        {pedidoSelecionado && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatarData(pedidoSelecionado.data)}</span>
                            <Badge className={getStatusColor(pedidoSelecionado.status)}>
                              {pedidoSelecionado.status}
                            </Badge>
                          </div>
                        )}
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto min-h-0">
                        <ScrollArea className="h-full pr-4">
                          {pedidoSelecionado && (
                            <div className="space-y-3">
                              {/* Itens do Pedido - Compacto */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                  Itens ({pedidoSelecionado.itens.length})
                                </h4>
                                <div className="space-y-2">
                                  {pedidoSelecionado.itens.map((item, index) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-2 bg-pink-50 rounded border"
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-800">
                                          {item.recheio.nome} + {item.embalagem.nome}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {item.quantidade}x R$ {(item.recheio.preco + item.embalagem.preco).toFixed(2)}
                                          {item.observacoes && ` • ${item.observacoes}`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-pink-600 text-sm">R$ {item.subtotal.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                      </div>

                      {/* Total do Pedido - Sempre Visível no Footer */}
                      <div className="flex-shrink-0 bg-gradient-to-r from-pink-100 to-rose-100 border-t-2 border-pink-300 p-4 rounded-b-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-gray-800">Total do Pedido</p>
                            <p className="text-sm text-gray-600">
                              {pedidoSelecionado?.itens.reduce((total, item) => total + item.quantidade, 0)} unidades
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-pink-600">R$ {pedidoSelecionado?.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

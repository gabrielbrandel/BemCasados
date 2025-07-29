"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, History } from "lucide-react"
import type { User } from "../types/user"

interface ClientHistoryProps {
  user: User
}

export default function ClientHistory({ user }: ClientHistoryProps) {
  const [pedidos, setPedidos] = useState<any[]>([])

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem("bem-casado-pedidos")
    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos))
    }
  }, [])

  const meusPedidos = pedidos.filter((pedido) => pedido.usuario.id === user.id)

  const totalGasto = meusPedidos.reduce((total, pedido) => total + pedido.total, 0)
  const totalBemCasados = meusPedidos.reduce(
    (total, pedido) => total + pedido.itens.reduce((totalItens: number, item: any) => totalItens + item.quantidade, 0),
    0,
  )
  const pedidosEntregues = meusPedidos.filter((p) => p.status === "entregue").length

  const repetirPedido = (pedido: any) => {
    // Adicionar itens ao carrinho
    const carrinhoKey = `bem-casado-carrinho-${user.id}`
    const carrinhoAtual = JSON.parse(localStorage.getItem(carrinhoKey) || "[]")

    const itensParaAdicionar = pedido.itens.map((item: any) => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(),
    }))

    const novoCarrinho = [...carrinhoAtual, ...itensParaAdicionar]
    localStorage.setItem(carrinhoKey, JSON.stringify(novoCarrinho))

    alert("Itens adicionados ao carrinho! Vá para 'Montar Bem Casado' para finalizar.")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Meus Pedidos</h2>
        <p className="text-gray-600">Acompanhe o status dos seus pedidos e histórico de compras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-pink-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{meusPedidos.length}</div>
            <div className="text-sm text-gray-600">Total de Pedidos</div>
          </CardContent>
        </Card>
        <Card className="border-pink-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">R$ {totalGasto.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Gasto</div>
          </CardContent>
        </Card>
        <Card className="border-pink-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-pink-600">{totalBemCasados}</div>
            <div className="text-sm text-gray-600">Bem Casados</div>
          </CardContent>
        </Card>
        <Card className="border-pink-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{pedidosEntregues}</div>
            <div className="text-sm text-gray-600">Entregas</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700 flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meusPedidos.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido</p>
              <p className="text-sm text-gray-400">Que tal montar seu primeiro bem casado?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meusPedidos.map((pedido) => (
                <div key={pedido.id} className="border rounded p-4 border-pink-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Pedido #{pedido.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.data).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(pedido.data).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          pedido.status === "entregue"
                            ? "default"
                            : pedido.status === "producao"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          pedido.status === "entregue"
                            ? "bg-green-100 text-green-800"
                            : pedido.status === "producao"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {pedido.status === "pendente"
                          ? "Pendente"
                          : pedido.status === "producao"
                            ? "Em Produção"
                            : "Entregue"}
                      </Badge>
                      <p className="font-bold mt-1 text-pink-600">R$ {pedido.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {pedido.itens.reduce((total: number, item: any) => total + item.quantidade, 0)} bem casados
                  </div>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-pink-600 hover:underline">Ver detalhes</summary>
                    <div className="mt-2 space-y-1">
                      {pedido.itens.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.quantidade}x {item.recheio.nome} + {item.embalagem.nome}
                          </span>
                          <span>R$ {item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </details>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => repetirPedido(pedido)}
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      🔄 Repetir Pedido
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

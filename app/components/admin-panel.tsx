"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, XCircle, Trash2, Settings } from "lucide-react"

interface Pedido {
  id: string
  usuario: {
    id: string
    nome: string
    email: string
    telefone: string
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
  const [busca, setBusca] = useState("")
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null)

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem("bem-casado-pedidos")
    if (pedidosSalvos) {
      const todosPedidos = JSON.parse(pedidosSalvos)
      setPedidos(todosPedidos.sort((a: Pedido, b: Pedido) => new Date(b.data).getTime() - new Date(a.data).getTime()))
    }
  }, [])

  const atualizarStatusPedido = (pedidoId: string, novoStatus: "pendente" | "producao" | "entregue") => {
    const pedidosAtualizados = pedidos.map((pedido) =>
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido,
    )
    setPedidos(pedidosAtualizados)
    localStorage.setItem("bem-casado-pedidos", JSON.stringify(pedidosAtualizados))
  }

  const excluirPedido = (pedidoId: string) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      const pedidosAtualizados = pedidos.filter((pedido) => pedido.id !== pedidoId)
      setPedidos(pedidosAtualizados)
      localStorage.setItem("bem-casado-pedidos", JSON.stringify(pedidosAtualizados))
    }
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchStatus = filtroStatus === "todos" || pedido.status.toLowerCase() === filtroStatus.toLowerCase()
    const matchBusca =
      busca === "" ||
      pedido.usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.id.includes(busca) ||
      pedido.usuario.email.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "producao":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "entregue":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />
      case "producao":
        return <Package className="h-4 w-4" />
      case "entregue":
        return <CheckCircle className="h-4 w-4" />
      case "cancelado":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const exportarDados = () => {
    const dadosExport = pedidos.map((pedido) => ({
      id: pedido.id,
      cliente: pedido.usuario.nome,
      email: pedido.usuario.email,
      telefone: pedido.usuario.telefone,
      total: pedido.total,
      status: pedido.status,
      data: new Date(pedido.data).toLocaleDateString("pt-BR"),
      itens: pedido.itens.length,
      unidades: pedido.itens.reduce((total, item) => total + item.quantidade, 0),
    }))

    const csv = [
      "ID,Cliente,Email,Telefone,Total,Status,Data,Itens,Unidades",
      ...dadosExport.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pedidos-bem-casados-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (pedidoSelecionado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setPedidoSelecionado(null)}
            className="mb-4 border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            ← Voltar aos Pedidos
          </Button>
          <h2 className="text-3xl font-bold text-gray-800">Detalhes do Pedido #{pedidoSelecionado.id.slice(-6)}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-pink-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-pink-700">Pedido #{pedidoSelecionado.id.slice(-6)}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(pedidoSelecionado.data).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedidoSelecionado.data).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(pedidoSelecionado.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(pedidoSelecionado.status)}
                      {pedidoSelecionado.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Informações do Cliente */}
                  <div>
                    <h4 className="font-semibold text-lg text-pink-700 mb-3">Informações do Cliente</h4>
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Nome</p>
                          <p className="font-medium">{pedidoSelecionado.usuario.nome}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{pedidoSelecionado.usuario.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Telefone</p>
                          <p className="font-medium">{pedidoSelecionado.usuario.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Endereço</p>
                          <p className="font-medium">{pedidoSelecionado.usuario.endereco}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div>
                    <h4 className="font-semibold text-lg text-pink-700 mb-3">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {pedidoSelecionado.itens.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 border-pink-200 bg-pink-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800">
                                {item.recheio.nome} + {item.embalagem.nome}
                              </h5>
                              <p className="text-sm text-gray-600">Quantidade: {item.quantidade} unidades</p>
                              <p className="text-sm text-gray-600">
                                Preço unitário: R$ {(item.recheio.preco + item.embalagem.preco).toFixed(2)}
                              </p>
                              {item.observacoes && (
                                <p className="text-sm text-gray-600 italic mt-1">Obs: {item.observacoes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-pink-600 text-lg">R$ {item.subtotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Resumo */}
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total de Itens:</span>
                  <span className="font-medium">{pedidoSelecionado.itens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Unidades:</span>
                  <span className="font-medium">
                    {pedidoSelecionado.itens.reduce((total, item) => total + item.quantidade, 0)}
                  </span>
                </div>
                <div className="border-t pt-4 border-pink-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-pink-600">R$ {pedidoSelecionado.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={pedidoSelecionado.status === "pendente" ? "default" : "outline"}
                    onClick={() => atualizarStatusPedido(pedidoSelecionado.id, "pendente")}
                    className={
                      pedidoSelecionado.status === "pendente"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                    }
                  >
                    Pendente
                  </Button>
                  <Button
                    size="sm"
                    variant={pedidoSelecionado.status === "producao" ? "default" : "outline"}
                    onClick={() => atualizarStatusPedido(pedidoSelecionado.id, "producao")}
                    className={
                      pedidoSelecionado.status === "producao"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "border-blue-300 text-blue-600 hover:bg-blue-50"
                    }
                  >
                    Produção
                  </Button>
                  <Button
                    size="sm"
                    variant={pedidoSelecionado.status === "entregue" ? "default" : "outline"}
                    onClick={() => atualizarStatusPedido(pedidoSelecionado.id, "entregue")}
                    className={
                      pedidoSelecionado.status === "entregue"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }
                  >
                    Entregue
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => excluirPedido(pedidoSelecionado.id)}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Pedido
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
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-pink-500" />
          <h2 className="text-3xl font-bold text-gray-800">Painel Administrativo</h2>
        </div>
        <p className="text-gray-600">Gerencie todos os pedidos e acompanhe as vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card
          className={`border-pink-200 cursor-pointer transition-all hover:shadow-md ${
            filtroAtivo === "pendente" ? "ring-2 ring-orange-500 bg-orange-50" : ""
          }`}
          onClick={() => setFiltroAtivo(filtroAtivo === "pendente" ? null : "pendente")}
        >
          <CardContent className="p-6 text-center">
            <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {pedidos.filter((p) => p.status === "pendente").length}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>

        <Card
          className={`border-pink-200 cursor-pointer transition-all hover:shadow-md ${
            filtroAtivo === "producao" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          }`}
          onClick={() => setFiltroAtivo(filtroAtivo === "producao" ? null : "producao")}
        >
          <CardContent className="p-6 text-center">
            <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {pedidos.filter((p) => p.status === "producao").length}
            </div>
            <div className="text-sm text-gray-600">Em Produção</div>
          </CardContent>
        </Card>

        <Card
          className={`border-pink-200 cursor-pointer transition-all hover:shadow-md ${
            filtroAtivo === "entregue" ? "ring-2 ring-green-500 bg-green-50" : ""
          }`}
          onClick={() => setFiltroAtivo(filtroAtivo === "entregue" ? null : "entregue")}
        >
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {pedidos.filter((p) => p.status === "entregue").length}
            </div>
            <div className="text-sm text-gray-600">Entregues</div>
          </CardContent>
        </Card>

        <Card
          className={`border-pink-200 cursor-pointer transition-all hover:shadow-md ${
            filtroAtivo === "outros" ? "ring-2 ring-red-500 bg-red-50" : ""
          }`}
          onClick={() => setFiltroAtivo(filtroAtivo === "outros" ? null : "outros")}
        >
          <CardContent className="p-6 text-center">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {pedidos.filter((p) => !["pendente", "producao", "entregue"].includes(p.status)).length}
            </div>
            <div className="text-sm text-gray-600">Outros</div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              R$ {pedidos.reduce((total, pedido) => total + pedido.total, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Vendas</div>
          </CardContent>
        </Card>
      </div>

      {filtroAtivo && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Filtro ativo:{" "}
              {filtroAtivo === "pendente"
                ? "Pendentes"
                : filtroAtivo === "producao"
                  ? "Em Produção"
                  : filtroAtivo === "entregue"
                    ? "Entregues"
                    : "Outros Status"}
            </Badge>
            <span className="text-sm text-gray-600">
              (
              {
                (filtroAtivo === "outros"
                  ? pedidos.filter((p) => !["pendente", "producao", "entregue"].includes(p.status))
                  : pedidos.filter((p) => p.status === filtroAtivo)
                ).length
              }{" "}
              pedidos)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroAtivo(null)}
            className="text-gray-600 hover:text-gray-800"
          >
            Limpar Filtro
          </Button>
        </div>
      )}

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciar Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(filtroAtivo
              ? pedidos.filter((pedido) => {
                  if (filtroAtivo === "outros") {
                    return !["pendente", "producao", "entregue"].includes(pedido.status)
                  }
                  return pedido.status === filtroAtivo
                })
              : pedidos
            ).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} className="border rounded p-4 border-pink-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Pedido #{pedido.id}</p>
                      <p className="text-sm text-gray-600">Cliente: {pedido.usuario.nome}</p>
                      <p className="text-sm text-gray-600">Telefone: {pedido.usuario.telefone}</p>
                      <p className="text-sm text-gray-600">Endereço: {pedido.usuario.endereco}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.data).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(pedido.data).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">R$ {pedido.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {pedido.itens.reduce((total: number, item: any) => total + item.quantidade, 0)} itens
                      </p>
                    </div>
                  </div>

                  <details className="text-sm mb-3">
                    <summary className="cursor-pointer text-pink-600 hover:underline">Ver itens</summary>
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

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={pedido.status === "pendente" ? "default" : "outline"}
                      onClick={() => atualizarStatusPedido(pedido.id, "pendente")}
                      className={
                        pedido.status === "pendente"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                      }
                    >
                      Pendente
                    </Button>
                    <Button
                      size="sm"
                      variant={pedido.status === "producao" ? "default" : "outline"}
                      onClick={() => atualizarStatusPedido(pedido.id, "producao")}
                      className={
                        pedido.status === "producao"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }
                    >
                      Produção
                    </Button>
                    <Button
                      size="sm"
                      variant={pedido.status === "entregue" ? "default" : "outline"}
                      onClick={() => atualizarStatusPedido(pedido.id, "entregue")}
                      className={
                        pedido.status === "entregue"
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }
                    >
                      Entregue
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

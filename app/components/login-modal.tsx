"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Mail, Phone, MapPin, Lock } from "lucide-react"
import type { User as UserType } from "../types/user"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginData, setLoginData] = useState({ email: "", senha: "" })
  const [cadastroData, setCadastroData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar credenciais de admin
    if (loginData.email === "admin@doceamor.com" && loginData.senha === "admin123") {
      const adminUser: UserType = {
        id: "admin",
        name: "Administrador",
        nome: "Administrador",
        email: "admin@doceamor.com",
        telefone: "(11) 99999-9999",
        endereco: "São Paulo, SP",
        isAdmin: true,
      }
      onLogin(adminUser)
      return
    }

    // Verificar usuários salvos
    const usuarios = JSON.parse(localStorage.getItem("bem-casado-usuarios") || "[]")
    const usuario = usuarios.find((u: any) => u.email === loginData.email && u.senha === loginData.senha)

    if (usuario) {
      onLogin(usuario)
    } else {
      alert("Email ou senha incorretos!")
    }
  }

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !cadastroData.nome ||
      !cadastroData.email ||
      !cadastroData.telefone ||
      !cadastroData.endereco ||
      !cadastroData.senha
    ) {
      alert("Por favor, preencha todos os campos!")
      return
    }

    // Verificar se email já existe
    const usuarios = JSON.parse(localStorage.getItem("bem-casado-usuarios") || "[]")
    const emailExiste = usuarios.find((u: any) => u.email === cadastroData.email)

    if (emailExiste) {
      alert("Este email já está cadastrado!")
      return
    }

    // Criar novo usuário
    const novoUsuario: UserType = {
      id: Date.now().toString(),
      name: cadastroData.nome,
      nome: cadastroData.nome,
      email: cadastroData.email,
      telefone: cadastroData.telefone,
      endereco: cadastroData.endereco,
      isAdmin: false,
    }

    // Salvar usuário (incluindo senha para login)
    const usuarioComSenha = { ...novoUsuario, senha: cadastroData.senha }
    usuarios.push(usuarioComSenha)
    localStorage.setItem("bem-casado-usuarios", JSON.stringify(usuarios))

    onLogin(novoUsuario)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pink-700">
            <Heart className="h-6 w-6 text-pink-500" />
            Bem-vindo à Doce Amor
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-center text-pink-700">Fazer Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-pink-500" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-senha" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-pink-500" />
                      Senha
                    </Label>
                    <Input
                      id="login-senha"
                      type="password"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                    Entrar
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Credenciais de teste:</p>
                  <p>
                    <strong>Admin:</strong> admin@doceamor.com / admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cadastro">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-center text-pink-700">Criar Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div>
                    <Label htmlFor="cadastro-nome" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-pink-500" />
                      Nome Completo
                    </Label>
                    <Input
                      id="cadastro-nome"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({ ...cadastroData, nome: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cadastro-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-pink-500" />
                      Email
                    </Label>
                    <Input
                      id="cadastro-email"
                      type="email"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({ ...cadastroData, email: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cadastro-telefone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-500" />
                      Telefone
                    </Label>
                    <Input
                      id="cadastro-telefone"
                      value={cadastroData.telefone}
                      onChange={(e) => setCadastroData({ ...cadastroData, telefone: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cadastro-endereco" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-pink-500" />
                      Endereço
                    </Label>
                    <Input
                      id="cadastro-endereco"
                      value={cadastroData.endereco}
                      onChange={(e) => setCadastroData({ ...cadastroData, endereco: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Rua, número, bairro, cidade"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cadastro-senha" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-pink-500" />
                      Senha
                    </Label>
                    <Input
                      id="cadastro-senha"
                      type="password"
                      value={cadastroData.senha}
                      onChange={(e) => setCadastroData({ ...cadastroData, senha: e.target.value })}
                      className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                    Criar Conta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

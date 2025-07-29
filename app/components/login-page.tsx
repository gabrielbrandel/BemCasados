"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoginModal from "./login-modal"
import type { User } from "../types/user"

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-800 mb-4">🍰 Bem Casados Artesanais</h1>
          <p className="text-xl text-gray-600 mb-2">Sabores únicos para momentos especiais</p>
          <p className="text-lg text-gray-500">Personalize, peça e receba em casa</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold mb-2">Personalize</h3>
              <p className="text-gray-600">Escolha recheios e embalagens do seu jeito</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Peça Fácil</h3>
              <p className="text-gray-600">Envie seu pedido direto pelo WhatsApp</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold mb-2">Receba em Casa</h3>
              <p className="text-gray-600">Entregamos fresquinhos na sua porta</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Pronto para começar?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Faça login ou cadastre-se para montar seus bem casados personalizados</p>
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => setShowModal(true)}>
              Entrar / Cadastrar
            </Button>
          </CardContent>
        </Card>
      </div>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} onLogin={onLogin} />
    </div>
  )
}

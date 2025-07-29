"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Package, Phone, Mail, MapPin, Star, Award, History } from "lucide-react"
import LoginModal from "./components/login-modal"
import AdminPanel from "./components/admin-panel"
import BemCasadoBuilder from "./components/bem-casado-builder"
import ClientHistory from "./components/client-history"
import type { User } from "./types/user"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<"landing" | "builder" | "admin" | "history">("landing")
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("bem-casado-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("bem-casado-user", JSON.stringify(userData))
    setShowLoginModal(false)
    setCurrentPage("builder")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("bem-casado-user")
    // Limpar carrinho ao fazer logout
    localStorage.removeItem(`bem-casado-carrinho-${user?.id}`)
    setCurrentPage("landing")
  }

  const handleStartBuilding = () => {
    if (user) {
      setCurrentPage("builder")
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-pink-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("landing")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Heart className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Doce Amor</h1>
                <p className="text-sm text-gray-600">Bem Casados Artesanais</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentPage("landing")}
                className={`text-gray-600 hover:text-pink-500 transition-colors ${
                  currentPage === "landing" ? "text-pink-500 font-medium" : ""
                }`}
              >
                Início
              </button>
              {user && (
                <>
                  <button
                    onClick={() => setCurrentPage("builder")}
                    className={`text-gray-600 hover:text-pink-500 transition-colors ${
                      currentPage === "builder" ? "text-pink-500 font-medium" : ""
                    }`}
                  >
                    Montar Bem Casado
                  </button>
                  <button
                    onClick={() => setCurrentPage("history")}
                    className={`text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-1 ${
                      currentPage === "history" ? "text-pink-500 font-medium" : ""
                    }`}
                  >
                    <History className="h-4 w-4" />
                    Meus Pedidos
                  </button>
                </>
              )}
              {user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage("admin")}
                  className={`text-gray-600 hover:text-pink-500 transition-colors ${
                    currentPage === "admin" ? "text-pink-500 font-medium" : ""
                  }`}
                >
                  Painel Admin
                </button>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Olá, {user.name}!</span>
                  <Button variant="outline" onClick={handleLogout} size="sm">
                    Sair
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowLoginModal(true)} className="bg-pink-500 hover:bg-pink-600">
                  Entrar / Cadastrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {user && (
        <div className="md:hidden bg-white border-b border-pink-200 px-4 py-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCurrentPage("builder")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                currentPage === "builder" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Montar
            </button>
            <button
              onClick={() => setCurrentPage("history")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                currentPage === "history" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <History className="h-3 w-3" />
              Pedidos
            </button>
            {user.isAdmin && (
              <button
                onClick={() => setCurrentPage("admin")}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  currentPage === "admin" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      {currentPage === "landing" && <LandingPage onStartBuilding={handleStartBuilding} />}
      {currentPage === "builder" && user && <BemCasadoBuilder user={user} />}
      {currentPage === "history" && user && <ClientHistory user={user} />}
      {currentPage === "admin" && user?.isAdmin && <AdminPanel />}

      {/* Modal de Login */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold text-gray-800">Doce Amor</span>
              </div>
              <p className="text-gray-600 mb-4">
                Bem Casados Artesanais feitos com muito carinho para o seu grande dia. Cada doce é preparado com
                ingredientes selecionados e muito amor.
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">Mais de 500 casais satisfeitos</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@doceamor.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Horário</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2024 Doce Amor. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LandingPage({ onStartBuilding }: { onStartBuilding: () => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Bem Casados
              <span className="text-pink-500"> Artesanais</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Personalize seu bem casado escolhendo o recheio e embalagem perfeitos para o seu grande dia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={onStartBuilding} size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-4">
                Montar Meu Bem Casado
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
                Ver Galeria
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-3 text-gray-600 text-lg">Mais de 500 casais satisfeitos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Por que escolher a Doce Amor?</h3>
            <p className="text-gray-600 text-lg">Qualidade, sabor e carinho em cada bem casado</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Feito com Amor</h4>
                <p className="text-gray-600">
                  Cada bem casado é preparado artesanalmente com ingredientes selecionados e muito carinho
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-pink-500" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Personalização Total</h4>
                <p className="text-gray-600">
                  Monte seu bem casado do seu jeito, escolhendo recheio, embalagem e quantidade
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-pink-500" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Qualidade Premium</h4>
                <p className="text-gray-600">
                  Ingredientes de primeira qualidade e apresentação impecável para o seu evento especial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sabores Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Sabores Irresistíveis</h3>
            <p className="text-gray-600 text-lg">Escolha entre nossos deliciosos recheios artesanais</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { nome: "Doce de Leite", cor: "#D2691E", desc: "Cremoso e tradicional" },
              { nome: "Brigadeiro", cor: "#8B4513", desc: "Com chocolate belga" },
              { nome: "Beijinho", cor: "#F5F5DC", desc: "Com coco fresco" },
              { nome: "Nutella", cor: "#654321", desc: "Creme de avelã original" },
              { nome: "Frutas Vermelhas", cor: "#DC143C", desc: "Geleia artesanal" },
              { nome: "Limão", cor: "#FFFF00", desc: "Curd de limão siciliano" },
            ].map((sabor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: sabor.cor }} />
                    <div>
                      <h4 className="font-semibold text-gray-800">{sabor.nome}</h4>
                      <p className="text-sm text-gray-600">{sabor.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">500+</div>
              <div className="text-gray-600">Casais Atendidos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">50k+</div>
              <div className="text-gray-600">Bem Casados Produzidos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">6</div>
              <div className="text-gray-600">Sabores Exclusivos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
              <div className="text-gray-600">Satisfação Garantida</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Pronto para criar seu bem casado perfeito?</h3>
          <p className="text-xl mb-8 opacity-90">
            Monte agora mesmo o bem casado dos seus sonhos com nossa ferramenta interativa
          </p>
          <Button
            onClick={onStartBuilding}
            size="lg"
            className="bg-white text-pink-500 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">O que nossos clientes dizem</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                nome: "Maria & João",
                texto: "Os bem casados ficaram perfeitos! Todos os convidados elogiaram o sabor e a apresentação.",
                rating: 5,
              },
              {
                nome: "Ana & Carlos",
                texto: "Atendimento excepcional e qualidade impecável. Recomendo para todos os casais!",
                rating: 5,
              },
              {
                nome: "Lucia & Pedro",
                texto: "A personalização foi incrível, conseguimos criar exatamente o que queríamos.",
                rating: 5,
              },
            ].map((depoimento, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{depoimento.texto}"</p>
                  <p className="font-semibold text-gray-800">- {depoimento.nome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

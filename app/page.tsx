"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Coffee, Star, Users, Gift, Loader2 } from "lucide-react"
import { useState } from "react"

export default function BuyMeCoffeePage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePayment = async (amount: number, type: "subscription" | "one-time", tier?: string) => {
    const buttonId = tier || `${type}-${amount}`
    setLoading(buttonId)

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, type, tier }),
      })

      const data = await response.json()

      if (data.success) {
        // In a real implementation, redirect to Stripe checkout
        alert(`Payment initiated! ${data.message}\n\nIn a real app, you would be redirected to: ${data.paymentUrl}`)
      } else {
        alert("Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-card to-background">
        <div className="absolute inset-0 bg-[url('/coffee-beans-pattern-subtle-background.png')] opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-playfair text-4xl font-bold text-foreground md:text-6xl">
              Thank you for supporting my creative journey!
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every cup of coffee you buy helps me create more content, tutorials, and resources for our amazing
              community. Your support means the world to me! ☕
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Heart className="mr-2 h-4 w-4" />
                1,247 supporters
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Coffee className="mr-2 h-4 w-4" />
                3,891 coffees bought
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Subscription Tiers */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">Choose Your Support Level</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Pick a tier that works for you. Every contribution, big or small, helps me continue creating content you
            love.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Supporter Tier */}
          <Card className="relative border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-playfair text-2xl">Supporter</CardTitle>
              <CardDescription className="text-base">Perfect for occasional support</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">$3</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Access to supporter-only posts
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Monthly behind-the-scenes updates
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  My eternal gratitude ❤️
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => handlePayment(3, "subscription", "Supporter")}
                disabled={loading === "Supporter"}
              >
                {loading === "Supporter" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Become a Supporter"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Champion Tier */}
          <Card className="relative border-2 border-primary hover:shadow-lg transition-shadow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                <Star className="mr-1 h-3 w-3" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-playfair text-2xl">Champion</CardTitle>
              <CardDescription className="text-base">For dedicated community members</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">$8</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Everything from Supporter tier
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Early access to new content
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Monthly Q&A sessions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Discord community access
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => handlePayment(8, "subscription", "Champion")}
                disabled={loading === "Champion"}
              >
                {loading === "Champion" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Become a Champion"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Super Fan Tier */}
          <Card className="relative border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <Gift className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="font-playfair text-2xl">Super Fan</CardTitle>
              <CardDescription className="text-base">For the ultimate supporters</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-accent">$15</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  Everything from Champion tier
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  1-on-1 monthly video call
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  Custom content requests
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  Exclusive merchandise
                </li>
              </ul>
              <Button
                variant="secondary"
                className="w-full mt-6"
                size="lg"
                onClick={() => handlePayment(15, "subscription", "Super Fan")}
                disabled={loading === "Super Fan"}
              >
                {loading === "Super Fan" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Become a Super Fan"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* One-time Support */}
      <section className="bg-card/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-foreground md:text-4xl">Prefer One-Time Support?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              No commitment needed! Buy me a coffee whenever you feel like showing some love.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handlePayment(3, "one-time")}
              disabled={loading === "one-time-3"}
            >
              {loading === "one-time-3" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Coffee className="h-5 w-5" />}
              $3 - One Coffee
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handlePayment(5, "one-time")}
              disabled={loading === "one-time-5"}
            >
              {loading === "one-time-5" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Coffee className="h-5 w-5" />}
              $5 - Large Coffee
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handlePayment(10, "one-time")}
              disabled={loading === "one-time-10"}
            >
              {loading === "one-time-10" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Coffee className="h-5 w-5" />
              )}
              $10 - Coffee & Pastry
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => {
                const amount = prompt("Enter custom amount (e.g., 25):")
                if (amount && !isNaN(Number(amount))) {
                  handlePayment(Number(amount), "one-time")
                }
              }}
              disabled={loading?.startsWith("one-time")}
            >
              <Coffee className="h-5 w-5" />
              Custom Amount
            </Button>
          </div>
        </div>
      </section>

      {/* Personal Touch Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted/30 border-0">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-[url('/friendly-creator-avatar.png')] bg-cover bg-center"></div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">A Message From Me</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {
                    "Hi there! I'm incredibly grateful for every single person who supports my work. Your contributions don't just buy me coffee (though I do love my coffee ☕) - they give me the freedom to create, experiment, and share knowledge with our amazing community. Whether you choose a monthly subscription or a one-time coffee, you're directly helping me continue this journey. Thank you for being part of this adventure!"
                  }
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>With love and gratitude</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-playfair text-3xl font-bold md:text-4xl mb-4">Ready to Support My Journey?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join hundreds of amazing supporters who help make my content possible. Every contribution makes a
            difference!
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => handlePayment(3, "subscription", "Supporter")}
            disabled={loading === "Supporter"}
          >
            {loading === "Supporter" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Coffee className="mr-2 h-5 w-5" />
                Become a Supporter Today
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Made with ❤️ for my amazing community</p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                YouTube
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

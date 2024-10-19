import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, MessageCircle, Mic } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className=" h-12 w-12 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary">Internal Toolbox</h1>
          <p className="mt-2 text-xl text-muted-foreground">Your gateway to productivity</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Link href="/financial-dashboard" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Financial Dashboard</CardTitle>
                <BarChart3 size={28} className="text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription>Access real-time financial data and analytics</CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/voice-notes" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Voice Note Creator</CardTitle>
                <Mic size={28} className="text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription>Create and manage voice notes effortlessly</CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/chat" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">AI Chat</CardTitle>
                <MessageCircle size={28} className="text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription>Chat with our self-hosted AI</CardDescription>
              </CardContent>
            </Card>
          </Link>        </div>
      </div>
    </div>
  )
}
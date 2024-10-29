"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Shield, Lock, RefreshCw, ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: <Shield className="h-12 w-12 mb-4 text-primary" />,
      title: "Secure Mixing",
      description: "State-of-the-art encryption protocols",
    },
    {
      icon: <Lock className="h-12 w-12 mb-4 text-primary" />,
      title: "Complete Privacy",
      description: "Untraceable transactions",
    },
    {
      icon: <RefreshCw className="h-12 w-12 mb-4 text-primary" />,
      title: "Fast Processing",
      description: "Lightning-quick mixing",
    },
  ];

  const testimonials = [
    {
      quote: "The most secure mixing service I've ever used. Highly recommended!",
      author: "Anonymous User",
    },
    {
      quote: "Fast, reliable, and completely private. Exactly what I needed.",
      author: "Crypto Enthusiast",
    },
    {
      quote: "Outstanding service with top-notch security features.",
      author: "Privacy Advocate",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Sparkles className="mr-1 h-3 w-3" /> New Generation Mixer
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Secure & Anonymous
              <span className="text-primary block mt-2">Crypto Mixing</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Enhance your privacy with our advanced cryptocurrency mixing service
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/mix">
                <Button size="lg" className="text-lg px-8 group">
                  Start Mixing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-secondary/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="flex flex-col items-center text-center h-full">
                    {feature.icon}
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm">
                <Zap className="h-8 w-8 mb-4 mx-auto text-primary" />
                <div className="text-3xl font-bold mb-2">$10M+</div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm">
                <Shield className="h-8 w-8 mb-4 mx-auto text-primary" />
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm">
                <Lock className="h-8 w-8 mb-4 mx-auto text-primary" />
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm">
                <RefreshCw className="h-8 w-8 mb-4 mx-auto text-primary" />
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            What Users Say
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-8 text-center bg-secondary/50 backdrop-blur-sm">
                      <blockquote className="text-lg mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-muted-foreground not-italic">
                        - {testimonial.author}
                      </cite>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our platform for their privacy needs
            </p>
            <Link href="/mix">
              <Button size="lg" className="text-lg px-8">
                Start Mixing Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
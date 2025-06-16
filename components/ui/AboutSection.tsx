import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen py-20 px-4 md:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-primary to-purple-400 bg-clip-text text-transparent">
          Founder's Story
        </h2>
        <div className="space-y-6 text-lg text-foreground/80">
          <p>
            Welcome to Trade Craft, where innovation meets trading excellence. Our journey began with a simple yet powerful vision: to democratize algorithmic trading and make it accessible to traders of all levels.
          </p>
          <p>
            As a team of passionate traders and developers, we've experienced firsthand the challenges of traditional trading platforms. We saw the need for a more intuitive, powerful, and user-friendly solution that would empower traders to create, test, and deploy their strategies with confidence.
          </p>
          <p>
            Trade Craft was born from this vision. We've combined cutting-edge technology with deep trading expertise to create a platform that not only simplifies the trading process but also enhances it with powerful features like backtesting, strategy building, and real-time market analysis.
          </p>
          <p>
            Our commitment to excellence and innovation drives us to continuously improve and expand our platform. We're not just building a trading platform; we're creating a community where traders can learn, grow, and succeed together.
          </p>
        </div>
      </div>
    </section>
  );
} 
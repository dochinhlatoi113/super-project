import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Session middleware for Passport
  app.use(session.default({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 6000);
  console.log(`🚀 NestJS server running on port ${process.env.PORT ?? 6000}`);
}
bootstrap();

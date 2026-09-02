import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql' });

  // Connect to MongoDB
  const PORT = process.env.PORT || 4000;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduportal';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
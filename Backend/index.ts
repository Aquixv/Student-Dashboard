import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import dns from "node:dns";
import { setServers } from 'node:dns';
import { seedCourses } from './seeder';
import { getUserContext } from './util/authContext';

dotenv.config();

setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first'); 
mongoose.connect(process.env.URI as string, {
  family: 4,
})

.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('MongoDB connection error:', err));

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return await getUserContext(req);
  }
});

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  const URI = process.env.URI || 'mongodb://localhost:27017/eduportal';

  try {
    await mongoose.connect(URI);
    console.log('📦 Connected to MongoDB');
    await seedCourses()
    
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
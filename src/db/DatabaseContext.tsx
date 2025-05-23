import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initSqlJs, { Database } from 'sql.js';
import { CREATE_TABLES, SEED_USERS, SEED_COMPETITION, SEED_PHOTOS } from './schema';

// Define the shape of our database context
interface DatabaseContextType {
  db: Database | null;
  isLoading: boolean;
  error: string | null;
  executeQuery: (sql: string, params?: any[]) => any[];
}

// Create the context with a default value
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        
        // Initialize SQL.js
        const SQL = await initSqlJs({
          // Specify the path to the sql-wasm.wasm file
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`
        });
        
        // Create a new database
        const database = new SQL.Database();
        
        // Create tables
        database.run(CREATE_TABLES);
        
        // Seed initial data
        database.run(SEED_USERS);
        database.run(SEED_COMPETITION);
        database.run(SEED_PHOTOS);
        
        setDb(database);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to initialize database');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();

    // Clean up the database when the component unmounts
    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  // Function to execute SQL queries
  const executeQuery = (sql: string, params: any[] = []): any[] => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const statement = db.prepare(sql);
      
      // Bind parameters if provided
      if (params.length > 0) {
        statement.bind(params);
      }
      
      // Execute the query and collect results
      const results: any[] = [];
      while (statement.step()) {
        results.push(statement.getAsObject());
      }
      
      // Finalize the statement
      statement.free();
      
      return results;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  };

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error, executeQuery }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

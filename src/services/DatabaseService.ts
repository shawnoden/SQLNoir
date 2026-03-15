import initSqlJs, { Database } from "sql.js";

export interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
}

class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private SQL: any;
  private initialized = false;
  private currentCaseId: string | null = null;
  private currentLocale: string | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  static async loadCaseSchema(caseId: string, locale: string = 'en'): Promise<string[]> {
    if (locale !== 'en') {
      try {
        const localizedSchema: any = await import(`../cases/schemas/${locale}/${caseId}.ts`);
        return localizedSchema.default;
      } catch {
        // Fallback to English schema
      }
    }
    const caseSchema: any = await import(`../cases/schemas/${caseId}.ts`);
    return caseSchema.default;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.SQL = await initSqlJs({
        locateFile: (file) => `/${file}`,
      });
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize SQL.js:", error);
      throw error;
    }
  }

  async loadCaseDatabase(caseId: string, locale: string = 'en'): Promise<void> {
    if (!this.initialized) {
      throw new Error("SQL.js not initialized");
    }

    if (this.currentCaseId === caseId && this.currentLocale === locale && this.db) {
      return; // Database for this case and locale is already loaded
    }

    // Close existing database if any
    if (this.db) {
      this.db.close();
      this.db = null;
    }

    // Get case schema data
    const caseSchema = await DatabaseService.loadCaseSchema(caseId, locale);
    if (!caseSchema) {
      throw new Error(`No case found with ID ${caseId}`);
    }

    // Initialize case-specific database
    this.db = new this.SQL.Database();

    try {
      // Execute all schema statements
      caseSchema.forEach((statement: string) => {
        this.db!.run(statement);
      });
      this.currentCaseId = caseId;
      this.currentLocale = locale;
    } catch (error) {
      console.error("Error loading case database:", error);
      throw error;
    }
  }

  async executeQuery(sql: string): Promise<QueryResult> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const result = this.db.exec(sql);

      if (result.length === 0) {
        return { columns: [], values: [] };
      }

      return {
        columns: result[0].columns,
        values: result[0].values,
      };
    } catch (error) {
      console.error("Query execution error:", error);
      return {
        columns: [],
        values: [],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const db = DatabaseService.getInstance();

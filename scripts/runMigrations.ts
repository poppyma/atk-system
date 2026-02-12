import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Running migrations...');
    
    // Read and execute migration files
    const migrationsDir = path.join(process.cwd(), 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`Executing migration: ${file}`);
        
        // Split by semicolon to handle multiple statements
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await client.query(statement);
            } catch (err: any) {
              // Ignore "already exists" errors for idempotency
              if (err.code !== '42P07' && err.code !== '42701') {
                throw err;
              }
              console.log(`  (Skipped: ${err.message})`);
            }
          }
        }
        
        console.log(`  ✓ ${file} completed`);
      }
    }
    
    console.log('All migrations completed!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default runMigrations;
